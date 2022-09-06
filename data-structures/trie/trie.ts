export class Trie {
    private symbol: string | null;
    private isEndOfWord: boolean;
    private children: Map<string, Trie>;

    constructor(symbol: string | null = null) {
        this.symbol = symbol;
        this.isEndOfWord = false;
        this.children = new Map();
    }

    get value(): string | null {
        return this.symbol;
    }

    insert(word: string): void {
        if (!word.length) {
            this.isEndOfWord = true;
            return;
        }

        const char = word[0];
        const child = this.children.get(char);

        if (child) {
            child.insert(word.slice(1));
        } else {
            const newChild = new Trie(char);
            newChild.insert(word.slice(1));

            this.children.set(char, newChild)
        }
    }

    search(word: string): boolean {
        if (!word.length && this.isEndOfWord) {
            return true;
        }

        const char = word[0];
        const child = this.children.get(char);

        return !!(child && child.search(word.slice(1)));
    }

    startsWith(prefix: string): boolean {
        if (!prefix) {
            return true;
        }

        const char = prefix[0];
        const child = this.children.get(char);

        return !!(child && child.startsWith(prefix.slice(1)));
    }
}