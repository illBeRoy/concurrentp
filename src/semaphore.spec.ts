import { Driver } from './semaphore.driver';

describe('Semaphore', () => {

  let driver: Driver;

  beforeEach(() =>
    driver = new Driver());

  it('should not let more than N promises to acquire at a time', () =>
    driver
      .given.semaphoreWithSomeLimit()
      .when.acquiringSemaphoreMoreThanItAllows()
      .then(() =>
        expect(driver.get.amountOfPromisesDone()).toEqual(driver.get.semaphoreLimit())));

  it('should eventually run all promises, given they release the semaphore when done', () =>
    driver
      .given.semaphoreWithSomeLimit()
      .when.acquiringSemaphoreMoreThanItAllowsAndReleasingThem()
      .then(() =>
        expect(driver.get.amountOfPromisesDone()).toEqual(driver.get.amountOfPromisesStarted())));

});
