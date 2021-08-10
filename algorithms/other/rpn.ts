import assert from 'assert';
import { Stack } from '../data-structures/stack';

/**
 * Обратная польская нотация
 * Реализация - в 2 шага,
 * 1) Перевод инфиксной записи "(2 + 2) * 2" в постфиксную запись "2 2 + 2 *"
 * 2) Вычисление значения с помощью стека
 */

type OperationMapping = {
    [key: string]: (a: number, b: number) => number;
}

const OPERATIONS = ['*', '/', '%', '^', '+', '-'];

const OPERATIONS_MAPPER = <OperationMapping>{
    '+': (a: number, b: number): number => a + b,
    '-': (a: number, b: number): number => a - b,
    '*': (a: number, b: number): number => a * b,
    '/': (a: number, b: number): number => a / b,
    '%': (a: number, b: number): number => a % b,
    '^': (a: number, b: number): number => a ** b
}

const isString = (v: unknown): v is string => typeof v === 'string';

const isNumber = (v: unknown): v is number => typeof v === 'number' || typeof v === 'bigint';

/**
 * 
 * @param sequence - последовательность в инфиксной записи
 * @returns последовательность в постфиксной записи
 */
const format = (sequence: string): string => {
    const seq = sequence.replace(/\s/g, '');

}

/**
 * 
 * @param sequence - последовательность в постфиксной записи
 * @returns результат операции
 */
const calculate = (sequence: string): number | never => {
    const stack = new Stack<string | number>();

    for (let token of sequence) {
        const isOperand = OPERATIONS.includes(token);

        if (!isOperand) {
            stack.push(token);
            continue;
        }

        const rightOperand = stack.pop();
        if (!isNumber(rightOperand)) {
            throw new Error(`Not number: ${rightOperand}`);
        }

        const leftOperand = stack.pop();
        if (!isNumber(leftOperand)) {
            throw new Error(`Not number: ${leftOperand}`);
        }

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

const first = rpn('1 + 3');
const sec = rpn('2 * 6');
const th = rpn('9 / 3');
const four = rpn('5 - 2');
const five = rpn('(2 + 2) * 2');
const six = rpn('(6 + 10 - 4) / (1 + 1 * 2 ) + 1');
const seven = rpn('6 ^ 2');

assert(first === 4);
assert(sec === 12);
assert(th === 3);
assert(four === 3);
assert(five === 8);
assert(six === 5);
assert(seven === 36);

console.log('done');

export { };
