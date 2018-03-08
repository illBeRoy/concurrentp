import { Semaphore } from './semaphore';

class Lock extends Semaphore {
  constructor() {
    super(1);
  }
}

export { Lock };
