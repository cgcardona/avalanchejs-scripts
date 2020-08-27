// imports
import {
  Avalanche,
  AVM,
  UTXOSet,
  UnsignedTx,
  Tx,
  BinTools,
  AVMKeyChain
} from "avalanche" 
import { Buffer } from 'buffer/'; 
import BN from "bn.js"

// the goods
const main = async (): Promise<any> => {
  const ip: string = "localhost"
  const port: number = 9650
  const protocol: string = "http"
  const networkID: number = 12345
  const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
  const avm: AVM = avalanche.XChain()
  const defaultFee: BN = avm.getDefaultFee()
  // console.log(`defaultFee: ${defaultFee.toString()}`)
  const bintools: BinTools = BinTools.getInstance()
  const myKeychain: AVMKeyChain = avm.keyChain()
  const mypk: Buffer = bintools.cb58Decode("ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN")
  myKeychain.importKey(mypk)
  const addresses: Buffer[] = avm.keyChain().getAddresses()
  const addressStrings: string[] = avm.keyChain().getAddressStrings()
  // console.log(addressStrings)
  const amount: BN = new BN(54321)
  for(let i: number = 0; i <= 10; i++) {
    const fee: BN = new BN(i)
    avm.setFee(fee)
    const currentFee: BN = avm.getFee()
    // console.log(`currentFee: ${currentFee.toNumber() === i}`)
  }
  const utxoSet: UTXOSet = await avm.getUTXOs(addresses)
  const assetID: Buffer = await avm.getAVAXAssetID()
  const memoBuf: Buffer = bintools.stringToBuffer("Avalanche.js")
  const memoCB58: string = bintools.cb58Encode(memoBuf)
  const memo: Buffer = bintools.stringToBuffer(memoCB58)
  const unsignedTx: UnsignedTx = await avm.buildBaseTx(
      utxoSet,
      amount,
      assetID,
      addressStrings,
      addressStrings,
      addressStrings,
      memo,
  )
  // console.log(unsignedTx)
  const tx: Tx =  unsignedTx.sign(avm.keyChain())
  console.log(tx.toBuffer().toString('hex'))
  const txid: string = await avm.issueTx(tx)
  console.log(txid)
}
main()