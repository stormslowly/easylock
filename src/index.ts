import * as Bluebird from 'bluebird'
import {RedisClient} from "redis";
import * as redisLock from 'redis-lock'
import * as redis from "redis";

interface unlocker {
  (): void
}


type Locker = (key: string, timeOutInMs?: number) => Promise<unlocker>


export function createLocker(redisClient: any): Locker {
  const rawLock = redisLock(redisClient)

  const wrappedWithErrorFist = function (id, timeout, onLocked) {
    rawLock(id, timeout, function (done) {
      onLocked(null, done)
    })
  }

  const asyncLock = Bluebird.promisify<unlocker, string, number>(wrappedWithErrorFist)

  return async function lock(lockId: string, timeOutInMs: number = 5000): Promise<unlocker> {
    return asyncLock(lockId, timeOutInMs)
  }
}

const redisClient = redis.createClient()

export type LockConfig = { key: string, timeOutInMs: number };

export function createLockContext(redisClient: RedisClient) {

  const locker = createLocker(redisClient)

  async function withLock(config: string | LockConfig, func: () => Promise<any>) {

    let key = ''
    let timeOut = 5000

    if (typeof config === 'string') {

      key = config
    } else {
      key = config.key
      timeOut = config.timeOutInMs
    }

    const unlock = await locker(key, timeOut)

    try {
      await func()
    } catch (e) {
      console.error(e)
      throw e
    }
    finally {
      unlock()
    }
  }

  return {
    locker,
    withLock
  }
}

const defaultContext = createLockContext(redisClient)

export const withLock = defaultContext.withLock
export const defaultLocker = defaultContext.locker
