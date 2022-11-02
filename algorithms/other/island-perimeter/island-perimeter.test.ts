import { islandPerimeter } from './island-perimeter'

describe('Island perimeter', () => {
    test('[[0,1,0,0],[1,1,1,0],[0,1,0,0],[1,1,0,0]] should be 16', () => {
        expect(islandPerimeter([[0, 1, 0, 0], [1, 1, 1, 0], [0, 1, 0, 0], [1, 1, 0, 0]])).toBe(16)
    })
})