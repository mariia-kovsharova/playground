export class Trie {
    private isEndOfWord: boolean;
    private children: Map<string, Trie>;

    constructor() {
        this.isEndOfWord = false;
        this.children = new Map();
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
            const newChild = new Trie();
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