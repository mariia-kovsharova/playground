export class Trie {
    public isEndOfWord: boolean;
    public children: Map<string, Trie | null>;

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

    delete(str: string): void {
        const size = str.length;

        const dfs = (node: Trie | undefined | null, index: number): Trie | null => {
            if (!node) {
                return null;
            } else {
                // last char node
                if (index === size) {
                    // unmark current node
                    if (node.isEndOfWord) {
                        node.isEndOfWord = false;
                    }
                    // if the current node is the leaf of the trie tree
                    // we should to delete the node
                    if (node.isEmpty) {
                        node = null;
                    }

                    return node;
                }

                const char = str[0];
                const child = node.children.get(char);
                node.children.set(char, dfs(child, index + 1));

                if (node.isEmpty && !node.isEndOfWord) {
                    node = null;
                }

                return node;
            }
        }

        dfs(this, 0);
    }

    get isEmpty(): boolean {
        return this.children.size === 0;
    }
}