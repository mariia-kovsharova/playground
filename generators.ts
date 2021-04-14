/**
 * Генераторы - особая форма функций, которые могут прерывать свое выполнение
 * с помощью специального синтаксиса - yield сигнализирует внешнему (клиентскому) коду
 * о том, что функция находится на "паузе"
 */

function *generator(): Generator<string, string> {
    console.log('generator started');
    yield 'Hello!'; // 1
    console.log('after first yield');
    yield 'Hello again!'; // 2
    console.log('after second yield');
    return 'Bye!'; // 3
}

const it1 = generator(); // <== получение итератора для генератора
it1.next(); // <== запуск генератора, выполнение кода до (1) yield.
           // Возвращает объект, который соблюдает the iterable protocol, возвращенное значение - 'Hello'
it1.next(); // <== выполнение преостановленного кода до (2) yield, возврат 'Hello again'
it1.next(); // <== выполняет код до окончания функции (3), 'Bye!'

/**
 * Итак, генератор - это особый вид функции, который может запускаться и приостанавливаться
 * один раз или несколько раз, и ему совершенно не обязательно выполняться до конца.
 */

/**
 * Генераторы являются т.н. корутинами - они могут не только возвращать какие-то значения из функции
 * (т.е. быть продьюсером данных), но так же и принимать значения из управляющего кода. Таким образом можно
 * сказать, что устанавливается двунаправленная связь между функцией-генератором и управляющим кодом
 */

function *gen(step: number = 1) { // <== в качестве шага генератор принимает шаг
    console.log('generator started');

    let currentValue = yield; // <== тут генератор обращается к управляющему коду. значение,
                              // переданное из управляющего кода, присваивается переменной currentValue

    console.log('after first yield, the start value have been initialized');

    while (true) { // <== такое условие свойственно генератору, который продьюсит бесконечную последовательность чисел
        yield currentValue; // <== возвращаем текущее значение управляюещему коду
        currentValue += step; // <== изменяем значение в генераторе
    }
}

/**
 * И вот здесь мы можем увидеть разницу между тем, как ведут себя в процессе вызова генератор и обычная функция.
 * gen(5) выглядит знакомо, однако, в отличие от обычной функции, генератор в этот момент еще не начал выполняться.

  Вместо этого, здесь мы создаём объект итератор, который присваиваем переменной it — он будет контролировать
  выполнение *gen(..). Затем мы вызываем it.next(), тем самым давая понять генератору, что надо продолжить 
  выполнение из его текущего местоположения - до следующего yield или до самого конца.
 */

const it = gen(5); // <== получение генератора
it.next(); // <== запуск генератора
it.next(5); // <== передача в генератор стартового значения последовательности

console.log(it.next()); // 10
console.log(it.next()); // 15
console.log(it.next()); // 20

it.return(); // принудительное завершение генератора - т.к. он бесконечный, посылаем сигнал об окончании работы

/** С генераторами всегда на один next больше, чем количество yield-ов
 * 
 *  const y = x * (yield);
    return y;

Этот первый yield как бы задаёт вопрос: "Какое значение здесь должно быть?"
И кто же отвечает на это вопрос? Первый вызов next() привёл генератор к этой точке, поэтому он не может дать ответ.
Поэтому второй вызов next(..) отвечает на вопрос, заданный первым yield.

Важно: Мы не передаём никакого значения в первый вызов next(), и на это есть причины. 

Только поставленный на паузу yield может принимать значение, передаваемое вызовом next(..), а в начале работы
генератора, когда мы вызываем первый next(), генератор ещё не содержит в себе "замороженного" yield, который
мог бы принять значение. Спецификации и все совместимые браузеры просто молча отбрасывают (игнорируют) всё, 
что будет передано в первый вызов next(). Поэтому передавать туда значение является не слишком хорошей идеей,
так как в этом случае вы создаёте код, который может просто молча "упасть" без каких-либо ошибок, 
и это может сбивать с толку.

По этой причине мы всегда запускаем первый вызов next(), не передавая в него аргументы.

Если в генераторе нет прямой инструкции return — в генераторах нет необходимости в return, 
в отличие от обычных функций — здесь есть скрытый/неявный return; (aka return undefined;), 
который и возвращает значение на поставленный финальным вызовом it.next() вопрос.
 */

let a = 1;
let b = 2;

function *foo() {
	a++;
	yield;
	b = b * a;
	a = (yield b) + 3;
}

function *bar() {
	b--;
	yield;
	a = (yield 8) + b;
	b = a * (yield 2);
}

/**
 * В зависимости от того, в каком порядке вызываются итераторы, управляющие *foo () и *bar (),
 * результатом выполнения программы могут становится разные значения.
 */

/** ES6 вводит обход итерируемых сущностей (см. iterator.ts)
 * Цикл for..of автоматически вызывает next() во время каждой итерации — и он не передаёт никаких значений в next()
 * и автоматически прекратит своё выполнение, как только итератор возвратит done:true.
 * Таким образом довольно удобно перебирать некий набор данных.
 * 
 * Цикл for..ofожидает, что объект будет итерируемым, поэтому он ищет и вызывает функцию Symbol.iterator.
 * 
 * ИТЕРИРУЕМЫЙ - означает, что объект включает в себя итератор, коротый может проходить по значениям.
 * 
 * Технически генератор не является итерируемым, хотя ведёт себя очень похоже - когда вы вызываете генератор,
 * в ответ вы получаете итератор.
 */

class MyCollection implements Iterable<number> {
    private collection: number[];

    constructor(...values: number[]) {
        this.collection = values;
    }

    /**
     * Возвращаемый генератором итератор также содержит в себе функцию Symbol.iterator, которая просто возвращает саму себя.
     *  Другими словами, возвращаемый генератором итератор и сам является итерируемым!
     */
    // Синтаксис объявления генератора на уровне класса
    * [Symbol.iterator]() {
        for (let i = 0; i < this.collection.length; i += 1) {
            yield this.collection[i];
        }
  }
}

const coll = new MyCollection(1, 2, 3, 4, 5);

for (const el of coll) {
    console.log(el);
}