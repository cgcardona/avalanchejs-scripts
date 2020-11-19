import { Avalanche, BinTools, BN } from "avalanche"
import { Buffer } from 'buffer/'
import { 
  AVMAPI, 
  AVMKeyChain, 
} from "avalanche/dist/apis/avm"
import {
  Tx, 
  UnsignedTx,
  UTXOSet,
  PlatformVMConstants, PlatformVMAPI, PlatformVMKeyChain
} from "avalanche/dist/apis/platformvm";

// consts
const ip: string = "localhost"
const protocol: string = "http"
const networkID: number = 12345
const port: number = 9650
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const bintools: BinTools = BinTools.getInstance()
const avm: AVMAPI = avalanche.XChain()
const platformvm: PlatformVMAPI= avalanche.PChain()
const xKeychain: AVMKeyChain = avm.keyChain()
const pKeychain: PlatformVMKeyChain = platformvm.keyChain()
const memoBuf: Buffer = bintools.stringToBuffer("Avalanche.js")
const memoCB58: string = bintools.cb58Encode(memoBuf)
const memo: Buffer = bintools.stringToBuffer(memoCB58)
xKeychain.importKey("PrivateKey-")
pKeychain.importKey("PrivateKey-")
const xAddressStrings: string[] = avm.keyChain().getAddressStrings()
const pAddressStrings: string[] = platformvm.keyChain().getAddressStrings()
const amount: BN = PlatformVMConstants.MINSTAKE.mul(new BN(2))

const main = async (): Promise<any> => {
  const utxoSet: UTXOSet = await platformvm.getUTXOs([pAddressStrings[0]])
  const amtfee: BN = amount.add(platformvm.getFee());
  const memo: Buffer = bintools.stringToBuffer("Avalanche.js")
  const unsignedTx: UnsignedTx = await platformvm.buildExportTx(
    utxoSet,
    amtfee,
    avm.getBlockchainID(),
    [xAddressStrings[0]],
    [pAddressStrings[0]],
    [pAddressStrings[0]],
    memo
  )
  const tx: Tx = unsignedTx.sign(platformvm.keyChain())
  const txid: string = await platformvm.issueTx(tx)
  console.log(txid)
}
  
main()