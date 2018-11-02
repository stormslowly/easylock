import {withLock} from "../index";

describe('basic use', () => {


  it('with default withLock', async function () {

    await withLock('lockMe', async () => {
    })

  });
})
