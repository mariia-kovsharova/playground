// РАССМАТРИВАЕМ ТЕМЫ:дженерики, advanced-дженерики, условные типы

/*
Дженерик - реализация парметрического полиморфизма в TS без явного указания типа как any
*/

type Student = {
  name: string;
  age: number;
  faculty: string;
};

const students: Student[] = [
  { name: 'John', age: 18, faculty: 'art' },
  { name: 'Kevin', age: 19, faculty: 'math' },
  { name: 'Tyler', age: 17, faculty: 'physic' },
];

/* Хоть функция-дженерик и type-safe, поле prop не имеет определенного типа и в случае отсутствия свойства в объекте
(просто нет или опечатка, например "naem" вместо "name") вернется null, что является логической ошибкой
*/

function getBy<T>(models: T[], prop: string, value: unknown): T | null {
  return models.find((model: T) => model[prop] === value) ?? null;
}

const john = getBy<Student>(students, 'name', 'John'); // { name: 'John', age: 18, faculty: 'art' }
const kevin = getBy<Student>(students, 'naem', 'Kevin'); // null

/*
  Решением будет являться продвинутый дженерик
  
  Для этого воспользуемся функцией keyof - она возвращает КЛЮЧИ того типа, что указан
  конструкция <P extends keyof T> (в частности, extends) используется в таком виде, чтобы показать,
  что множество P является надмножеством ключей T.

  Затем третий параметр - его тип неизвестен, но зависит от свойства. Т.е. для объекта типа Student 
  если это свойство "age" - тип "value" должен быть числом, если это свойство "name" - тип "value" должен быть строкой.
  Раз мы уже разобрались с типом "prop" (это должен быть КЛЮЧ переданного типа), решение простое -
  тип "value" должен быть аналогичен ЗНАЧЕНИЮ по КЛЮЧУ у переданного ТИПА
 */

function advancedGetBy<T, P extends keyof T>(models: T[], prop: P, value: T[P]): T | null {
  return models.find((model: T) => model[prop] === value) ?? null;
}

const kevinAdv = advancedGetBy(students, 'name', 'Kevin'); // { name: 'Kevin', age: 19, faculty: 'math' }
const tyler = advancedGetBy(students, 'neam', 'Tyler'); // <=== ошибка - свойства naem нет в интерфейсе Student
const somethingWrong = advancedGetBy(students, 'name', 11); // <=== ошибка - свойство "name" в интерфейса Student возвращает строку, а не число


/*
  Если необходимо добавить что-то в прототип уже существующего объекта (встроенного, например)
  Необходимо дописать интерфейс встроенного объекта. Иначе будет ошибка о том, что такого свойства
  у объекта нет.
  
  TS мержит все свойства встреченных интерфейсов

  !Внимание - не работает с типами, объявленными явно (через type)
*/

interface A {
  size: number;
}

interface A {
  name: string;
}

const a: A = { name: 'foo', size: 1 }; // <== все ок, интерфейсы смержены, коллизий нет

interface Array<T> {
  getBy<P extends keyof T>(prop: P, value: T[P]): T | null;
}

Array.prototype.getBy = function <T, P extends keyof T>(
  this: T[],  // <=== типизируем this, что это массив элементов типа Т. не обязательно, если не затипизировать, this будет иметь тип any[]
  prop: P,
  value: T[P]
): T | null {
  return this.find((item: T) => item[prop] === value) || null;
};

type ObjectParameterType<T extends object, P extends keyof T> = T extends object ? T[P] : never;

type shouldBeString = ObjectParameterType<{ foo: string }, 'foo'>; // string
type shouldBeNumber = ObjectParameterType<{ foo: number }, 'foo'>; // number
type shouldBeError = ObjectParameterType<{ foo: boolean }, 'asd'>; // <== ошибка, потому что проверяем по имеющимся ключам


/*
  Использование кортежей как типы аргументов функций
*/
type aOrB = 'a' | 'b';
type tuple = [aOrB, number, string, Date];

const tupleImpl: tuple = ['a', 1, 'asd', new Date()];

type func = (...args: tuple) => void;

const myFunc: func = (a: aOrB, b: number, c: string, d: Date) => {
  return;
}

myFunc('a', 1, 'sad', new Date());

function functionToCarry(a: string, b: boolean, c: 0 | 10 | 20): void {
  return;
}

type functionToCurryType = typeof functionToCarry; // (a: string, b: boolean, c: 0 | 10 | 20);

/* Получение нового типа - парамтетры функции
 По сути - это получение коретжа из типа функции (кортеж, содержащий параметры функции), НО БЕЗ ТИПА ВОЗВРАТА
 Parameters - условный тип (см. ниже)
*/
type parameters = Parameters<typeof functionToCarry>; // [a: string, b: boolean, c: 0 | 10 | 20]

/*
  Для каррирования нужно создать условный тип, который будет получать
  массив типов (наши параметры) и возвращать первый тип - это будет тип параметра, который принимает каррированная функция.

  В тернарном операторе условного типа конструкцию T extends any[] можно рассматривать, как
  T === any[] ? T[0] : never   <== если тип Т равен any[], вернем первый элемент, иначе вернем тип never
*/

type Head<T extends any[]> = T extends any[] ? T[0] : never;

type headTest = Head<parameters>; // string <== первый параметр из кортежа, созданного из параметров функции

/*
  Затем нужно создать условный тип, который будет возвращать остаточные параметры - это то,
  что будет возвращать каррированная функция

  Что происходит ниже: создан условный тип, который проверяет, подходит ли текущий массив
  под тип "первый элемент - любого типа, остальные элементы запишем в переменную типа ТТ с помощью infer"
  Возвращаем в итоге тип ТТ, который будет являться остатком от типа T

  в качестве параметра указываем функцию
*/

type Tail<T extends any[]> =
  ((...arg: T[]) => any) extends ((first: any, ...last: infer TT) => any)
  ? TT
  : never;


type HasTail<T extends any[]> = T extends ([] | any[]) ? true : false;

// Получение типа конкретного ключа в объекте
type ObjectInfer<O> = O extends { foo: infer A } ? A : never;
type TestObjectInfer = ObjectInfer<{ foo: 'asd' }>; // 'asd';

// Получение типа параметров и возврата из функции
type FunctionInfer<F> =
  F extends ((...arg: infer PARAMS) => infer RESULT)
  ? [PARAMS, RESULT]
  : never;

type TestFunctionInfer = FunctionInfer<() => void>; // [[], void];

// Получение типа массива
type ArrayInfer<T> = T extends Array<infer TT> ? TT : never;

type TestArrayInfer = ArrayInfer<string[]>; // string;

/* 
  Пример перегрузки функции - в зависимости от типа входного параметра
  выбирается функция с нужной сигнатурой. Не будет работать, если мы сами не знаем,
  какого ОПРЕДЕЛЕННОГО типа будет входной параметр

    function transform (text: string): string;
    function transform (text: null): null;
    function transform (text: any): any { ...func body here... }
*/

declare const mayBeNull: string | null;

/*
  Для того, чтобы функция работала с объединенным параметром (объявлен выше),
  необходимо реализовать функцию, которая умеет определять тип возврата в зависимости от типа
  входного параметра (т.е. реализовать Условный Тип - Conditional Type)
 */

type TransformType<T> = T extends string ? string : null;

// TODO: infer?

function transform<T extends string | null>( // <== тут определяем, какого КОНКРЕТНОГО типа может быть входной параметр
  text: T
): TransformType<T> {     // <== тут возвращаем КОНКРЕТНЫЙ ТИП результата в зависимости от условия (в нашем случае, если входной параметр СТРУКТУРНО соответствует строке, возвращаем строку, иначе null)
  return text && text.replace(/f/g, 'p');
}

const transformedText = transform('foo').toUpperCase();
const transformedNull = transform(null).toUpperCase();
const transformedMayBeNull = transform(mayBeNull).toUpperCase();

typeof transformedText; // ===> string
typeof transformedNull; // ===> null
typeof transformedMayBeNull; // ===> string | null - в зависимости от РЕАЛЬНОГО типа параметра


interface Cat {
  makeSound: () => void;
  walk: () => void;
}

interface Dog {
  makeSound: () => void;
  walk: () => void;
}

interface Bird {
  makeSound: () => void;
  walk: () => void;
  fly: () => void;
}

interface Fish {
  swim: () => void;
}

type Pet = Cat | Dog | Bird | Fish; // <=== тут может быть ЛЮБОЕ животное

// УСЛОВНЫЕ ТИПЫ - по сути, враппер для получения конкретного подмножества типов
type CanMakeSound<T> = T extends { makeSound: () => void } ? T : never; // <== из полученных типов T выделяем те типы, которые имеют метод makeSound, остальыне аналогично
type CanWalk<T> = T extends { walk: () => void } ? T : never;
type CanFly<T> = T extends { fly: () => void } ? T : never;
type CanSwim<T> = T extends { swim: () => void } ? T : never;
type CanDig<T> = T extends { dig: () => void } ? T : never;

// С помощью УСЛОВНОГО ТИПА выбираем из всех возможных Pet тех, которые СООТВЕТСТВУЮТ условию.
// Те типы, которые возвращаются в виде never, просто отбрасываются

type HasVoice = CanMakeSound<Pet>; // type HasVoise = Cat | Dog | Bird
type HasLegs = CanWalk<Pet>; // type HasLegs = Cat | Dog | Bird
type HasWings = CanFly<Pet>; // type HasWings = Bird
type LivesUnderwater = CanSwim<Pet>; // type LivesUnderwater = Fish
type LivesUnderground = CanDig<Pet>; // type = never

/* Еще пример */

type EmailAddresses = string | string[] | null;

type NonNullType<T> = T extends null | undefined ? never : T;

type NonNullEmailAddresses = NonNullType<EmailAddresses>;

type User = {
  name: string;
  email: EmailAddresses;
}

// Функция возвращает либо адрес пользователя, либо дефолтное значение, если у пользователя стоит null
// Конечно, можно прописать руками возврат string | string[] - но если Union-типов много, устанешь
// Полученный тип - своя реализация Util-типа NonNullable

function getEmail(user: User): NonNullEmailAddresses {
  if (user.email === null) {
    return 'test@test.test';
  }
  return user.email;
}

export { }
