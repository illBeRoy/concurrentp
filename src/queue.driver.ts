import { Queue } from './queue';

class Driver {
  private queue: Queue;
  private promises: Promise<void>[] = [];
  private valueOfThePromiseThatWasStartedLast = 0;
  private eventualValue = 0;

  private async acquireAndWaitRandomAmountOfTime() {
    this.valueOfThePromiseThatWasStartedLast += 1;

    const value = this.valueOfThePromiseThatWasStartedLast;
    const ticket = this.queue.acquire();

    await new Promise(res => setTimeout(res, Math.floor(Math.random() * 50)));

    if (this.queue.isMostRecent(ticket)) {
      this.eventualValue = value;
    }
  }

  private waitPromisesDone() {
    return Promise.all(this.promises);
  }

  given = {
    someQueue: (): Driver => {
      this.queue = new Queue();
      return this;
    }
  };

  when = {
    invokingSomePromisesThatMightResolveAtADifferentOrder: () => {
      for (let i = 0; i < Math.floor(Math.random() * 100); i += 1) {
        this.promises.push(this.acquireAndWaitRandomAmountOfTime());
      }
      return this.waitPromisesDone();
    }
  };

  get = {
    eventualValue: () => this.eventualValue,
    valueOfThePromiseThatWasStartedLast: () => this.valueOfThePromiseThatWasStartedLast
  }
}

export { Driver };
