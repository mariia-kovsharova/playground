function sortedSquares(nums: number[]): number[] {
    const result: number[] = [];

    let start = 0;
    let end = nums.length - 1;

    while (start <= end) {
        // if (negative) start num is more than end num, we should add start num firstly
        // (it will be at the end of array after reverse)
        // if (Math.abs(nums[start]) > Math.abs(nums[end])) {
        //     const element = nums[start] ** 2;
        //     result.push(element);

        //     start += 1;
        //     continue;
        // }
        // if they are equal (but not the same), we should add element twice
        // if (start !== end && (Math.abs(nums[start]) === Math.abs(nums[end]))) {
        //     const element = nums[start] ** 2;
        //     result.push(element);
        //     result.push(element);

        //     start += 1;
        //     end -= 1;
        //     continue;
        // }
        // if last num more than start num, we should add end num firstly
        // (it will be at the end of array after reverse)
        // if (Math.abs(nums[start]) < Math.abs(nums[end])) {
        //     const element = nums[end] ** 2;
        //     result.push(element);

        //     end -= 1;
        //     continue;
        // }

        // otherwise start and end pointers points on the same element
        // so this is the last and smallest element
        // result.push(nums[start] ** 2);
        // start += 1;

        const leftSquare = nums[start] ** 2;
        const rightSquare = nums[end] ** 2;

        if (leftSquare > rightSquare) {
            result.push(leftSquare);
            start += 1;
        } else {
            result.push(rightSquare);
            end -= 1;
        }
    }

    return result.reverse();
}

const merge = function (nums1: number[], m: number, nums2: number[], n: number): number[] {
    const finalSize = m + n;
    // left будет указателем на позицию в nums1
    let left = m - 1;
    // right - на nums2
    let right = n - 1;

    let i = finalSize - 1;

    while (i >= 0) {
        if (left < 0) {
            nums1[i] = nums2[right];
            right -= 1;
            continue;
        }

        if (right < 0) {
            nums1[i] = nums1[left];
            left -= 1;
            i -= 1;
            continue;
        }

        if (nums1[left] > nums2[right]) {
            nums1[i] = nums1[left];
            left -= 1;
            i -= 1;
            continue;
        }

        if (nums1[left] < nums2[right]) {
            nums1[i] = nums2[right];
            right -= 1;
            i -= 1;
            continue;
        }

        if (nums1[left] === nums2[right]) {
            nums1[i] = nums2[right];
            i -= 1;
            nums1[i] = nums1[left];
            i -= 1;
            right -= 1;
            left -= 1;
            continue;
        }
    }

    nums1.length = finalSize;
    return nums1;
};

const removeElement = function (nums, val) {
    let index = nums.length - 1;
    let size = nums.length;

    function move(toIndex) {
        for (let k = toIndex; k < size - 1; k += 1) {
            nums[k] = nums[k + 1];
        }
    }

    while (index >= 0) {
        if (nums[index] === val) {
            move(index);
            size -= 1;
        }
        index -= 1;
    }

    return size;
};

const removeDuplicates = function (nums) {
    let lastUniqueElementPointer = 0;
    let size = 1;

    for (let i = 1; i < nums.length; i += 1) {
        if (nums[lastUniqueElementPointer] !== nums[i]) {
            lastUniqueElementPointer += 1;
            nums[lastUniqueElementPointer] = nums[i];
            size += 1;
        }
    }

    return size;
};

/*
1. Create a copy of the input array. copy = [8,1,2,2,3]
2. Sort the copy array. copy = [1,2,2,3,8]
3. Fill the map: number => count (where count is an index in sorted array,
   so first number with index 0 has 0 numbers less than it,
   index 1 has 1 number less, etc). We update only first time we enocunter
   the number so that way we skip duplicates.
map[1]=>0
map[2]=>1
map[3]=>3
map[8]=>4
4. We re-use our copy array to get our result, we iterate over original array,
   and get counts from the map.
[4,0,1,1,3]
*/
function smallerNumbersThanCurrent(nums: number[]): number[] {
    const copy = nums.slice();
    copy.sort((a, b) => a - b);

    const map = new Map();

    for (let i = 0; i < nums.length; i += 1) {
        if (map.has(copy[i])) {
            continue;
        }

        map.set(copy[i], i);
    }

    for (let i = 0; i < nums.length; i += 1) {
        copy[i] = map.get(nums[i]);
    }

    return copy;
}

const validMountainArray = function (arr) {
    if (arr.length < 3) {
        return false;
    }

    const size = arr.length;
    let i = 0;

    while (i + 1 < size && arr[i] < arr[i + 1]) {
        i += 1;
    }

    if (i === 0 || i === size - 1) {
        return false;
    }

    while (i + 1 < size && arr[i + 1] < arr[i]) {
        i += 1;
    }

    return i === size - 1;
};

const checkIfExist = function (arr) {
    const hash = new Set();

    for (let i = 0; i < arr.length; i += 1) {
        const current = arr[i];

        if (hash.has(current)) {
            return true;
        }

        hash.add(current * 2);
        hash.add(current / 2);
    }

    return false;
};

const sortArrayByParity = function (nums) {
    let evenPointer = 0;
    let oddPointer = nums.length - 1;

    while (evenPointer < oddPointer) {
        if (nums[evenPointer] % 2 !== 0) {
            const tmp = nums[oddPointer];
            nums[oddPointer] = nums[evenPointer];
            nums[evenPointer] = tmp;

            if (tmp % 2 === 0) {
                evenPointer += 1;
            } else {
                oddPointer -= 1;
            }
        } else {
            evenPointer += 1;
        }
    }

    return nums;
};

const thirdMax = function (nums) {
    let first = -Infinity;
    let second = -Infinity;
    let third = -Infinity;

    for (let i = 0; i < nums.length; i += 1) {
        if (nums[i] === first || nums[i] === second || nums[i] === third) {
            continue;
        }

        if (nums[i] > first) {
            [first, second, third] = [nums[i], first, second];
        } else if (nums[i] > second) {
            [second, third] = [nums[i], second]
        } else if (nums[i] > third) {
            third = nums[i];
        }
    }

    return third === -Infinity ? first : third;
};

const findDisappearedNumbers = function (nums) {
    const n = nums.length;

    for (let i = 0; i < n; i += 1) {
        const ind = Math.abs(nums[i]) - 1;
        if (nums[ind] > 0) {
            nums[ind] = nums[ind] * -1;
        }
    }

    const result: number[] = [];

    for (let i = 0; i < n; i += 1) {
        if (nums[i] > 0) {
            result.push(i + 1);
        }
    }

    return result;
};

function lengthOfLongestSubstring(s: string): number {
    const map = new Map<string, number>();

    let current = 0;
    let max = 0;

    let pointer = 0;
    let start = 0;

    while (pointer <= s.length - 1) {
        const currentSymbol = s[pointer];
        if (!map.has(currentSymbol)) {
            current += 1;
            max = Math.max(current, max);

            map.set(currentSymbol, 1);

            pointer += 1;
        } else {
            current = 0;

            start += 1;
            pointer = start;

            map.clear();
        }
    }

    return max;
}

test('1', () => {
    const nums = [2, 2, 3, 1];
    const r = thirdMax(nums);
    expect(r).toBe(1);
})

function rotate(nums: number[], k: number): void {
    const start = 0;
    const end = nums.length - 1;
    const count = k % nums.length;

    const reverse = (i: number, j: number) => {
        while (i < j) {
            const temp = nums[i];
            nums[i] = nums[j];
            nums[j] = temp;
            i += 1;
            j -= 1;
        }
    }

    reverse(start, end);
    reverse(start, count - 1);
    reverse(count, end);
}
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

// head: ListNode | null
function hasCycle(head: any): boolean {
    if (head === null) {
        return false;
    }

    let fast = head;
    let slow = head;

    while (fast.next && fast.next.next) {
        slow = slow.next;
        fast = fast.next.next;

        if (slow === fast) {
            return true;
        }
    }

    return false;
}

function detectCycle(head: any): any | null {
    if (head === null) {
        return null;
    }

    let slow = head;
    let fast = head;

    while (fast.next && fast.next.next) {
        slow = slow.next;
        fast = fast.next.next;

        if (slow === fast) {
            slow = head;

            while (slow !== fast) {
                slow = slow.next;
                fast = fast.next;
            }

            return slow;
        }
    }

    return null;
}

function getIntersectionNode(headA: any | null, headB: any | null): any | null {
    if (!headA || !headB) {
        return null;
    }

    let a = headA;
    let b = headB;

    /**
     * Суть в чем - если первый список обходится быстрее, его
     * следующей точкой будет начало второго списка.
     * 
     * Аналогично со вторым.
     * 
     * Как только два списка пройдут переопределение (перейдут на "голову")
     * второго списка, они окажутся в равноудаленной точке от точки пересечения
     * ИЛИ окончания обоих списков (оба одновременно будут указывать на null)
     */
    while (a !== b) {
        a = a ? a.next : headB;
        b = b ? b.next : headA;
    }

    return a;
}

/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

// ListNode instead of any
function removeNthFromEnd(head: any | null, n: number): any | null {
    let curr = head;
    let prev = head;

    for (let i = 0; i < n; i += 1) {
        curr = curr.next;
    }

    if (!curr) {
        return head.next;
    }

    while (curr.next) {
        curr = curr.next;
        prev = prev.next;
    }

    prev.next = prev.next.next;

    return head;
}