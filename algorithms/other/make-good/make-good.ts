import { Stack } from '../../../data-structures/stack/stack'

const makeGood = (str: string): string => {
    if (!str) {
        return str;
    }

    const stack = new Stack<string>();
    stack.push(str[0]);

    const transformFn = str[0] === str[0].toLowerCase()
        ? (s: string) => s.toLowerCase()
        : (s: string) => s.toUpperCase();

    for (let i = 1; i < str.length; i += 1) {
        const transformed = transformFn(str[i]);

        if (str[i] === transformed) {
            stack.push(str[i]);
        } else {
            if (stack.peek() === transformed) {
                stack.pop();
            }
        }
    }

    let result = '';

    while (!stack.isEmpty()) {
        result = stack.pop() + result;
    }

    return result;
}

const result = makeGood("abBAcC");
// const result2 = makeGood("leEeetcode");
const result3 = makeGood("Pp");