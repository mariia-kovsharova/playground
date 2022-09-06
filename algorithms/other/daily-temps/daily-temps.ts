import { Stack } from '../../../data-structures/stack/stack';

export function dailyTemperatures(temperatures: number[]): number[] {
    const size = temperatures.length;
    const result = new Array(size).fill(0);

    const stack = new Stack<number>();

    for (let currentDay = 0; currentDay < size; currentDay += 1) {
        const temperature = temperatures[currentDay];
        // Pop until the current day's temperature is not
        // warmer than the temperature at the top of the stack
        while (!stack.isEmpty() && temperatures[stack.peek()] < temperature) {
            const prevDay = stack.pop();
            result[prevDay] = currentDay - prevDay;
        }
        // There is no more prev days that colder than current
        stack.push(currentDay);
    }

    return result;
}