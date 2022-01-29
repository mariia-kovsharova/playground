/**
 * Transducer - это техника, которая позволяет создавать конвейер функций (пайплайн) БЕЗ
 * создания промежуточных коллекций.
 *
 * Например, если есть массив из 10 элементов
 */

const collection = <number[]>Array.from({ length: 10 }, (_item: number, index: number) => index + 1);

/**
 * Если традиционно выполнять преобразования через map/filter, на каждом этапе будет создаваться
 * по сути ненужная коллекция.
 * В случае, если в массиве 10 элементов, это не страшно, а вот если 10 млн элементов, может быть грустно
 */

const transformedCollection = <string[]>collection
    // после map - новая коллекция
    .map((item: number) => item * 2)
    // и после filter тоже
    .filter((item: number) => item % 2 === 0)
    // и снова новая коллекция
    .map((item: number) => `i am ${item}`);

/**
 * Цель transducers - избежать немедленного создания коллекции (произвести вычисления без промежуточных коллекций).
 * Технически это составная "сужаемая" функция высшего порядка
 * (transducer is a composable higher order reducer function)
 * 
 * Пример обычного редьюсера (палочка это элемент коллекции)
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
 * [1, 2, 3, 4, 5].reduce(tMap((x) => x + 1), []); // [2, 3, 4];
 * 
 * Аналогично с фильтром
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
 * И tMap, и tFilter используют acc.concat в качестве reducing function
 * 
 * Вынесем reducing function наружу
 * 
 * const mapping = transformFn => reducingFn => (acc, item) => reducingFn(acc, transformFn(item));
 * const filtering = predicateFn => reducingFn => (acc, item) => predicateFn(item) ? reducingFn(acc, item) : acc;
 * 
 * Получается процесс такой (на примере map):
 * поступивший элемент преобразовывается и вместе с текущим аккумулятором передается в reducing function как параметры 
 * 
 * [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
 *   .reduce(mapping(x => x + 1)((acc, item) => acc.concat(item)), [])
 *   .reduce(filtering(x => x % 2 === 0)((acc, item) => acc.concat(item)), []); // [2, 4, 6, 8, 10]
 * 
 * ПРИМЕЧАНИЕ:
 * т.к. array.concat создает каждый раз новый массив, думаю,
 * куда больший смысл будет иметь мутирование аккумулятора (acc.push(item); return acc)
 * 
 * 
 * Далее, чтобы не использовать reduce на каждый шаг, мы сделаем так, чтобы ВНУТРИ одного
 * reduce функция ИЗМЕНЯЛАСЬ 
 * 
 * Т.к. каждый трансдьюсер берет reducingFn и возвращает reducingFn, мы можем компонавать их вместе,
 * используя композицию: compose(f, g, k) это f(g(k(x)))
 * 
 * Например, filter берет редьюсер и вставляет перед ним проверку на предикат
 * А map берет редьюсер, но перед тем, как засунуть в него аккумулятор и элемент, преобразовывает элемент 
 */

// map = transformFn => reducing function => reducer
const map =
    <T, R = T>(transformFn: (i: T) => R) =>
        (reducingFn: (acc: R[], i: R) => R[]) =>
            (acc: R[], currentItem: T): R[] => {
                const transformedValue = transformFn(currentItem);
                return reducingFn(acc, transformedValue);
            };

// filter = predicate => reducing function => reducer
const filter =
    <T>(predicateFn: (i: T) => boolean) =>
        (reducingFn: (acc: T[], i: T) => T[]) =>
            (acc: T[], currentItem: T): T[] => {
                // Если текущий итем подходит по предикату, он идет по "трубе" обработчиков дальше
                const isPassedPredicate = predicateFn(currentItem);
                if (isPassedPredicate) {
                    return reducingFn(acc, currentItem);
                }
                // Если не подходит, возвращается просто аккумулятор
                return acc;
            };

const pipe =
    <T, R = T>(...steps) =>
        /**
         * pipe принимает сначала набор функций-шагов, которые должно пройти значение,
         * затем функцию, которая управляет поведением значения, полученного в результате прохода всех обработчиков
         * (т.е. "описывает", как именно дальше работать с полученным значением).
         */
        (howToAccumulateFinalValues: (acc: R[], item: R) => R[]) => {
            /**
             * т.к. последней мы получаем функцию, которая получает уже преобразованные данные, эта функция
             * должна получать в себя результат последнего преобразования, а значит, именно последний шаг
             * должен получать аккумулирующую функцию, а уже все прошлые фукнции должны ссылаться на свою следующую,
             * КАК НА СЛЕДУЮЩИЙ ШАГ
             * 
             * final acc fn <- previous step <- previous step <- ... <- transducer
             * 
             * Т.е. по своей структуре получаем композицию
             * pipe(f, g, k) это f(g(k(x)))
             */
            return steps.reduceRight((previouslyTransformedResult, currentFunction) => {
                return currentFunction(previouslyTransformedResult);
            }, howToAccumulateFinalValues);
        };

export { map, filter, pipe };
