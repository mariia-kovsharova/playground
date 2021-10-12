import { MaxHeap } from './max-heap';

describe('Max Heap', () => {
    let maxHeap: MaxHeap<number>;

    beforeEach(() => {
        maxHeap = new MaxHeap();
    });

    it('add elements to the heap', () => {
        maxHeap.add(5);
        expect(maxHeap.isEmpty()).toBe(false);
        expect(maxHeap.peek()).toBe(5);
        expect(maxHeap.toString()).toBe('5');

        maxHeap.add(3);
        expect(maxHeap.peek()).toBe(5);
        expect(maxHeap.toString()).toBe('5,3');

        maxHeap.add(10);
        expect(maxHeap.peek()).toBe(10);
        expect(maxHeap.toString()).toBe('10,3,5');

        maxHeap.add(1);
        expect(maxHeap.peek()).toBe(10);
        expect(maxHeap.toString()).toBe('10,3,5,1');

        maxHeap.add(1);
        expect(maxHeap.peek()).toBe(10);
        expect(maxHeap.toString()).toBe('10,3,5,1,1');
    });

    it('poll elements from the heap and heapify it down', () => {
        maxHeap.add(5);
        maxHeap.add(3);
        maxHeap.add(10);
        maxHeap.add(11);
        maxHeap.add(1);

        expect(maxHeap.toString()).toBe('11,10,5,3,1');

        expect(maxHeap.poll()).toBe(11);
        expect(maxHeap.toString()).toBe('10,3,5,1');

        expect(maxHeap.poll()).toBe(10);
        expect(maxHeap.toString()).toBe('5,3,1');

        expect(maxHeap.poll()).toBe(5);
        expect(maxHeap.toString()).toBe('3,1');

        expect(maxHeap.poll()).toBe(3);
        expect(maxHeap.toString()).toBe('1');

        expect(maxHeap.poll()).toBe(1);
        expect(maxHeap.toString()).toBe('');

        expect(maxHeap.poll()).toBeNull();
        expect(maxHeap.toString()).toBe('');
    });

});