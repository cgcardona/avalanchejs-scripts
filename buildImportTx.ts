import { Avalanche, BinTools, BN } from "avalanche"
import { Buffer } from 'buffer/'
import { 
  AVMAPI, 
  AVMKeyChain, 
} from "avalanche/dist/apis/avm"
import {
  PlatformVMAPI, 
  PlatformVMKeyChain,
  Tx, 
  UnsignedTx,
  UTXOSet,
  UTXO,
  AmountOutput
} from "avalanche/dist/apis/platformvm"
// import { 
//   PlatformChainID,
// } from "avalanche/dist/utils/constants"

// consts
const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 12345
const fee: BN = new BN(9000000)
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const pchain: PlatformVMAPI = avalanche.PChain()
const bintools: BinTools = BinTools.getInstance()
const xchain: AVMAPI = avalanche.XChain()
const xKeychain: AVMKeyChain = xchain.keyChain()
const xpk: Buffer = bintools.cb58Decode("ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN")
xKeychain.importKey(xpk)
const xAddresses: Buffer[] = xchain.keyChain().getAddresses()
const xAddressStrings: string[] = xchain.keyChain().getAddressStrings()
console.log(xAddressStrings)
const pKeychain: PlatformVMKeyChain = pchain.keyChain()
const mypk: Buffer = bintools.cb58Decode("ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN")
pKeychain.importKey(mypk)
const addresses: Buffer[] = pchain.keyChain().getAddresses()
const addressStrings: string[] = pchain.keyChain().getAddressStrings()
console.log(addressStrings)
const avmChainID: string = "v4hFSZTNNVdyomeMoXa77dAz4CdxU3cziSb45TB7mfXUmy7C7"
pchain.setFee(fee)

// the goods
const main = async (): Promise<any> => {
  const utxoSet: UTXOSet = await pchain.getUTXOs(addressStrings)
  let atomics:UTXOSet = await pchain.getUTXOs(xAddressStrings);
  let allatomics:Array<UTXO> = atomics.getAllUTXOs();
  for(let i = 0; i < allatomics.length; i++) {
    let ao:AmountOutput = allatomics[i].getOutput() as AmountOutput;
    // console.log(ao.getAmount().toString(10), bintools.cb58Encode(allatomics[i].getAssetID()));
  }
  // console.log(utxoSet.getBalance(addresses, await pchain.getAVAXAssetID()).toString(10) , pchain.getFee().toString(10), utxoSet.getAllUTXOStrings())
  // return false
  const memoBuf: Buffer = bintools.stringToBuffer("Avalanche.js")
  const memoCB58: string = bintools.cb58Encode(memoBuf)
  const memo: Buffer = bintools.stringToBuffer(memoCB58)
  const unsignedTx: UnsignedTx = await pchain.buildImportTx(
    utxoSet,
    xAddressStrings,
    avmChainID,
    addressStrings,
    addressStrings,
    addressStrings,
    memo
  )
  const tx: Tx =  unsignedTx.sign(pKeychain)
  // console.log(tx.toBuffer().toString('hex'))
  const txid: string = await pchain.issueTx(tx)
  console.log(`TXID: ${txid}`)
  // console.log("avax assetid", bintools.cb58Encode(await pchain.getAVAXAssetID()))

  // atomics = await pchain.getUTXOs(xAddressStrings);
  // allatomics = atomics.getAllUTXOs();
  // for(let i = 0; i < allatomics.length; i++) {
  //   let ao:AmountOutput = allatomics[i].getOutput() as AmountOutput;
  //   console.log(ao.getAmount().toString(10), bintools.cb58Encode(allatomics[i].getAssetID()));
  // }
}

main()