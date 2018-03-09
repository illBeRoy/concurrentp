![Logo](logo.svg)
# ConcurrentP
Promise concurrency control done right

[![Travis](https://img.shields.io/travis/illBeRoy/concurrentp.svg?style=flat-square)](https://travis-ci.org/illBeRoy/concurrentp/)


## Abstract
Concurrency is a major concern for any asynchronous application. While Javascript's single-threaded nature solves many of the known issues with multithreaded runtime models, it does not relieve us from taking care of concurrency control; mutex violations can occure when performing io operations such as writing and reading from databases, and rollbacks can be caused by callbacks carried on with outdated, delayed network request.

ConcurrentP provides a modest and lightweight set of tools to overcome those issues, with as minimal a footprint as possible.

## Usage
### Installing
Add to your project by npm:

`$ npm install -s concurrentp`

or yarn:

`$ yarn add concurrentp`

### Importing
Add to your code by importing any of the objects from the package:

`import { Lock } from 'concurrentp';`

### Typings
Typescripts type declarations are included.

## API
### Contents
* [Lock](#lock)
* [Semaphore](#semaphore)
* [Queue](#queue)

### Lock
The Lock object provides means of mutual exclusion; Given two promises are performing a critical section of a singular operation, the lock object makes sure that no more than one promise can perform it at a time.

The Lock ensures mutual exclusion **and** starvation freedom, as it resumes promises in the order they acquired it.

#### Methods:
| Name | Return Value | Description |
|------|--------------|-------------|
| `new Lock()` | Lock | creates a new lock instance. |
| `acquire()` | Promise<void> | acquires a lock. Either resolves immediately, or when the lock frees up. |
| `release()` | void | releases the lock, and possibly resolves the next promise which acquired the lock. |

#### Example:
```javascript
import { Lock } from 'concurrentp';

const lock = new Lock();

async function oneAtATime() {
	await lock.acquire();

	await getIcecream();
	
	lock.release();
}
```

### Semaphore
The Semaphore object is used for limiting the capacity of a given operation. Much like the lock, it can be acquired and released; but unlike the latter, it allows for any given amount of parallel runs (instead of just 1 with lock).

Semaphore enforces a limit on the amount of parallel execution **and** provides starvation freedom, as it resumes promises in the order they acquired it.

#### Methods:
| Name | Return Value | Description |
|------|--------------|-------------|
| `new Semaphore(limit: number)` | Semaphore | creates a new semaphore that allows up to `limit` number of parallel executions. |
| `acquire()` | Promise<void> | acquires the semaphore. Either resolves immediately, or when the semaphores frees up. |
| `release()` | void | releases the semaphore, and possibly resolves the next promise which acquired the semaphore. |

#### Example
```javascript
import { Semaphore } from 'concurrentp';

const semaphore = new Semaphore(2);

async function iHaveOnlyTwoHands() {
	await semaphore.acquire();

	await holdPotato();
	
	semaphore.release();
}
```

### Queue
The Queue object is used as rollback guard: it makes sure that results of recent instances of an operation cannot be overwritten by earlier ones. This is extremely useful in cases where one operation comes instead of another, but the other completed first, which can lead to a outdated result overriden the most recent one.

The Queue provides you with a "ticket" system. Whenever you want to use a queue, acquire a ticket, and then go on and perform an async operation. When it's done, check if your ticket is still up to date - and if it is, it means it is safe for you to carry on and no rollback will occure.

The Queue object prevents rollbacks, but it **does not** prevent older promises from resolving, if they were the most recent ones to do so.

#### Methods:
| Name | Return Value | Description |
|------|--------------|-------------|
| `new Queue()` | Queue  | creates a new queue instance. |
| `acquire()`   | number | instantly acquires a ticket.  |
| `isMostRecent(ticket: number)` | boolean | instantly checks if your ticket is the most recent one to complete. |

#### Example
```javascript
import { Queue } from 'concurrentp';

const queue = new Queue();

async function searchImage(animal) {
	const ticket = queue.acquire();
	const imageOfAnimal = await tumblr.search(animal);
	if (queue.isMostRecent(ticket)) {
		$('#image').src = imageOfAnimal;
	}
}

searchImage('dog');
searchImage('ferret');
searchImage('cat');
```

## License
The project is available to all under MIT license.