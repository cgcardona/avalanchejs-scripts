import { 
  Avalanche, 
  BinTools, 
  BN, 
  Buffer,
  evm
} from "avalanche"
import {
  EVMOutput,
  EVMAPI,
  SelectOutputClass
} from "avalanche/dist/apis/evm"
import { getPreferredHRP } from "avalanche/dist/utils"

const bintools: BinTools = BinTools.getInstance()
const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 12345
  
const main = async (): Promise<any> => {
  const hrp: string = getPreferredHRP(networkID)
  const blockchainID: string = "X" 
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
  address = bintools.addressToString(hrp, blockchainID, addyBuffer)
  console.log(`address: ${address}`)
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
  address = bintools.addressToString(hrp, blockchainID, addyBuffer)
  console.log(`address: ${address}`)

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
  address = bintools.addressToString(hrp, blockchainID, addyBuffer)
  console.log(`address: ${address}`)

  amount = evmOutput3.getAmount()
  console.log(`amount: ${amount.toString()}`)

  assetIDBuffer = evmOutput3.getAssetID()
  console.log(`assetid: ${bintools.cb58Encode(assetIDBuffer)}`)
  console.log(evmOutput3.toString())
  console.log(evmOutput3.fromBuffer(evmOutput3.toBuffer()))

  console.log("---------------------------------------------------------------")
  console.log("create")
  const evmOutput4: EVMOutput = evmOutput2.create()
  console.log(evmOutput4)
  console.log(evmOutput4.toBuffer().toString('hex'))
  addyBuffer = evmOutput4.getAddress()
  address = bintools.addressToString(hrp, blockchainID, addyBuffer)
  console.log(`address: ${address}`)

  amount = evmOutput4.getAmount()
  console.log(`amount: ${amount.toString()}`)

  assetIDBuffer = evmOutput4.getAssetID()
  console.log(`assetid: ${bintools.cb58Encode(assetIDBuffer)}`)
  console.log(evmOutput4.toString())
  console.log(evmOutput4.fromBuffer(evmOutput4.toBuffer()))
}
  
main()
