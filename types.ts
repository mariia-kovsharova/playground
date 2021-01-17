// РАССМАТРИВАЕМ ТЕМЫ: структурная типизация, дженерики, advanced-дженерики, условные типы

/*
СТРУКТУРНАЯ ТИПИЗАЦИЯ.
Основное сравнение идет по совпадению свойств и методов (JS), а не на родителя (Java)

class Shape {
  color: string;
}

class Circle {
  color: string;
  radius: number;
}

const shape: Shape = new Circle();  <== все ок, каждый круг имеет цвет, поэтому мы можем представить его как фигуру
const circle: Circle = new Shape(); <== не ок, будет ошибка - не у всех фигур есть радиус

Буквально можно представить, как "класс Circle содержит все свойства класса Shape и может быть еще какие-то".
Или как "класс Circle - более точная (конкретная, узкая) версия класса Shape"
Поэтому представление <Circle extends Shape> - валидно
*/

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
  что множество P является надмножеством ключей T

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
  this: T[],
  prop: P,
  value: T[P]
): T | null {
  return this.find((item: T) => item[prop] === value) || null;
};

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


/*
  УРОВНИ структурной типизации
  ** any, unknown - "верхний уровень", к которому могут быть приведены ВСЕ типы. Можно рассмотреть, как объединение ВСЕХ возможных типов
  ** never - "нижний уровень", максимально "узкий" тип, которому не соответствует НИ ОДИН тип
*/

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
type CanMakeSound<T> = T extends { makeSound:() => void } ? T : never; // <== из полученных типов T выделяем те типы, которые имеют метод makeSound, остальыне аналогично
type CanWalk<T> = T extends { walk:() => void } ? T : never;
type CanFly<T> = T extends { fly:() => void } ? T : never;
type CanSwim<T> = T extends { swim:() => void } ? T : never;
type CanDig<T> = T extends { dig: () => void } ? T : never;

// С помощью УСЛОВНОГО ТИПА выбираем из всех возможных Pet тех, которые СООТВЕТСТВУЮТ условию.
// Те типы, которые возвращаются в виде never, просто отбрасываются

type HasVoice = CanMakeSound<Pet>; // type HasVoise = Cat | Dog | Bird
type HasLegs = CanWalk<Pet>; // type HasLegs = Cat | Dog | Bird
type HasWings = CanFly<Pet>; // type HasWings = Bird
type LivesUnderwater = CanSwim<Pet>; // type LivesUnderwater = Fish
type LivesUnderground = CanDig<Pet>; // type = never

/* 
Смоделируем ситуацию - у нас есть зоопарк, в котором живут разные животные.
Когда мы хотим поселить новое животное, нам надо выбрать для него место согласно его типу (упрощенно):
 ** хищных - к хищным животным
 ** траводяных - к травоядным
 ** рыб - в аквариум
 ** птиц - в закрытый сверху вольер (чтобы не улетели)

*/

interface Lion {
  type: 'animal',
  eats: 'meat'
}

interface Bear {
  type: 'animal',
  eats: 'meat' 
}

interface Goat {
  type: 'animal',
  eats: 'veggies',
}

interface Coala {
  type: 'animal',
  eats: 'veggies',
}

interface GoldFish {
  type: 'fish',
}

interface Tuna {
  type: 'fish',
}

interface Parrot {
  type: 'bird'
}

interface Raven {
  type: 'bird'
}

type Animals = 
  Lion | Bear | Goat | Coala |
  GoldFish | Tuna | Parrot | Raven;

// Выделение общего свойства "тип" у всех возможных типов - если у какого-то элемента нет свойства "тип", получим ошибку
type AnimalType = Animals['type']; // type AnimalTypes = 'animal' | 'fish' | 'bird'

type EatsMeat<T> = T extends { eats: 'meat' } ? T : never;
type EatsVeggies<T> = T extends { eats: 'veggies' } ? T : never;

type AnimalsEatMeat = EatsMeat<Animals>;
type AnimalsEatVeggies = EatsVeggies<Animals>;

class Zoo {
  private places: Map<AnimalType, Animals[]> = new Map();

  public addAnimal(animalType: AnimalType, extras?: any): void {

  }

  public print(): string {
    return '';
  }
}