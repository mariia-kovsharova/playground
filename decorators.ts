/**
  Рассматриваемые темы - декоратры классов, методов, свойств
  Декоратор это функция, которая применяется на классах или их
  элементах, или на других JS-сущностях. 
  Они добавляют функционал переданной сущности в рантайме, не
  добавляя какой-то информации при статистическом анализе.
  Возвращают сущность с тем же интерфейсом.
 */

class Notification {
  type: string;

  constructor(type: string = 'Success') {
    this.type = type;
  }

  notifyUser() {
    console.log(`${this.type} notification`);
  }
}

const notification = new Notification();

notification.notifyUser();

/**
 * Создадим декоратор, который выполняет метод класса с задержкой
 */

function DelayMilliseconds(ms: number = 3000) {
  return function <T>(
    /**
     * @param target - либо функция-конструктор класса для статического свойства, либо прототип класса для экземпляра
     * @param propertyKey - свойство класса, которое мы декорируем
     * @param descriptior - дескриптор свойства
     */
    target: T,
    propertyKey: keyof T,
    descriptor: PropertyDescriptor
  ) {

    const originalMethod = descriptor.value;

    descriptor.value = function (...args) {
      setTimeout(() => {
        originalMethod.call(this, args);
      }, ms);
    }
  }
}

class DelayedNotification {
  type: string;

  constructor(type: string = 'Success') {
    this.type = type;
  }

  @DelayMilliseconds(5000)
  notifyUser() {
    console.log(`Delayed ${this.type} notification`);
  }
}

const delayedNotification = new DelayedNotification();

delayedNotification.notifyUser();

export { }