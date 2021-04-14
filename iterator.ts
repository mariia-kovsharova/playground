/**
 * Итератор - это чётко определённый интерфейс для перебора серии значений с помощью некого продьюсера.
 * Как и в большинстве других языков, интерфейс итератора в JavaScript организован с помощью вызова метода next()
 * каждый раз, когда мы хотим получить следующее значение.
 * 
 * Реализация итератора - итерируемый объект должен иметь метод по ключу [Symbol.iterator].
 * Этот метод должен релизовывать The iterable protocol
 * 
 * метод должен возвращать объект с методом next(), который, в свою очередь, должен возвращать объект интерфейса IteratorResult = { value: unknown, done: boolean }
 */

 class MyIterable implements Iterable<string> {
    constructor (private coll: string[]) {};

    [Symbol.iterator](): Iterator<string> {
        let index = 0;
        
        const next = (): IteratorResult<string> => {
            const done =  index === this.coll.length - 1;
            if (done) {
                return ({ done, value: null });
            } else {
                const value = this.coll[index];
                index += 1;
                return ({ done, value });
            }
        };

        return { next };
    }
 }

 const myIterable = new MyIterable(['hello', 'i', 'am', 'iterable', 'object']);
 for (const word of myIterable) {
    console.log(word);
 }