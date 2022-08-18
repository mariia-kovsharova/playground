import 'extended-promises';
import { rejectPromise } from '../promises/utils';

const p = Promise.none([
    rejectPromise('fooo', 1000),
    rejectPromise('bar', 300),
    rejectPromise('baz', 1200)
]).then(x => {
    console.log(x);
})

