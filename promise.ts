enum STATES {
    pending = 'pending',
    resolved = 'fulfilled',
    rejected = 'rejected',
};

// счетчик для отладки
let counter = 1;

type PromiseCallbackType = (value?: unknown) => unknown;
type ResolveType = (value: unknown) => void;

class CustomPromise {
    id: number;
    PromiseState: STATES;
    PromiseResult: unknown;
    PromiseFulfillReactions: PromiseCallbackType[];

    constructor(executor: (resolve: ResolveType) => void) {
        this.id = counter;
        counter += 1;
        console.log(`pending promise with id: ${this.id}`);
        this.PromiseState = STATES.pending;
        this.PromiseResult = null;
        this.PromiseFulfillReactions = [];
        executor(this.resolve.bind(this));
    }

    resolve(value: unknown): void {
        console.log(`resolving for promise with id ${this.id} and value: ${value}`);
        this.PromiseState = STATES.resolved;
        this.PromiseResult = value;
        // когда промис разрешается, в качестве результата должно быть значение,
        // полученное в результате обхода всех обработчиков, начиная от текущего полученного
        this.PromiseFulfillReactions.reduce((currentValue, fn) => fn(currentValue), this.PromiseResult);
    }

    then(onFulfill: PromiseCallbackType): CustomPromise {
        // вернуть новый промис, в котором поставить условие на проверку статуса текущего
        const promise = new CustomPromise((resolve: ResolveType) => {
            if (this.PromiseState === STATES.resolved) {
                const fulfilledResult = setTimeout(() => onFulfill(this.PromiseResult), 0);
                resolve(fulfilledResult);
                return;
            }
            this.PromiseFulfillReactions.push(onFulfill);
        });
        // в новом поставить ссылку на текущий список обработчиков, чтобы новые then добавляли операции
        // в текущий (первый) промис и именно в первом промисе получился массив функций-обработчиков
        promise.PromiseFulfillReactions = this.PromiseFulfillReactions;
        return promise;
    }

    // альтернативный вариант - замкнуть ?
    /* then(onFulfilledHandler) {
      return new CustomPromise((resolve) => {
        const onFulfilledReaction = (result) => {
          resolve(onFulfilledHandler(result));
        };
    
        if (this.PromiseState === STATES.resolved) {
          onFulfilledReaction(this.PromiseResult);
          return;
        }
    
        this.PromiseFulfillReactions.push(onFulfilledReaction);
      });
    } */
}

const test = async () => {
    const fulfillMessage = 'Fulfilled';
    const resolveMessage = 'Resolved';
    const messages: string[] = [];

    const resolvedPromise = new CustomPromise((resolve: ResolveType) => {
        resolve(resolveMessage);
    });

    console.log('step 1');
    console.log(messages);

    // eslint-disable-next-line jest/valid-expect-in-promise
    const modifiedPromise = resolvedPromise
        .then(() => { messages.push(fulfillMessage); });

    console.log('step 2');
    console.log(messages);

    await modifiedPromise
        .then(() => { messages.push(resolveMessage); });

    console.log('step 3');
    console.log(messages);

};

test();
