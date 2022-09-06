import { dailyTemperatures } from './daily-temps';

describe('Daily temperatures', () => {
    it('For [73, 74, 75, 71, 69, 72, 76, 73] it should be', () => {
        const temps = [73, 74, 75, 71, 69, 72, 76, 73];
        const result = [1, 1, 4, 2, 1, 1, 0, 0];

        expect(dailyTemperatures(temps)).toEqual(result);
    })
})