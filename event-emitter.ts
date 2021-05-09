type MyEventCallback = (event: Event) => any;

class MyEventEmitter {
  private events: Map<string, MyEventCallback[]>;

  constructor() {
    this.events = new Map();
  }

  on(eventName: string, callback: MyEventCallback): void {
    const callbacks = [...(this.events.get(eventName) ?? []), callback];
    this.events.set(eventName, callbacks);
  }

  emit(eventName: string): void {
    const event = new Event(eventName);
    const callbacks = this.events.get(eventName) ?? [];
    callbacks.forEach((callback: MyEventCallback) => {
      callback(event);
    });
  }
}

const myEmitter = new MyEventEmitter();

myEmitter.on("click", () => {
  console.log("click event callback");
});
myEmitter.on("keyup", () => {
  console.log("keyup event callback");
});
myEmitter.on("click", (event: Event) => {
  console.log("another click event callback");
});

myEmitter.emit("keyup");

myEmitter.emit("click");

export {};
