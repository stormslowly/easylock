easy use redis red-lock
---


it's for personal use now.
use it for you own risk.


```typescript

import withLock from 'easylock'

async function exec() {
  
  await withLock('user_id',async ()=>{
    // default red-lock  timeout is 5000 ms
    // do sth with lock to user_id
  })

  // or

  await withLock({key:'user_id', timeOutInMs:500},async ()=>{
    // do sth with lock to user_id with timeout 500ms
  })
}
```


# plan

[] support `withLocks(['lock1','lock2'], ...)`
[] timeout handle 
[] tests
