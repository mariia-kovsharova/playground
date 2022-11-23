/**
 * Transducer - это техника, которая позволяет создавать конвейер функций (пайплайн) БЕЗ
 * создания промежуточных коллекций.
 *
 * Например, если есть массив из 10 элементов
 */

const collection = Array.from({ length: 10 }, (_item: number, index: number) => index + 1);

/**
 * Если традиционно выполнять преобразования через map/filter, на каждом этапе будет создаваться
 * по сути ненужная коллекция. Для списков большого размера это может сильно снижать производительность.
 */

// Тут создается 3 промежуточных массива
const transformedCollection = collection
    .map((item: number) => item * 2)
    .filter((item: number) => item % 2 === 0)
    .map((item: number) => `i am ${item}`);

/**
 * Цель transducers - избежать немедленного создания коллекции (произвести вычисления без промежуточных коллекций).
 * Технически это составная "сужаемая" функция высшего порядка
 * (transducer is a composable higher order reducer function)
 * 
 * Пример обычного преобразования через map/filter (палочка это элемент коллекции)
 * [|] > [|] > [|] > [|]
 * 
 * Пример трансдьюсера
 * 
 * [|] > > > [|]
 *
 * Есть два варианта реализовать трансдьюсеры:
 * 1) Push - жадное выполнение
 * 2) Pull - ленивое выполнение
 *
 * Push - реализация с помощью reduce, когда берется значение и проталкивается по всем обработчикам.
 * (Т.е. берется элемент и по всем лямбдам протаскивается, итоговое значение записывается в массив, например)
 *
 * (array.reduce() takes one value at a time from the array and pushes it through the reducer,
 *  resulting in a new value at the other end.)
 *
 *
 * Pull - реализация с помощью итератора, ленивое оно потому, что ничего не будет выполняться,
 * пока не будет запрошено сверху через it.next()
 *
 * Трансдьюсеры - это редьюсеры высокого порядка - они принимают редьюсер и возвращают новый редьюсер
 *
 * Различия с обычным редьюсером:
 * reducer = (accumulator, current) => accumulator
 * transducer = reducer => reducer
 *
 * Реализация Push-transducer
 * */

/**
 * map и filter можно реализовать через reduce
 * 
 * Рассмотрим пример прибавления единицы через reduce
 * tMapReducer = (acc, item) => acc.concat(item + 1);
 * 
 * [1, 2, 3].reduce(tMapReducer, []); // [2, 3, 4];
 * 
 * Функцию преобразования можно вынести наружу, получим следующую структуру:
 * tMap = transformFn => (acc, item) => acc.concat(transformFn(item));
 * 
 * [1, 2, 3, 4, 5].reduce(tMap((x) => x + 1), []); // [2, 3, 4, 5, 6];
 * 
 * Аналогично с фильтром
 * tFilterReducer = (acc, item) => item % 2 === 0 ? acc.concat(item) : acc;
 * 
 * Вынесем предикат наружу:
 * tFilter = predicateFn => (acc, item) => predicateFn(item) ? acc.concat(item) : acc;
 * 
 * [1, 2, 3, 4, 5].reduce(tFilter((x) => x % 2 === 0), []); // [2, 4];
 * 
 * Заметим, что и map, и фильтр используются reduce, чтобы указать, КАК обрабатывать элементы коллекции
 *  
 * [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
 *      .reduce(tMap(x => x + 1), [])
 *      .reduce(tFilter(x => x % 2 === 0), []);
 * 
 * Рассмотрим еще раз вместе:
 * 
 * tMap = transformFn => (acc, item) => acc.concat(transformFn(item));
 * tFilter = predicateFn => (acc, item) => predicateFn(item) ? acc.concat(item) : acc;
 * 
 * Вынесем функцию, которая рассказывает КАК обрабатывать элементы, наружу
 * 
 * const map = transformFn => reducingFn => (acc, item) => reducingFn(acc, transformFn(item));
 * const filter = predicateFn => reducingFn => (acc, item) => predicateFn(item) ? reducingFn(acc, item) : acc;
 * 
 * Получается процесс такой (на примере map):
 * 1) Элемент поступает в transformFunction
 * 2) Обрабатывается этой функцией
 * 3) В результате в reducingFn в качестве acc передается прошлый аккумулятор, а в качестве item
 *    наш трансформированный на ш.1 элемент
 * 
 * [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
 *   .reduce(map(x => x + 1)((acc, item) => acc.concat(item)), [])
 *   .reduce(filter(x => x % 2 === 0)((acc, item) => acc.concat(item)), []); // [2, 4, 6, 8, 10]
 * 
 * ПРИМЕЧАНИЕ:
 * т.к. array.concat создает каждый раз новый массив, думаю,
 * куда больший смысл будет иметь мутирование аккумулятора, пусть это не по канонам ФП
 * 
 * 
 * Далее, чтобы не использовать reduce на каждый шаг, мы сделаем так, чтобы ВНУТРИ одного
 * reduce функция ИЗМЕНЯЛАСЬ 
 * 
 * Т.к. каждый трансдьюсер берет reducingFn и возвращает reducingFn, мы можем компонавать их вместе,
 * используя обратную композицию (пайплайн): pipe(f, g, k) это k(g(f(x)))
 * 
 * Например, filter берет редьюсер и вставляет перед ним проверку на предикат
 * А map берет редьюсер, но перед тем, как засунуть в него аккумулятор и элемент, преобразовывает элемент 
 */

type TransformFunction<InputType, OutputType> = (item: InputType) => OutputType;
// map = transformFn => step inside reducer => reducer
const map =
    <Input, Output>(transform: TransformFunction<Input, Output>) =>
        (step: (acc: Output, i: Output) => Output) =>
            (accumulator: Output, item: Input): Output => {
                // Here we transform the input value to the output and pass it into next step
                const transformedItem = transform(item);
                return step(accumulator, transformedItem);
            };


type PredicateFunction<InputType> = (value: InputType) => boolean;
// filter = predicate => step inside reducer => reducer
const filter =
    <Input>(predicate: PredicateFunction<Input>) =>
        (step: (acc: Input, i: Input) => Input) =>
            (accumulator: Input, item: Input): Input => {
                // If the current item passed the predicate function, we can continue its processing
                // or we do not need to process it, instead we return previously processed accumulator

                return predicate(item) ? step(accumulator, item) : accumulator;
            };

const pipe =
    <T, R = T>(...steps) =>
        /**
         * pipe принимает сначала набор функций-шагов, которые должно пройти значение,
         * затем функцию, которая управляет поведением значения, полученного в результате прохода всех обработчиков
         * (т.е. "описывает", как именно дальше работать с полученным значением).
         */
        (outerReducer: (acc: R, item: R) => R) => {
            /**
             * т.к. последней мы получаем функцию, которая получает уже преобразованные данные, эта функция
             * должна получать в себя результат последнего преобразования, а значит, именно последний шаг
             * должен получать аккумулирующую функцию, а уже все прошлые фукнции должны ссылаться на свою следующую,
             * КАК НА СЛЕДУЮЩИЙ ШАГ
             * 
             * Т.е. по своей структуре получаем пайплайн вида, где число - порядковый номер функции-трандьюсера
             * outerReducer((acc, item) => {
             *      const finalItem = transducerN(...transducer3(transducer2(transduser1(item))));
             *      ...
             * })
             * 
             * Классическая композиция compose(f,g,k) = f(g(k(x))) не подходит, т.к.
             * последней мы передаем итоговый редьюсер, который показывает КАК именно аккумулировать результат
             * 
             * Для этого как раз прекрасно подходит пайплайн
             * pipe(f,g,k)(value) = k(g(f(value)))
             */
            return steps.reduceRight((previouslyTransformedResult, currentFunction) => {
                return currentFunction(previouslyTransformedResult);
            }, outerReducer);
        };

export { map, filter, pipe };

