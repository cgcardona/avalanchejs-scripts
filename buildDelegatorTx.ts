import { Avalanche, BinTools, BN } from "avalanche"
import { Buffer } from 'buffer/'
// import { 
//   AVMAPI, 
//   AVMKeyChain, 
// } from "avalanche/dist/apis/avm"
import {
  PlatformVMAPI, 
  PlatformVMKeyChain,
  Tx, 
  UnsignedTx,
  UTXOSet
} from "avalanche/dist/apis/platformvm"
import { UnixNow } from "avalanche/dist/utils"

// consts
const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 12345
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const pchain: PlatformVMAPI = avalanche.PChain()
const bintools: BinTools = BinTools.getInstance()
const pKeychain: PlatformVMKeyChain = pchain.keyChain()
const mypk: Buffer = bintools.cb58Decode("ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN")
pKeychain.importKey(mypk)
const pAddresses: Buffer[] = pchain.keyChain().getAddresses()
const pAddressStrings: string[] = pchain.keyChain().getAddressStrings()
console.log(pAddressStrings)
const nodeID: string = "NodeID-P7oB2McjBGgW2NXXWVYjV8JEDFoW9xDE5"
const startTime: BN = UnixNow().add(new BN(60 * 5));
const endTime: BN = startTime.add(new BN(1209600));
const stakeAmount: BN = new BN(2000000000000)

// the goods
const main = async (): Promise<any> => {
  const utxoSet: UTXOSet = await pchain.getUTXOs(pAddressStrings)
  // return false
  const memoBuf: Buffer = bintools.stringToBuffer("Avalanche.js")
  const memoCB58: string = bintools.cb58Encode(memoBuf)
  const memo: Buffer = bintools.stringToBuffer(memoCB58)
  const unsignedTx: UnsignedTx = await pchain.buildAddDelegatorTx(
    utxoSet,
    pAddressStrings,
    pAddressStrings,
    nodeID,
    startTime,
    endTime,
    stakeAmount,
    pAddressStrings[0],
    memo
  )
  const tx: Tx =  unsignedTx.sign(pKeychain)
  console.log(tx.toBuffer().toString('hex'))
  const txid: string = await pchain.issueTx(tx)
  console.log(`TXID: ${txid}`)
}

main()


// 00 00 
// 00 00 00 0e 
// 00 00 30 39 
// 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 

// 00 00 00 01 
// 39 c3 3a 49 9c e4 c3 3a 3b 09 cd d2 cf a0 1a e7 0d bf 2d 18 b2 d7 d1 68 52 44 40 e5 5d 55 00 88 
// 00 00 00 07 
// 00 11 c1 a7 8e 87 1d c0 
// 00 00 00 00 00 00 00 00 
// 00 00 00 01 
// 00 00 00 01 
// 3c b7 d3 84 2e 8c ee 6a 0e bd 09 f1 fe 88 4f 68 61 e1 b2 9c 

// 00 00 00 01 
// 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 
// 00 00 00 00 
// 39 c3 3a 49 9c e4 c3 3a 3b 09 cd d2 cf a0 1a e7 0d bf 2d 18 b2 d7 d1 68 52 44 40 e5 5d 55 00 88 
// 00 00 00 05 
// 00 11 c3 79 37 e0 80 00 
// 00 00 00 01 
// 00 00 00 00 

// 00 00 00 1a 
// 00 18 31 37 67 52 6e 44 71 69 53 61 41 53 35 58 74 59 71 47 54 54 4d 67 4e 6b 

// f2 9b ce 5f 34 a7 43 01 eb 0d e7 16 d5 19 4e 4a 4a ea 5d 7a 

// 00 00 00 00 
// 5f 49 8b a2 00 00 00 00 5f 5c 00 a2 00 00 01 d1 a9 4a 20 00 00 00 01 d1 a9 4a 20 00 00 00 00 01 39 c3 3a 49 9c e4 c3 3a 3b 09 cd d2 cf a0 1a e7 0d bf 2d 18 b2 d7 d1 68 52 44 40 e5 5d 55 00 88 00 00 00 07 00 00 01 d1 a9 4a 20 00 00 00 00 00 00 00 00 00 00 00 00 01 00 00 00 01 3c b7 d3 84 2e 8c ee 6a 0e bd 09 f1 fe 88 4f 68 61 e1 b2 9c 3c b7 d3 84 2e 8c ee 6a 00 00 00 01 00 00 00 09 00 00 00 01 b1 7f 6b c7 15 a3 03 4d 26 59 ac 63 e6 eb 36 16 3e 7c 80 68 35 35 b2 5f ab e5 35 d6 a2 5d 6b d3 68 d2 2b 58 e9 6a 38 84 bd 55 4a 63 cd c3 94 1a f8 35 0c 56 fd 4b 82 2b 94 64 30 d0 70 5d 49 6b 00

