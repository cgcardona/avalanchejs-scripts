import { 
  BinTools, 
  BN, 
  Buffer
} from "avalanche"
import {
  EVMOutput,
  SelectOutputClass
} from "avalanche/dist/apis/evm"

const bintools: BinTools = BinTools.getInstance()
  
const main = async (): Promise<any> => {
  let address: string = "X-local18jma8ppw3nhx5r4ap8clazz0dps7rv5u00z96u"
  let amount: BN = new BN(1000000000)
  const assetid: string = "U8iRqJoiJm8xZHAacmvYyZVwqQx6uDNtQeP3CQ6fcgQk3JqnK"
  console.log("---------------------------------------------------------------")
  console.log("new EVMOutput")
  const evmOutput1: EVMOutput = new EVMOutput(address, amount, assetid)
  console.log(evmOutput1)
  console.log(evmOutput1.toBuffer().toString('hex'))
  amount = evmOutput1.getAmount()
  console.log(`amount: ${amount.toString()}`)
  let addyBuffer: Buffer = evmOutput1.getAddress()
  console.log(`address: ${bintools.cb58Encode(addyBuffer)}`)
  let assetIDBuffer: Buffer = evmOutput1.getAssetID()
  console.log(`assetid: ${bintools.cb58Encode(assetIDBuffer)}`)
  console.log(evmOutput1.toString())
  console.log(evmOutput1.fromBuffer(evmOutput1.toBuffer()))

  console.log("---------------------------------------------------------------")
  console.log('SelectOutputClass')
  const outputClass: string = "EVMOutput"
  const evmOutput2: EVMOutput = SelectOutputClass(outputClass, address, amount, assetid)
  console.log(evmOutput2)
  console.log(evmOutput2.toBuffer().toString('hex'))
  addyBuffer = evmOutput2.getAddress()
  console.log(`address: ${bintools.cb58Encode(addyBuffer)}`)

  amount = evmOutput2.getAmount()
  console.log(`amount: ${amount.toString()}`)

  assetIDBuffer = evmOutput2.getAssetID()
  console.log(`assetid: ${bintools.cb58Encode(assetIDBuffer)}`)
  console.log(evmOutput2.toString())
  console.log(evmOutput2.fromBuffer(evmOutput2.toBuffer()))

  console.log("---------------------------------------------------------------")
  console.log("clone")
  const evmOutput3: EVMOutput = evmOutput2.clone()
  console.log(evmOutput3)
  console.log(evmOutput3.toBuffer().toString('hex'))
  addyBuffer = evmOutput3.getAddress()
  console.log(`address: ${bintools.cb58Encode(addyBuffer)}`)

  // TODO - Why is this amount 0? It should be 1 AVAX.
  // It looks like address, amount and assetid were properly cloned. But the amount getter is returning 0.
  // The address and asset id 
  // EVMOutput {
  //   address: <Buffer 3c b7 d3 84 2e 8c ee 6a 0e bd 09 f1 fe 88 4f 68 61 e1 b2 9c>,
  //   amount: <Buffer 00 00 00 00 3b 9a ca 00>,
  //   amountValue: BN { negative: 0, words: [ 0 ], length: 1, red: null },
  //   assetid: <Buffer 3d 9b da c0 ed 1d 76 13 30 cf 68 0e fd eb 1a 42 15 9e b3 87 d6 d2 95 0c 96 f7 d2 8f 61 bb e2 aa>,
  //   getAddress: [Function],
  //   getAmount: [Function],
  //   getAssetID: [Function]
  // }
  amount = evmOutput3.getAmount()
  console.log(`amount: ${amount.toString()}`)

  assetIDBuffer = evmOutput3.getAssetID()
  console.log(`assetid: ${bintools.cb58Encode(assetIDBuffer)}`)
  console.log(evmOutput3.toString())
  console.log(evmOutput3.fromBuffer(evmOutput3.toBuffer()))

  console.log("---------------------------------------------------------------")
  console.log("create")
  const evmOutput4: EVMOutput = evmOutput3.create()
  console.log(evmOutput4)
  console.log(evmOutput4.toBuffer().toString('hex'))
  addyBuffer = evmOutput4.getAddress()
  console.log(`address: ${bintools.cb58Encode(addyBuffer)}`)

  amount = evmOutput4.getAmount()
  console.log(`amount: ${amount.toString()}`)

  assetIDBuffer = evmOutput4.getAssetID()
  console.log(`assetid: ${bintools.cb58Encode(assetIDBuffer)}`)
  console.log(evmOutput4.toString())
  console.log(evmOutput4.fromBuffer(evmOutput4.toBuffer()))
}
  
main()
