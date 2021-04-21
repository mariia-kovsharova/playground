/*  Предположим, что у нас есть некая функция, которая делает что-то асинхронное
    Например, запрашивает данные с апи и т.п.
    В нашем случае - создает промис и резолвит его через N времени
*/
function asyncFoo(_url: string, delay: number = 3000): Promise<string> {
    console.log('Promise pending...');
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('Data from API');
        }, delay);
    })
}

function *main(): Generator<Promise<string>> {
    try {
        console.log('start main function');
        const data = yield asyncFoo('my-url');
        /*
            Что тут происходит: при остановке генератора мы вызываем нашу асинхронную функцию
            с параметрами КАК СИНХРОННУЮ. Наружу возвращается результат из функции asyncFoo, промис.

            Далее, yield как бы задает вопрос "Какое значение записать в data?"

            На этот вопрос "ответит" результат резолва промиса - либо данные, если промис разрешится успешно (шаг 1)
            Либо отклонение (ошибка), если промис зареджектится (шаг 2)

        */
        console.log(`got data from API: ${data}`);
    } catch (error) {
        console.log(`got error from API: ${error}`);
    }
}

const it = main(); // Получаем итератор
const first = it.next(); // Запускаем выполнение генератора (шаг 0).
// Вызов функции asyncFoo вернет промис
const promise = first.value;
// Ждем, пока промис зарезолвится
promise
    .then((data: string) => {
        console.log('Promise resolved!!!');
        // возвращаемся в *main с полученными данными!
        it.next(data); // шаг 1
    })
    .catch((error: any) => {
        // если где-то произошла ошибка, кидаем ошибку в *main - ее поймает блок catch
        it.throw(error); // шаг 2
    });

export {};