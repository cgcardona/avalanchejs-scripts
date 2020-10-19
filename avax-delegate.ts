import { Avalanche, BinTools, BN } from "avalanche"
import { Buffer } from 'buffer/'
import { UnixNow } from 'avalanche/dist/utils';
import { 
  AVMAPI, 
  AVMKeyChain
} from "avalanche/dist/apis/avm"
import {
  PlatformVMAPI, 
  PlatformVMKeyChain,
  PlatformVMConstants,
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
console.log(pAddressStrings)

const startTime: BN = UnixNow().add(new BN(60)); //60 seconds from now
const endTime: BN = startTime.add(new BN(60 * 60 * 24 * 10))
const stakeAmount: BN = PlatformVMConstants.MINSTAKE

const main = async (): Promise<any> => {
  // const utxoSet: UTXOSet = await platformvm.getUTXOs([pAddressStrings[0]])
  // const nodeID: string = "NodeID-MYUmR31tU1HBo9sXaqi7ezDEyY9a7AMCg"
  // const unsignedTx: UnsignedTx = await platformvm.buildAddDelegatorTx(
  //   utxoSet,
  //   pAddressStrings,
  //   pAddressStrings,
  //   nodeID,
  //   startTime,
  //   endTime,
  //   stakeAmount,
  //   pAddressStrings,
  //   new BN(0),
  //   1,
  //   memo
  // )
  // const tx:Tx =  unsignedTx.sign(platformvm.keyChain())
  // console.log(tx.toBuffer().toString('hex'))
  // const txid: string = await platformvm.issueTx(tx)
  // console.log(txid)
}
  
main()


// 00 00 
// 00 00 00 0e 
// 00 00 30 39 
// 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 

// 00 00 00 01 
// 39 c3 3a 49 9c e4 c3 3a 3b 09 cd d2 cf a0 1a e7 0d bf 2d 18 b2 d7 d1 68 52 44 40 e5 5d 55 00 88 
// 00 00 00 07 
// 00 00 01 d1 a9 3a dd c0 
// 00 00 00 00 00 00 00 00 
// 00 00 00 01 
// 00 00 00 01 
// 3c b7 d3 84 2e 8c ee 6a 0e bd 09 f1 fe 88 4f 68 61 e1 b2 9c 

// 00 00 00 01 
// 50 e6 17 a1 18 1c 79 1f bc 3e 5d 06 5f db 6d fb ed cb ec 73 14 08 6f 31 ae 25 d5 7b c3 46 b6 ed 
// 00 00 00 00 
// 39 c3 3a 49 9c e4 c3 3a 3b 09 cd d2 cf a0 1a e7 0d bf 2d 18 b2 d7 d1 68 52 44 40 e5 5d 55 00 88 
// 00 00 00 05 
// 00 00 03 a3 52 94 40 00 
// 00 00 00 01 
// 00 00 00 00 

// 00 00 00 0e 
// 00 0c 41 76 61 6c 61 6e 63 68 65 2e 6a 73 

// Validator
// node id
// e1 56 96 93 46 70 8c 0c 02 4a 55 ea d4 61 a8 8d 64 96 ec 71 
// startTime
// 00 00 00 00 5f 55 41 63 
// endTime
// 00 00 00 00 5f 62 70 63 
// weight
// 00 00 01 d1 a9 4a 20 00 

// Stake
// 00 00 00 01 
// 39 c3 3a 49 9c e4 c3 3a 3b 09 cd d2 cf a0 1a e7 0d bf 2d 18 b2 d7 d1 68 52 44 40 e5 5d 55 00 88 
// 00 00 00 07 
// 00 00 01 d1 a9 4a 20 00 
// 00 00 00 00 00 00 00 00 
// 00 00 00 01 
// 00 00 00 01 
// 3c b7 d3 84 2e 8c ee 6a 0e bd 09 f1 fe 88 4f 68 61 e1 b2 9c 

// RewardsOwner
// 00 00 00 0b 
// 00 00 00 00 00 00 00 00 
// 00 00 00 01 
// 00 00 00 01 
// 3c b7 d3 84 2e 8c ee 6a 0e bd 09 f1 fe 88 4f 68 61 e1 b2 9c 

// 00 00 00 01 00 00 00 09 00 00 00 01 cb cf a5 93 54 86 c8 42 49 7f 5b 27 30 b1 0e 5b c4 8e 6c a3 7e 40 b4 0e b7 cc 1b 21 57 c8 04 87 72 c9 ab b1 46 fe 63 92 6b 07 dd f4 02 7f 56 0d 66 d1 67 74 25 7a 90 4f 49 21 aa 9c db 7c 12 05 01

