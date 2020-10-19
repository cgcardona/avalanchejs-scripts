import { Avalanche, BinTools, BN } from "avalanche"
import { Buffer } from 'buffer/'
import { 
  AVMAPI, 
  AVMKeyChain
} from "avalanche/dist/apis/avm"
import {
  PlatformVMAPI, 
  PlatformVMKeyChain,
  Tx, 
  UnsignedTx,
  UTXOSet
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
const memo: Buffer = bintools.stringToBuffer("Avalanche.js")
xKeychain.importKey("PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN")
pKeychain.importKey("PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN")
const pAddressStrings: string[] = platformvm.keyChain().getAddressStrings()

const main = async (): Promise<any> => {
  const utxoSet: UTXOSet = await platformvm.getUTXOs([pAddressStrings[0]], avm.getBlockchainID());
  const unsignedTx: UnsignedTx = await platformvm.buildImportTx(
    utxoSet,
    pAddressStrings,
    avm.getBlockchainID(),
    [pAddressStrings[0]],
    [pAddressStrings[0]],
    [pAddressStrings[0]],
    memo
  );
  const tx: Tx = unsignedTx.sign(platformvm.keyChain());
  const txid: string = await platformvm.issueTx(tx);
  console.log(txid)
}
  
main()
