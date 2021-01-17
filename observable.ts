/* 
  Попытка упрощенной реализации Observable из RxJS, неуправляемого потока
*/


// Поток
interface Observable<T> {
  subscribe: (observer: Observer<T>) => Subscription<T>;
  removeSubscrtiption: (subscription: Subscription<T>) => void;
}

// Сущность "подписка"
interface Subscription<T> {
  unsubscribe: () => void;
}

/* Наблюдатель - делает push каких-то данных в поток, тут описаны действия, который наблюдатель умеет:
  next - положить в поток новое значение
  error - положить в поток ошибку (причину ошибки) и завершить поток
  complete - завершить поток. В завершенный поток должно быть нельзя положить новое значение или кинуть ошибку
*/
interface Observer<T> {
  completed?: boolean;
  next?: (value: T) => void;
  error?: (reason: any) => void;
  complete?: () => void;
}


class SubscriptionImpl<T> implements Subscription<T> {
  private observable: Observable<T>;
  private observer: Observer<T>;

  constructor(observable: Observable<T>) {
    this.observable = observable;
  }

  public unsubscribe(): void {
    this.observable.removeSubscrtiption(this);
  }
}

class ObservableImpl<T> implements Observable<T> {
  private observerFunction: (observer: Observer<T>) => void;
  private subscriptions: Subscription<T>[];

  constructor(fn: (subject: Observer<T>) => void) {
    this.observerFunction = fn;
  }

  public subscribe(observer: Observer<T>): Subscription<T> {
    const subscription = new SubscriptionImpl<T>(this);
    this.subscriptions.push(subscription);
    return subscription;
  }

  public removeSubscrtiption(subscription: Subscription<T>) {
    const { subscriptions } = this;
    this.subscriptions = subscriptions.filter((s: Subscription<T>) => s !== subscription);
  }
}

/* Создаем поток, в котором описываем, ЧТО наблюдатель будет класть в поток, какие значения.
  т.е. КАК ИМЕННО значения будут обрабатываться, потоку все равно, его задача - взять значение и кинуть его в поток
*/
const obs = new ObservableImpl<number>((observer: Observer<number>) => {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.complete();

  /* ВНИМАНИЕ - пока нет проверки на completed, поэтому поток сейчас будет работать некорректно
     т.е. сейчас после вызова функции complete() все еще можно положить в поток новое значение, 
    что, конечно же, неправильно. С киданием в поток ошибки аналогично.
  */
});

/*
Благодаря структурной типизации нам не обязательно даже создавать экземпляр
наблюдателя, достаточно передать объект, который соотносится с интерфейсом Observer. Смысл структурной типизации
см. в файле types.ts
*/

obs.subscribe({
  next: (num: number) => console.log(`The passed number is: ${num}`),
  error: (reason: any) => console.error(reason),
  complete: () => console.log('The Observable is completed'),
});
