import { Driver } from './lock.driver';

describe('Lock', () => {
  let driver: Driver;

  beforeEach(() =>
    driver = new Driver());

  it('should provide mutex for any given amount of promises acquiring the same lock', () =>
    driver
      .given.lock()
      .when.multiplePromisesAttemptToPerformCSAtOnce()
      .then(() =>
        expect(driver.get.maxParallelPromisesInCS()).toEqual(1)));
});