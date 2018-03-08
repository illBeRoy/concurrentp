class Semaphore {
  readonly limit: number;
  private acquired: number;
  private awaiting: Deferred[];

  constructor(limit: number) {
    this.limit = limit;
    this.acquired = 0;
    this.awaiting = [];
  }

  async acquire() {
    if (this.acquired >= this.limit) {
      const deferred = new Deferred();
      this.awaiting.push(deferred);
      
      await deferred.promise;
    }

    this.acquired += 1;
  }

  release() {
    const deferred = this.awaiting.pop();
    this.acquired -= 1;
    if (deferred) {
      deferred.resolve();
    }
  }
}

class Deferred {
  readonly promise: Promise<void>;
  private res: () => void;
  private rej: () => void;

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  resolve() {
    this.res();
  }

  reject() {
    this.rej();
  }
}

export { Semaphore };
