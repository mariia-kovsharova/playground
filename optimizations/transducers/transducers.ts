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

// map = transformFn => step => reducer
const map =
    <T, R = T>(transformFn: (i: T) => R) =>
        (stepFn: (acc: R[], i: R) => R[]) =>
            (acc: R[], currentItem: T): R[] => {
                const transformedValue = transformFn(currentItem);
                return stepFn(acc, transformedValue);
            };

// filter = predicate => step => reducer
const filter =
    <T>(predicateFn: (i: T) => boolean) =>
        (stepFn: (acc: T[], i: T) => T[]) =>
            (acc: T[], currentItem: T): T[] => {
                // Если текущий итем подходит по предикату, он идет по "трубе" обработчиков дальше
                const isPassedPredicate = predicateFn(currentItem);
                if (isPassedPredicate) {
                    return stepFn(acc, currentItem);
                }
                // Если не подходит, возвращается просто аккумулятор
                return acc;
            };

const pipe =
    <T, R = T>(...steps) =>
        // pipe принимает сначала набор функций-шагов, которые должно пройти значение,
        // затем функцию, которая управляет поведением значения, полученного в результате прохода всех обработчиков
        // (т.е. "описывает", как именно дальше работать с полученным значением).
        (howToAccumulateFinalValues: (acc: R[], item: R) => R[]) => {
            // т.к. последней мы получаем функцию, которая получает уже преобразованные данные, эта функция
            // должна получать в себя результат последнего преобразования, а значит, именно последний шаг
            // должен получать аккумулирующую функцию, а уже все прошлые фукнции должны ссылаться на свою следующую,
            // КАК НА СЛЕДУЮЩИЙ ШАГ

            // final acc fn <- previous step <- previous step <- ... <- transducer
            return steps.reduceRight((y, prevStep) => {
                // Самый последний шаг получает функцию-инструкцию, как аккумулировать значения
                // Шаги, идущие перед ним, оборачивают эту функцию
                const stepReducer = prevStep(y);
                return stepReducer;
            }, howToAccumulateFinalValues);
        };

export { map, filter, pipe };
