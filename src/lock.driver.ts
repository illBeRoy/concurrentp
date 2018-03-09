import { Lock } from './lock';

class Driver {
  private lock: Lock;
  private promises: Promise<void>[] = [];
  private parallelPromisesInCS: number = 0;
  private maxParallelPromisesInCS: number = 0;

  private async promiseThatPerformsCS() {
    await this.lock.acquire();

    this.parallelPromisesInCS += 1;
    if (this.parallelPromisesInCS > this.maxParallelPromisesInCS) {
      this.maxParallelPromisesInCS = this.parallelPromisesInCS;
    }

    await this.someAsyncOperationThatGivesChanceForOtherPromisesToAttemptCS();

    this.parallelPromisesInCS -= 1;
    this.lock.release();
  }

  private someAsyncOperationThatGivesChanceForOtherPromisesToAttemptCS() {
    return new Promise(res => setTimeout(res, Math.floor(Math.random() * 50)));
  }

  private waitPromisesDone() {
    return Promise.all(this.promises);
  }

  given = {
    lock: () => {
      this.lock = new Lock();
      return this;
    }
  };

  when = {
    multiplePromisesAttemptToPerformCSAtOnce: () => {
      for (let i = 0; i < Math.floor(Math.random() * 50); i += 1) {
        this.promises.push(this.promiseThatPerformsCS());
      }
      return this.waitPromisesDone();
    }
  };

  get = {
    maxParallelPromisesInCS: () => this.maxParallelPromisesInCS
  };
}

export { Driver };
