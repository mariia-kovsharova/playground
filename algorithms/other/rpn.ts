import assert from 'assert';
import { Stack } from '../data-structures/stack';

/**
 * Обратная польская нотация
 * Реализация - в 2 шага,
 * 1) Перевод инфиксной записи "(2 + 2) * 2" в постфиксную запись "2 2 + 2 *"
 * 2) Вычисление значения с помощью стека
 */

type OperationMapping = {
    [key in Operation]: (a: number, b: number) => number;
}

type Operation = '(' | ')' | '*' | '/' | '%' | '^' | '+' | '-';

const BRACES_OPERATIONS: Array<string> = ['(', ')'];
const HIGH_ORDER_OPERATIONS: Array<string> = ['*', '/', '%', '^'];
const LOW_ORDER_OPERATIONS: Array<string> = ['+', '-'];

const OPERATIONS: Array<string> = HIGH_ORDER_OPERATIONS.concat(LOW_ORDER_OPERATIONS);

const OPERATIONS_MAPPER = <OperationMapping>{
    '+': (a: number, b: number): number => a + b,
    '-': (a: number, b: number): number => a - b,
    '*': (a: number, b: number): number => a * b,
    '/': (a: number, b: number): number => a / b,
    '%': (a: number, b: number): number => a % b,
    '^': (a: number, b: number): number => a ** b
}

const isString = (v: string | number): v is string => typeof v === 'string';

const isOperation = (v: string | number): v is Operation => isString(v) && OPERATIONS.includes(v);

const isBraceOperation = (v: string): v is '(' | ')' => BRACES_OPERATIONS.includes(v);

const isNumericString = (v: string): boolean => !isNaN(parseInt(v));

const getOrderedOperations = (a: Operation, b: Operation): [Operation, Operation] => {
    if (HIGH_ORDER_OPERATIONS.includes(a) && HIGH_ORDER_OPERATIONS.includes(b)) {
        return [a, b];
    }

    if (HIGH_ORDER_OPERATIONS.includes(a) && LOW_ORDER_OPERATIONS.includes(b)) {
        return [a, b];
    }

    if (LOW_ORDER_OPERATIONS.includes(a) && HIGH_ORDER_OPERATIONS.includes(b)) {
        return [b, a];
    }

    if (BRACES_OPERATIONS.includes(a)) {
        return [b, a];
    }

    if (BRACES_OPERATIONS.includes(b)) {
        return [a, b];
    }

    return [a, b];
};

const areOperationsTheSamePriority = (a: string, b: string): boolean =>
    (HIGH_ORDER_OPERATIONS.includes(a) && HIGH_ORDER_OPERATIONS.includes(b))
    || (LOW_ORDER_OPERATIONS.includes(a) && LOW_ORDER_OPERATIONS.includes(b));


/**
 * Функция для форматирования последовательности в удобный формат для ОПН
 * @param sequence - последовательность в инфиксной записи
 * @returns последовательность в постфиксной записи
 * 
 * 2 + 3 * 4  => 2 3 4 * +
 */
const format = (sequence: string): string => {
    const matches = sequence.match(/(\d+)|([\(\)\/\*\+\-\^\%])/g);
    const seq = matches ?? [];

    const result = <Array<string | Operation>>[];
    const operations = new Stack<Operation>();

    for (let char of seq) {
        if (isNumericString(char)) {
            result.push(char);
            continue;
        } else if (isBraceOperation(char)) {
            // Открывающуюся скобку просто кладем в стек
            if (char === '(') {
                operations.push(char);
                continue;
            }

            // Если скобка закрывающаяся, необходимо опустошить стек операций
            // до первой открывающейся скобки (т.е. произвести форматирование в скобочном выражении)

            while (!operations.isEmpty()) {
                const item = operations.pop();
                // Если встретилась откр. скобка, завершаем
                if (isBraceOperation(item) && item === '(') {
                    break;
                }
                result.push(item);
            }
        } else if (isOperation(char)) {
            // Если операций в стеке нет, просто кладем туда операцию
            if (operations.isEmpty()) {
                operations.push(char);
                continue;
            }

            const prevOperand = operations.pop();
            const [high, low] = getOrderedOperations(prevOperand, char);

            // Если операции одного приоритета, в стек они попадают во встреченном порядке
            // т.е. сначала идет предыдущий встреченный знак операции
            if (areOperationsTheSamePriority(high, low)) {
                result.push(high);
                operations.push(low);
            } else {
                operations.push(low);
                operations.push(high);
            }

            continue;
        }
    }

    while (!operations.isEmpty()) {
        const item = operations.pop();
        result.push(item);
    }

    return result.join('');
}

/**
 * Функция подсчета значения
 * @param sequence - последовательность в постфиксной записи
 * @returns результат операции
 * 
 *  
 */
const calculate = (sequence: string): number | never => {
    const stack = new Stack<number>();

    for (let token of sequence) {
        if (isNumericString(token)) {
            stack.push(parseInt(token));
            continue;
        }

        const rightOperand = stack.pop();
        const leftOperand = stack.pop();

        const fn = OPERATIONS_MAPPER[token];
        const result = fn(leftOperand, rightOperand);

        stack.push(result);
    }

    if (stack.size() !== 1) {
        throw new Error(`Invalid stack: "${stack.print()}"`);
    }

    return stack.pop() as number;
}

const rpn = (seq: string): number => {
    const prefix = format(seq);
    return calculate(prefix);
}

// const first = rpn('1 + 3');
// const sec = rpn('2 * 6');
// const th = rpn('9 / 3');
// const four = rpn('5 - 2');
// const five = rpn('(2 + 2) * 2');
const six = rpn('(6 + 10 - 4) / (1 + 1 * 2 ) + 1');
// const seven = rpn('6 ^ 2');
// const eight = rpn('(8 + 2 * 5) / (1 + 3 * 2 - 4)');
// const nine = rpn('2 + 3 * 4');
// const ten = rpn('(0 + 3 * 4) / (2 * (1 + 1))');

// assert(first === 4);
// assert(sec === 12);
// assert(th === 3);
// assert(four === 3);
// assert(five === 8);
assert(six === 5);
// assert(seven === 36);
// assert(eight === 6);
// assert(nine === 14);
// assert(ten === 3);

console.log('done');

export { };
