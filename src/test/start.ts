import {withLock} from "../index";
import {expect} from "chai";

describe('basic use', () => {


  it('with default withLock', async function () {

    const h = await withLock('lockMe', async () => {
      return 'hello'
    })

    expect(h).to.equal('hello')

  });

})
