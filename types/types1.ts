// Рассматриваем темы: типы произведения, объединения, структурная типизация и ее уровни,

import { request, RequestOptions } from 'node:http';

// Примечание. Вместо type можно использовать interface. Но есть нюансы.
// Результат union и intersection — это всегда тип. Можно выразить intersection через extends, но union через interface нельзя.

/**
 * ТИП ПРОИЗВЕДЕНИЯ
 * Означает, что объект должен иметь в себе ВСЕ свойства от ВСЕХ типов, участвующих в произведении
 */

type typeA = {
    a: string;
};

type typeB = {
    b: number;
};

type typeC = {
    c: boolean;
};

type typeD = typeA & typeB & typeC;
/* 
typeD = {
    a: string;
    b: number;
    c: boolean;
}
*/

const d: typeD = {
    a: 'foo',
    b: 1,
    c: true,
};

/**
 * ТИП ОБЪЕДИНЕНИЯ
 * Означает, что объект может быть КАК МИНИМУМ ОДНОГО ИЗ типов, участвующих в объединении
 */

type A = {
    a: string;
};

type B = {
    b: number;
};

type C = {
    c: boolean;
};

type D = A | B | C;

const dd: D = {
    a: 'ads',
    b: 1,
};

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

Если у первого и второго типа одинаковый набор полей, то это два одинаковых типа. 
*/

type InitialTask = { id: number; whoCreated: number };
type InWorkTask = { id: number; whoCreated: number };
type FinishedTask = { id: number; whoCreated: number; finishDate: Date };

type Task = InitialTask | InWorkTask | FinishedTask;

function logTask(task: InitialTask): void {
    console.log(task.id);
}

const initialTask: InitialTask = {
    id: 1,
    whoCreated: 2,
};

const inWorkTask: InWorkTask = {
    id: 2,
    whoCreated: 2,
};

logTask(initialTask);
logTask(inWorkTask);

// Формально тут InitialTask и InWorkTask - одинаковые типы. Чтобы их различить, необходимо добавить какой-то дискриминатор, чтобы TS не считал их одним типом.
// Дискриминатором может служить строковый или числовой литерал

type InitialTaskUnique = { type: 'INITIAL'; id: number; whoCreated: number };
type InWorkTaskUnique = { type: 'IN_WORK'; id: number; whoCreated: number };
type FinishedTaskUnique = {
    type: 'FINISHED';
    id: number;
    whoCreated: number;
    finishDate: Date;
};

type TaskTypes = InitialTaskUnique | InWorkTaskUnique | FinishedTaskUnique;

function logUniqueTask(task: InitialTaskUnique): void {
    console.log(task.id);
}

const initialTaskU: InitialTaskUnique = {
    type: 'INITIAL',
    id: 1,
    whoCreated: 2,
};

const inWorkTaskU: InWorkTaskUnique = {
    type: 'IN_WORK',
    id: 2,
    whoCreated: 2,
};

logUniqueTask(initialTaskU);
logUniqueTask(inWorkTaskU); // <=== ошибка, типы разные теперь

type TaskType = TaskTypes['type']; // <=== можно вытащить непосредственный дискриминатор type TaskType = "INITIAL" | "IN_WORK" | "FINISHED"

/*
  УРОВНИ структурной типизации
  ** any, unknown - "верхний уровень", к которому могут быть приведены ВСЕ типы. Можно рассмотреть, как объединение ВСЕХ возможных типов

  * any - "любой" тип, максимум доверия, ответственность на разработчике, TS игнорирует. Максимально приближен к Vanilla JS
  * unknown - "любой строгий" тип, TS не даст ничего сделать с переменной типа unknown, пока разработчик явно не укажет тип

  ** never - "нижний уровень", максимально "узкий" тип, которому не соответствует НИ ОДИН тип. 
    Если он находится в результате возврата функции, то функция никогда не завершается корректно (например всегда бросает ошибку или исполняется бесконечно).
    Если это тип, то этот тип нельзя создать без каких-то дополнительных усилий.
*/

// Exhaustive checking - это возможность проверить, что мы обработали все возможные кейсы.

function checkTask(t: TaskTypes): TaskType | never {
    // <=== таска с типом "FINISHED" не обработана, ошибка тоже не кидается, компилятор ругается
    switch (t.type) {
        case 'INITIAL':
            return 'INITIAL';
        case 'IN_WORK':
            return 'IN_WORK';
    }
}

// Если возврата нет, exhaustive checking можно сделать немного по-другому:

function checkTaskWithoutReturn(t: TaskTypes): void {
    switch (t.type) {
        case 'INITIAL':
            // do something without return
            break;
        case 'IN_WORK':
            // do something without return
            break;
        default:
            const exhaustiveCheck: never = t.type; // <=== ошибка, не обработали значение 'FINISHED'
            throw new Error('Ooops, this has not been expected!');
    }
}

/**
 * НОМИНАЛЬНАЯ СИСТЕМА ТИПОВ
 * Позволяет избежать ошибок при использовании параметров функции одного типа
 */

function fetchData(url: string, token: string): Promise<void> {
    // Просто пример
    const options = {
        url,
        data: token,
    } as unknown as RequestOptions;

    return new Promise((resolve, reject) => {
        request(options, () => {
            resolve();
        });
    });
}

fetchData('token', 'url'); // <=== ошибки компилятора нет, но сигнатура функции не соблюдена, логическая ошибка

// Для избегания этого в качестве параметорв функции должны быть указаны брендированные типы

type Brand<T, B extends string> = T & { readonly _brand: B };

type Url = Brand<string, 'url'>;

type Token = Brand<string, 'token'>;

function fetchDataBrand(url: Url, token: Token): Promise<void> {
    // Просто пример
    const options = {
        url,
        data: token,
    } as unknown as RequestOptions;

    return new Promise((resolve, reject) => {
        request(options, () => {
            resolve();
        });
    });
}

const url = 'url' as Url;
const token = 'token' as Token;

fetchDataBrand(token, url); // <== перепутано, ошибка
fetchDataBrand(url, token);

// Теперь всё хорошо — получили брендированные примитивы. Брендирование полезно, когда встречается несколько аргументов (строки, числа).
// У них есть определенная семантика (x,y координаты), и их нельзя путать. Удобно, когда компилятор подсказывает, что они перепутаны.

export {};
