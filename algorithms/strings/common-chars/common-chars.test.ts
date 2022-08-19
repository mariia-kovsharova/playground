import { commonChars } from './common-chars';

describe('Common chars', () => {
    it('for ["bella", "label", "roller"] it should be ["e", "l", "l"]', () => {
        const result = ['e', 'l', 'l'];
        expect(commonChars(["bella", "label", "roller"])).toEqual(result)
    });

    it('for ["cool", "lock", "cook"] it should be ["c", "o"]', () => {
        const result = ['c', 'o'];
        expect(commonChars(["cool", "lock", "cook"])).toEqual(result)
    });

    it('for ["acabcddd", "bcbdbcbd", "baddbadb", "cbdddcac", "aacbcccd", "ccccddda", "cababaab", "addcaccd"] it should be []', () => {
        const result = [];
        expect(commonChars([
            "acabcddd", "bcbdbcbd", "baddbadb",
            "cbdddcac", "aacbcccd", "ccccddda",
            "cababaab", "addcaccd"
        ])).toEqual(result)
    })
})