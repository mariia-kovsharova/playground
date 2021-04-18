/* 
  Попытка упрощенной реализации Observable из RxJS, неуправляемого потока

  Вопросы:
  1) Как работает подписка?
  2) Как помечать наблюдаемое завершенным для конкретного наблюдателя? Завернуть в прокси?
  3) Как обрабатывать ошибку для наблюдателя?
*/

/**
  * Наблюдатель (зритель) - внутри себя реализует три функции, в которых описывает, ЧТО будет делать с полученными данными
  * next - в случае получения данных из потока
  * error - в случае получения ошибки из потока
  * complete - в случае получения пометки, что поток завершен
 */

 // TODO: сделать методы необязательными
interface Observer<T> {
  completed?: boolean;
  next: (value: T) => void;
  error: (reason: any) => void;
  complete: () => void;
}

/**
 * Наблюдаемое (зрелище, поток данных во времени) - содержит в себе информацию по подписчикам, по сути - менеджер
 * Самую главную суть см. в самом классе
 */
interface Observable<T> {
  subscribe: (observer: Observer<T>) => Subscription<T>;
  removeSubscrtiption: (subscription: Subscription<T>) => void;
}

/**
 * Подписка - сущность-ссылка
 */
interface Subscription<T> {
  unsubscribe: () => void;
}

/**
 * Сущность-подписка содержит в себе ссылку на наблюдаемое, чтобы можно было удалить ее из списка тех,
 * кто получает данные из потока данных 
 */
class SubscriptionImpl<T> implements Subscription<T> {
  private observable: Observable<T>;

  constructor(observable: Observable<T>) {
    this.observable = observable;
  }

  public unsubscribe(): void {
    this.observable.removeSubscrtiption(this);
  }
}

/**
 * Итак, наблюдаемое (зрелище, поток данных).
 * Самое главное здесь - функция, которая поступает в конструктор при создании экземпляра.
 * Именно эта функция определяет, ЧТО БУДЕТ ПОЛОЖЕНО в поток - т.е. не сам поток в себя кладет
 * данные, а эта функция, поток лишь УПРАВЛЯЕТ
 */

let counter = 0;

class ObservableImpl<T> implements Observable<T> {
  private observerFunction: (observer: Observer<T>) => void;
  private subscriptions: Subscription<T>[];

  // Получаем на вход функцию, которая будет получать наблюдателя
  // и в наблюдателя ПИХАТЬ какие-то данные - какие именно, определяет она
  constructor(fn: (subject: Observer<T>) => void) {
    this.observerFunction = fn;
    this.subscriptions = [];
  }

  // Метод подписки - когда на поток кто-то подписывается,
  // создается новая подписка с ссылкой на текущий поток (чтобы можно было отписаться)
  // а так же НА ПОЛУЧЕННОМ НАБЛЮДАТЕЛЕ прогоняется функция из конструктора !!!
  // Вот этот момент с прогоном функции - САМОЕ ВАЖНОЕ
  public subscribe(observer: Observer<T>): Subscription<T> {
    //  
    this.observerFunction.call(this, observer);

    // TODO: подписка есть, но пока не все до конца понятно
    const subscription = new SubscriptionImpl<T>(this);
    this.subscriptions.push(subscription);
    return subscription;
  }

  public removeSubscrtiption(subscription: Subscription<T>) {
    const { subscriptions } = this;
    this.subscriptions = subscriptions.filter((s: Subscription<T>) => s !== subscription);
  }
}


type ObservableFunction<T> = (observer: Observer<T>) => void;

// Именно в этой функции мы прописываем, какие данные Observable будет пихать в Observer
const observableNumberFunction: ObservableFunction<number> = (observer: Observer<number>) => {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.next(4);
  observer.next(5);
  observer.next(6);
  observer.next(7);
  observer.next(8);
  observer.complete();
};

// Сейчас было создано наблюдаемое с функцией, которая описывает, какие значения передавать наблюдателю
const obs = new ObservableImpl<number>(observableNumberFunction);

/**
 * Теперь мы подписываемся на наблюдаемое и начинает отрабатывать функция, которую мы тут описали выше
 * 
 * Благодаря структурной типизации нам не обязательно даже создавать экземпляр
 * наблюдателя, достаточно передать объект, который соотносится с интерфейсом Observer. Смысл структурной типизации
 * см. в файле types.ts
*/

const subscription = obs.subscribe({
  next: (num: number) => console.log(`The passed number is: ${num}`),
  error: (reason: any) => console.error(reason),
  complete: () => console.log('The Observable is completed'),
});

// TODO: почитать, как правильно настроить компилятор
export {};