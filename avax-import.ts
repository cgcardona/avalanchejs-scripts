import { Avalanche, BinTools, BN } from "avalanche"
import { Buffer } from 'buffer/'
import { 
  AVMAPI, 
  KeyChain as AVMKeyChain
} from "avalanche/dist/apis/avm"
import {
  PlatformVMAPI, 
  KeyChain as PlatformVMKeyChain,
  Tx, 
  UnsignedTx,
  UTXOSet
} from "avalanche/dist/apis/platformvm";
import { 
  EVMAPI,
  KeyChain as EVMKeyChain,
} from "avalanche/dist/apis/evm"

const ip: string = "localhost"
const protocol: string = "http"
const networkID: number = 12345
const port: number = 9650
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const bintools: BinTools = BinTools.getInstance()
const avm: AVMAPI = avalanche.XChain()
const platformvm: PlatformVMAPI= avalanche.PChain()
const evm: EVMAPI = avalanche.CChain()
const xKeychain: AVMKeyChain = avm.keyChain()
const pKeychain: PlatformVMKeyChain = platformvm.keyChain()
const cKeychain: EVMKeyChain = evm.keyChain()
const memo: Buffer = bintools.stringToBuffer("Avalanche.js")
xKeychain.importKey("PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN")
pKeychain.importKey("PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN")
cKeychain.importKey("PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN")
const xAddressStrings: string[] = avm.keyChain().getAddressStrings()
const pAddressStrings: string[] = platformvm.keyChain().getAddressStrings()
const eAddressStrings: string[] = evm.keyChain().getAddressStrings()
// console.log(xAddressStrings)
// console.log(pAddressStrings)
// console.log(eAddressStrings)

const main = async (): Promise<any> => {
  // let alias: string = evm.getBlockchainAlias()
  // console.log(alias)
  // let newAlias: string = evm.setBlockchainAlias('new alias')
  // console.log('------')
  // console.log(newAlias)
  // console.log('------')
  // alias = evm.getBlockchainAlias()
  // console.log(alias)

  // let blockchainID = evm.getBlockchainID()
  // console.log(blockchainID)
  // let foo = evm.refreshBlockchainID('And another one')
  // console.log(foo)
  // let addr = evm.parseAddress(eAddressStrings[0])
  // console.log(addr)
  // let str = evm.addressFromBuffer(addr)
  // console.log(str)
  console.log('foobar')
  let a = await evm.getAVAXAssetID()
  console.log(a)
  // let b = evm.setAVAXAssetID('new asset id')
  // console.log(b)
  // a = await evm.getAVAXAssetID()
  // console.log(a)
  // let c = evm.getDefaultTxFee()
  // console.log(c)
  // let d = evm.getTxFee()
  // console.log(d)
  // let e = evm.setTxFee(new BN(507))
  // console.log(e)
  // d = evm.getTxFee()
  // console.log(d)
  // let f = evm.getDefaultCreationTxFee()
  // console.log(f)
  // let g = evm.getCreationTxFee()
  // console.log(g)
  // let h = evm.setCreationTxFee(new BN(7605))
  // console.log(h)
  // g = evm.getCreationTxFee()
  // console.log(g)
  return false
//   const utxoSet: UTXOSet = await platformvm.getUTXOs([pAddressStrings[0]], avm.getBlockchainID());
//   const unsignedTx: UnsignedTx = await platformvm.buildImportTx(
//     utxoSet,
//     pAddressStrings,
//     avm.getBlockchainID(),
//     [pAddressStrings[0]],
//     [pAddressStrings[0]],
//     [pAddressStrings[0]],
//     memo
//   );
//   const tx: Tx = unsignedTx.sign(platformvm.keyChain());
//   const txid: string = await platformvm.issueTx(tx);
//   console.log(txid)
}
  
main()
