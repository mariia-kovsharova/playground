class Stack {
    private readonly values: number[];

    constructor() {
        this.values = [];
    }

    pop(): number | undefined {
        const element = this.values.pop();
        return element;
    }

    add(element: number): void {
        this.values.push(element);
    }

    lastValue(): number | undefined {
        const [last] = this.values.slice(-1);
        return last;
    }

    hasLastValue(): boolean {
        return this.values.length === 1;
    }

    print(): string {
        const size = this.values.length;
        const stringifyTower = this.values.reduceRight((acc, element, index) => {
            const spaces = ' '.repeat(Math.round(size / (index + 1)));

            const disk = `|${spaces}${element}${spaces}|`;
            return `${acc}\n${disk}`;
        }, '');
        return stringifyTower;
    }
}

class Rod {
    readonly rod: Stack;
    readonly index: number;
    topDiskValue: number | null;

    constructor(index: number) {
        this.rod = new Stack();
        this.index = index;
        this.topDiskValue = 0;
    }

    getDisk() {
        if (this.topDiskValue !== null) {
            const disk = this.rod.pop();
            this.topDiskValue = this.rod.lastValue()!;

            return disk;
        }
    }

    canAddDisk(diskValue: number): boolean {
        return diskValue < (this.topDiskValue ?? 0);
    }

    addDisk(diskValue: number): void {
        if (!this.canAddDisk) {
            throw new Error('can not put disk more than current biggest disk!');
        }
        this.rod.add(diskValue);
        this.topDiskValue = diskValue;
    }

    moveDisk(toTower: Rod): void {
        const disk = this.getDisk();
        toTower.addDisk(disk!);
        console.log(`disk |${disk}| has been moved from ${this.index} to ${toTower.index}`);
    }

    print(targetDisk: number): void {
        console.log(`the rod ${this.index} at moving disk ${targetDisk}:
                        ${this.rod.print()}`);
    }
}

function hanoi(disksCount: number): void {
    // initializing rods
    const firstRod = new Rod(1);
    const secondRod = new Rod(2);
    const thirdRod = new Rod(3);

    const allRods = [firstRod, secondRod, thirdRod];

    for (let i = disksCount; i > 0; i -= 1) {
        firstRod.addDisk(i);
    }

    // getting temporal row
    const getAuxRod = (fromRod: Rod, toRod: Rod): Rod => {
        const allRodsIndexesSum = allRods.reduce((acc: number, currentRod: Rod): number => {
            return acc + currentRod.index;
        }, 0);
    };

    const moveStack = (targetDisk, fromRod, toRod) => {

        // базовый случай - перемещение башни из одного диска
        if (targetDisk === 1) {
            fromRod.moveDisk(toRod);
            return;
        }

        const auxRod = getAuxRod(fromRod, toRod);

        moveStack(targetDisk - 1, fromRod, auxRod);

        console.log(`moved disk ${targetDisk - 1} from current rod to aux rod`);

        fromRod.print(targetDisk);
        auxRod.print(targetDisk);
        toRod.print(targetDisk);

        fromRod.moveDisk(toRod);

        moveStack(targetDisk - 1, auxRod, toRod);

        console.log(`moved disk ${targetDisk - 1} from aux rod to target rod`);

        fromRod.print(targetDisk);
        auxRod.print(targetDisk);
        toRod.print(targetDisk);
    }

    return moveStack(disksCount, firstRod, thirdRod);
}

hanoi(3);

export { };