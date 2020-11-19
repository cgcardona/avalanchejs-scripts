import { 
  BinTools, 
  BN, 
  Buffer
} from "avalanche"
import {
  EVMInput,
  SelectInputClass
} from "avalanche/dist/apis/evm"

const bintools: BinTools = BinTools.getInstance()
  
const main = async (): Promise<any> => {
  let address: string = "X-local18jma8ppw3nhx5r4ap8clazz0dps7rv5u00z96u"
  let amount: BN = new BN(1000000000)
  let nonce: BN = new BN(0)
  const assetid: string = "U8iRqJoiJm8xZHAacmvYyZVwqQx6uDNtQeP3CQ6fcgQk3JqnK"
  console.log("---------------------------------------------------------------")
  console.log("new EVMInput")
  const EVMInput1: EVMInput = new EVMInput(address, amount, assetid, nonce)
  console.log(EVMInput1)
  console.log(EVMInput1.toBuffer().toString('hex'))
  amount = EVMInput1.getAmount()
  console.log(`amount: ${amount.toString()}`)
  let addyBuffer: Buffer = EVMInput1.getAddress()
  console.log(`address: ${bintools.cb58Encode(addyBuffer)}`)
  let assetIDBuffer: Buffer = EVMInput1.getAssetID()
  console.log(`assetid: ${bintools.cb58Encode(assetIDBuffer)}`)
  let n: BN = EVMInput1.getNonce()
  console.log(`nonce: ${n.toString()}`)
  console.log(EVMInput1.toString())
  console.log(EVMInput1.fromBuffer(EVMInput1.toBuffer()))

  console.log("---------------------------------------------------------------")
  console.log('SelectInputClass')
  const inputClass: string = "EVMInput"
  const EVMInput2: EVMInput = SelectInputClass(inputClass, address, amount, assetid, nonce)
  console.log(EVMInput2)
  console.log(EVMInput2.toBuffer().toString('hex'))
  addyBuffer = EVMInput2.getAddress()
  console.log(`address: ${bintools.cb58Encode(addyBuffer)}`)

  amount = EVMInput2.getAmount()
  console.log(`amount: ${amount.toString()}`)

  assetIDBuffer = EVMInput2.getAssetID()
  console.log(`assetid: ${bintools.cb58Encode(assetIDBuffer)}`)
  n = EVMInput2.getNonce()
  console.log(`nonce: ${n.toString()}`)
  console.log(EVMInput2.toString())
  console.log(EVMInput2.fromBuffer(EVMInput2.toBuffer()))

  console.log("---------------------------------------------------------------")
  console.log("clone")
  const EVMInput3: EVMInput = EVMInput2.clone()
  console.log(EVMInput3)
  console.log(EVMInput3.toBuffer().toString('hex'))
  addyBuffer = EVMInput3.getAddress()
  console.log(`address: ${bintools.cb58Encode(addyBuffer)}`)

  // TODO - Why is this amount 0? It should be 1 AVAX.
  // It looks like address, amount and assetid were properly cloned. But the amount getter is returning 0.
  // The address and asset id 
  // EVMInput {
  //   address: <Buffer 3c b7 d3 84 2e 8c ee 6a 0e bd 09 f1 fe 88 4f 68 61 e1 b2 9c>,
  //   amount: <Buffer 00 00 00 00 3b 9a ca 00>,
  //   amountValue: BN { negative: 0, words: [ 0 ], length: 1, red: null },
  //   assetid: <Buffer 3d 9b da c0 ed 1d 76 13 30 cf 68 0e fd eb 1a 42 15 9e b3 87 d6 d2 95 0c 96 f7 d2 8f 61 bb e2 aa>,
  //   getAddress: [Function],
  //   getAmount: [Function],
  //   getAssetID: [Function]
  // }
  amount = EVMInput3.getAmount()
  console.log(`aamount: ${amount.toString()}`)

  assetIDBuffer = EVMInput3.getAssetID()
  console.log(`assetid: ${bintools.cb58Encode(assetIDBuffer)}`)
  n = EVMInput3.getNonce()
  console.log(`nonce: ${n.toString()}`)
  console.log(EVMInput3.toString())
  console.log(EVMInput3.fromBuffer(EVMInput3.toBuffer()))

  console.log("---------------------------------------------------------------")
  console.log("create")
  const EVMInput4: EVMInput = EVMInput3.create()
  console.log(EVMInput4)
  console.log(EVMInput4.toBuffer().toString('hex'))
  addyBuffer = EVMInput4.getAddress()
  console.log(`address: ${bintools.cb58Encode(addyBuffer)}`)

  amount = EVMInput4.getAmount()
  console.log(`amount: ${amount.toString()}`)

  assetIDBuffer = EVMInput4.getAssetID()
  console.log(`assetid: ${bintools.cb58Encode(assetIDBuffer)}`)
  n = EVMInput4.getNonce()
  console.log(`nonce: ${n.toString()}`)
  console.log(EVMInput4.toString())
  console.log(EVMInput4.fromBuffer(EVMInput4.toBuffer()))
}
  
main()
