import { Semaphore } from './semaphore';

class Driver {
  private semaphore: Semaphore;
  private promisesStarted: number;
  private promisesDone: number;

  constructor() {
    this.promisesStarted = 0;
    this.promisesDone = 0;
  }

  private async acquireButNotRelease() {
    this.promisesStarted += 1;
    await this.semaphore.acquire();
    this.promisesDone += 1;
  }

  private async acquireAndRelease() {
    this.promisesStarted += 1;
    await this.semaphore.acquire();
    this.semaphore.release();
    this.promisesDone += 1;
  }

  private waitPromisesDone() {
    return new Promise(res => setTimeout(res, 50));
  }

  given = {
    semaphoreWithSomeLimit: (): Driver => {
      this.semaphore = new Semaphore(Math.floor(Math.random() * 1000));
      return this;
    }
  };

  when = {
    acquiringSemaphoreMoreThanItAllows: () => {
      for (let i = 0; i < this.semaphore.limit + 1; i += 1) {
        this.acquireButNotRelease();
      }
      return this.waitPromisesDone();
    },

    acquiringSemaphoreMoreThanItAllowsAndReleasingThem: () => {
      for (let i = 0; i < this.semaphore.limit + 1; i += 1) {
        this.acquireAndRelease();
      }
      return this.waitPromisesDone();
    }
  };

  get = {
    amountOfPromisesStarted: () => this.promisesStarted,
    amountOfPromisesDone: () => this.promisesDone,
    semaphoreLimit: () => this.semaphore.limit
  };
}

export { Driver };
