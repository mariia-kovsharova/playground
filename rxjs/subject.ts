/**
 * Наблюдаемые (Observables) по способу выполнения делятся на две категории: 
 * “холодные” (unicast) и “горячие” (multicast).
 * 
 * Холодный создает новый поток для каждого нового подписчика и выдает значения лично для него.
 * Горячий регистрирует слушателей и вещает сразу всем (как EventEmitter).
 * 
 * В RxJS существуют объекты, которые одновременно являются и наблюдателем, и наблюдаемым — Subjects.
 * Главное отличие Subject’a от обычного Observable — это то, что мы можем генерировать новое событие вручную,
 * с помощью функции .next(), в то время как в Observable новые значения должны поступать из callback-функции. 
 * 
 * Также мы можем вручную завершить поток функцией .complete(); или вызвать функцию завершения потока с ошибкой .error();
 */

import { AsyncSubject, BehaviorSubject, ReplaySubject, Subject, timer } from 'rxjs';
import { take, tap } from 'rxjs/operators';

 const subject = new Subject(); // <== новый мультикаст-источник

 const source1 = timer(1000, 1000)
    .pipe(
        take(5), // <== из таймера берем 5 значений
        tap((x) => subject.next(x) ) // <== и кладем их в наш управляемый источник
     ).subscribe(); // <== запуск

 const sub11 = subject.subscribe(x => console.log('A: ', x));

 setTimeout(() => {
     const sub12 = subject.subscribe(x => console.log('B: ', x));
 }, 2500);

 /**
  *   s0 -- s1 -- s2 -- s3 -- s4 --|
  *   a0 -- a1 -- a2 -- a3 -- a4 -->
  *               b2 -- b3 -- b4 -->
  */

 /**
  *  !!!!!!!!
 ВАЖНО - когда на Subject подписывается новый подписчик, он не получит ничего, пока в поток
 не будет выброшено новое значение (т.е. чисто следующие значения из потока).

 Если Subject был завершен с помощью error или completed, "поздние" подписчики, т.е. те подписчики,
 которые подписались уже после того, как событие завершения произошло, получат только completed или error уведомление
  */

 /**
  * BehaviorSubject — всегда возвращает последнее значение из потока, при этом нужно указывать начальное значение.
    Также имеет статический метод getValue, который возвращает статическое значение без подписок и потоков.
    Т.е. в отличие от обычного Subject новый подписчик получит при подписке последнее или дефолтное значение.

    Аналогично Subject, "поздние" подписчики получат только error или complete уведомления, если поток был завершен
  */

const behaviorSubject = new BehaviorSubject<number>(9999); // <== указываем дефолтное значение
const source2 = timer(1000, 1000).pipe(
    take(5),
    tap((x) => behaviorSubject.next(x))
).subscribe();

const sub21 = behaviorSubject.subscribe(x => console.log('A: ', x));

setTimeout(() => {
  const sub22 = behaviorSubject.subscribe(x => console.log('B: ', x));
}, 2500);

 /**
  *          s0 -- s1 -- s2 -- s3 -- s4 --|
  * a9999 -- a0 -- a1 -- a2 -- a3 -- a4 -->
  *                   b1-b2 -- b3 -- b4 -->
  */

  const bSubject = new BehaviorSubject(42);
  const bSource = timer(1000, 1000).pipe(
      take(8),
      tap( (x) => bSubject.next(x) )
  ).subscribe();
  
  const bsub31 = bSubject.subscribe({
      next: x => console.log('A: ', x),
      complete: () => console.log('A completed')
  });
  
  setTimeout(() => {
    const sub32 = bSubject.subscribe({
        next: x => console.log('B: ', x),
        complete: () => console.log('B completed')
    });
  }, 2500);
  
  setTimeout(() => {
      console.log('complete bSubject');
      bSubject.complete();
  }, 5000);
  
  setTimeout(() => {
      const s4 = bSubject.subscribe({
          next: x => console.log('C (after bSubject completed) ', x),
          complete: () => console.log('C completed')
      });
  }, 10000);

  /*

    A:  42
    A:  0
    A:  1
    B:  1
    A:  2
    B:  2
    A:  3
    B:  3
    complete bSubject
    A completed
    B completed
    C completed

  */

 /**
  * ReplaySubject — имеет возможность указания размера буфера N.
  * Когда новый подписчик подписывается на поток, он получает N предыдущих значений из потока.
  * Пример использования: кеширование запросов к API.
  * 
  * В отличие от Subject, все подписчики, подписавшиеся ПОСЛЕ завершения потока, получат N последних значений в 
 *  next-обработчик, а затем completed-обработчик
  */

  const replaySubject = new ReplaySubject(2);
  const source3 = timer(1000, 1000).pipe(
      take(5),
      tap( (x) => replaySubject.next(x) )
  ).subscribe();

  const sub31 = replaySubject.subscribe(x => console.log('A: ', x));

  setTimeout(() => {
    const sub32 = replaySubject.subscribe(x => console.log('B: ', x));
  }, 2500);

   /**
  * s0 -- s1 -- s2 -- s3 -- s4 --|
  * a0 -- a1 -- a2 -- a3 -- a4 -->
  *       b0-b1-b2 -- b3 -- b4 -->
  */

    const replaySubject2 = new ReplaySubject(2);
    const source31 = timer(1000, 1000).pipe(
        take(8),
        tap( (x) => replaySubject.next(x) )
    ).subscribe();
    
    const sub311 = replaySubject.subscribe({
        next: x => console.log('A: ', x),
        complete: () => console.log('A completed')
    });
    
    setTimeout(() => {
      const sub322 = replaySubject.subscribe({
          next: x => console.log('B: ', x),
          complete: () => console.log('B completed')
      });
    }, 2500);
    
    setTimeout(() => {
        console.log('complete replaySubject');
        replaySubject.complete();
    }, 5000);
    
    setTimeout(() => {
        const sub33 = replaySubject.subscribe({
            next: x => console.log('C (after rS completed) ', x),
            complete: () => console.log('C completed')
        });
    }, 10000);

    /*
    A:  0
    A:  1
    B:  0
    B:  1
    A:  2
    B:  2
    A:  3
    B:  3
    complete replaySubject
    A completed
    B completed
    C (after rS completed)  1
    C (after rS completed)  2
    C (after rS completed)  3
    C completed
    */

/**
 * AsyncSubject — возвращает последнее значение после завершения потока.
 * 
 * В отличие от Subject, все подписчики, подписавшиеся ПОСЛЕ завершения потока, получат последнее значение в 
 * next-обработчик, а затем completed-обработчик
 */

 const asyncSubject = new AsyncSubject();
 const source4 = timer(1000, 1000).pipe(
     take(5),
     tap((x) => asyncSubject.next(x))
 ).subscribe();

 const sub41 = asyncSubject.subscribe(x => console.log('A: ', x));

 setTimeout(() => {
   const sub42 = asyncSubject.subscribe(x => console.log('B: ', x));
 }, 2500);

 setTimeout(() => {
    asyncSubject.complete();
}, 5000);

 /**
  * s0 -- s1 -- s2 -- s3 -- s4 --|
  *                         -0|  <== завершаем поток asyncSubject
  *                         -a4|
  *                         -b4|
  */