import { 
  Avalanche, 
  BinTools, 
  BN,
  Buffer
} from "avalanche"
import {
  AVMAPI,
  KeyChain,
  Tx,
  UnsignedTx,
  UTXOSet
} from "avalanche/dist/apis/avm"
import sleep from '../common/sleep'
import { AVMU } from '../common/interfaces'
import { privKey, toAddress, mstimeout } from '../common/values'
  
const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 12345
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const xchain: AVMAPI = avalanche.XChain()
const bintools: BinTools = BinTools.getInstance()
const xKeychain: KeyChain = xchain.keyChain()
xKeychain.importKey(privKey)
const addressStrings: string[] = xchain.keyChain().getAddressStrings()
const amount: BN = new BN(54321)
  
const main = async (): Promise<any> => {
  const avmu: AVMU = await xchain.getUTXOs(addressStrings)
  const utxoSet: UTXOSet = avmu.utxos 
  const assetID: Buffer = await xchain.getAVAXAssetID()
  const memoStr: string = "AVM Build Base Tx - AVAX"
  const memo: Buffer = bintools.stringToBuffer(memoStr)
  const unsignedTx: UnsignedTx = await xchain.buildBaseTx(
    utxoSet,
    amount,
    assetID,
    [toAddress],
    addressStrings,
    addressStrings
  )
  let serialized: any = unsignedTx.serialize("display")
  console.log(JSON.stringify(serialized))
  console.log(serialized)
  const tx: Tx = unsignedTx.sign(xKeychain)
  console.log(tx.toBuffer().toString('hex'))
  const txid: string = await xchain.issueTx(tx)
  await sleep(mstimeout)
  const status : string = await xchain.getTxStatus(txid)
  console.log(`${status}! TXID: ${txid}`)
  console.log("----------------------------")
}
  
main()

// 00 00 
// 00 00 00 00 
// 00 00 30 39 
// d8 91 ad 56 05 6d 9c 01 f1 8f 43 f5 8b 5c 78 4a d0 7a 4a 49 cf 3d 1f 11 62 38 04 b5 cb a2 c6 bf 

// 00 00 00 02 
// db cf 89 0f 77 f4 9b 96 85 76 48 b7 2b 77 f9 f8 29 37 f2 8a 68 70 4a f0 5d a0 dc 12 ba 53 f2 db 
// 00 00 00 07 
// 00 00 00 00 00 00 d4 31 
// 00 00 00 00 00 00 00 00 
// 00 00 00 01 
// 00 00 00 01 
// e1 5e 2d b7 55 04 63 65 d1 f9 c7 fd 59 af 5b e7 50 fd 66 29 

// db cf 89 0f 77 f4 9b 96 85 76 48 b7 2b 77 f9 f8 29 37 f2 8a 68 70 4a f0 5d a0 dc 12 ba 53 f2 db 
// 00 00 00 07 
// 04 29 d0 69 18 8d e9 8f 
// 00 00 00 00 00 00 00 00 
// 00 00 00 01 
// 00 00 00 01 
// 3c b7 d3 84 2e 8c ee 6a 0e bd 09 f1 fe 88 4f 68 61 e1 b2 9c 

// 00 00 00 01 
// db cf 89 0f 77 f4 9b 96 85 76 48 b7 2b 77 f9 f8 29 37 f2 8a 68 70 4a f0 5d a0 dc 12 ba 53 f2 db 
// 00 00 00 01 
// db cf 89 0f 77 f4 9b 96 85 76 48 b7 2b 77 f9 f8 29 37 f2 8a 68 70 4a f0 5d a0 dc 12 ba 53 f2 db 
// 00 00 00 05 
// 04 29 d0 69 18 9e 00 00 
// 00 00 00 01 
// 00 00 00 00 

// 00 00 00 04 
// 00 00 00 00 

// 00 00 00 01 
// 00 00 00 09 
// 00 00 00 01 
// 99 e2 96 25 df 35 8f a9 f8 85 1d 01 8e 8a 28 59 26 3d 76 31 4d a1 68 cb 04 80 f0 67 75 e5 86 30 0c 14 c1 95 85 b7 ca 7a e6 d0 c6 43 dd ea 5f 2d 3d 72 ae 98 37 fd d4 d2 20 5f 83 11 43 39 f6 2a 01



// 00 00 
// 00 00 00 00 
// 00 00 30 39
// d8 91 ad 56 05 6d 9c 01 f1 8f 43 f5 8b 5c 78 4a d0 7a 4a 49 cf 3d 1f 11 62 38 04 b5 cb a2 c6 bf 

// 00 00 00 02 
// db cf 89 0f 77 f4 9b 96 85 76 48 b7 2b 77 f9 f8 29 37 f2 8a 68 70 4a f0 5d a0 dc 12 ba 53 f2 db 
// 00 00 00 07 
// 00 00 00 00 00 00 d4 31 
// 00 00 00 00 00 00 00 00 
// 00 00 00 01 
// 00 00 00 01 
// e1 5e 2d b7 55 04 63 65 d1 f9 c7 fd 59 af 5b e7 50 fd 66 29 

// db cf 89 0f 77 f4 9b 96 85 76 48 b7 2b 77 f9 f8 29 37 f2 8a 68 70 4a f0 5d a0 dc 12 ba 53 f2 db 
// 00 00 00 07 
// 04 29 d0 69 18 6d bc ad 
// 00 00 00 00 00 00 00 00 
// 00 00 00 01 
// 00 00 00 01 
// 3c b7 d3 84 2e 8c ee 6a 0e bd 09 f1 fe 88 4f 68 61 e1 b2 9c 

// 00 00 00 01 
// d4 00 10 be a2 e5 3e 31 fb 81 9c 8d 93 d9 e7 dc a6 40 79 4f b5 f7 59 d4 d0 a6 e6 16 d7 0f a0 4c 
// 00 00 00 01 
// db cf 89 0f 77 f4 9b 96 85 76 48 b7 2b 77 f9 f8 29 37 f2 8a 68 70 4a f0 5d a0 dc 12 ba 53 f2 db 
// 00 00 00 05 
// 04 29 d0 69 18 7d d3 1e 
// 00 00 00 01 
// 00 00 00 00 

// 00 00 00 04 
// 00 00 00 00 
// 00 00 00 01 00 00 00 09 00 00 00 01 53 53 cd 03 1d 1b a6 95 54 84 98 44 1b 21 69 74 82 9b d5 98 67 ea 8a ef 39 a3 97 e7 30 ad 5f b7 78 a1 4f 70 59 26 9b 38 3b d8 15 da 5a 9d 73 59 99 28 58 50 85 0a 64 5b 52 b7 fd cf 2f c1 b6 1d 00

