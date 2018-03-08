import { Driver } from './queue.driver';

describe('Queue', () => {

  let driver: Driver;

  beforeEach(() =>
    driver = new Driver());

  it('should prevent rollbacks between subsequent async operations, regardless of their resolve order', () =>
    driver
      .given.someQueue()
      .when.invokingSomePromisesThatMightResolveAtADifferentOrder()
      .then(() =>
        expect(driver.get.eventualValue())
          .toEqual(driver.get.valueOfThePromiseThatWasStartedLast())));

});