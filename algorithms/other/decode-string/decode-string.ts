import { Stack } from '../../../data-structures/stack/stack';

const isNumericString = (s: string): boolean => {
    return typeof (s) === 'string' && !Number.isNaN(+s);
}

export const decodeString = (str: string): string => {
    const stack = new Stack<string>();

    for (const s of str) {
        if (isNumericString(s)) {
            if (stack.isEmpty()) {
                stack.push(s);
            } else {
                const top = stack.peek();
                if (isNumericString(top)) {
                    stack.pop();
                    stack.push(top + s);
                } else {
                    stack.push(s);
                }
            }

            continue;
        }

        if (s === ']') {
            let current: string = '';

            while (!stack.isEmpty() && stack.peek() !== '[') {
                current = stack.pop() + current;
            }

            stack.pop();

            const count = stack.pop();

            const value = current.repeat(+count);

            stack.push(value);

            continue;
        }

        stack.push(s);
    }

    const result: string[] = [];

    while (!stack.isEmpty()) {
        result.push(stack.pop());
    }

    return `${result.reverse().join('')}`;
}