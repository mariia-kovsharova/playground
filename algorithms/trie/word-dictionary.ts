import { Trie } from '../../data-structures/trie/trie';

export class WordDictionary {
    root: Trie;
    memo: Map<string, boolean>;

    constructor() {
        this.root = new Trie();
        this.memo = new Map();
    }

    addWord(word: string): void {
        let current = this.root;

        for (const char of word) {
            if (!current.children[char]) {
                current.children[char] = new Trie();
            }

            current = current.children[char];
        }

        current.isEndOfWord = true;
        this.memo.clear();
    }

    search(word: string): boolean {
        if (this.memo.has(word)) {
            return this.memo.get(word)!;
        }

        const size = word.length;

        const dfs = (trie: Trie, index: number) => {

            if (index === size) {
                return trie.isEndOfWord;
            }

            const char = word[index];

            if (char === '.') {
                for (const child of Object.values(trie.children)) {
                    const result = dfs(child, index + 1);
                    if (result) {
                        this.memo.set(word, true);
                        return true;
                    }
                }
                this.memo.set(word, false);
                return false;
            } else {
                if (!trie.children[char]) {
                    this.memo.set(word, false);
                    return false;
                }

                return dfs(trie.children[char], index + 1);
            }
        }

        return dfs(this.root, 0);
    }

}
