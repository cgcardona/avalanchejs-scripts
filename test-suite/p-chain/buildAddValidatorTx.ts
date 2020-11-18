import { 
  Avalanche, 
  BinTools, 
  BN,
  Buffer
} from "avalanche"
import {
  AVMAPI,
  KeyChain as AVMKeyChain,
} from "avalanche/dist/apis/avm"
import {
  PlatformVMAPI,
  KeyChain as PlatformKeyChain,
  Tx,
  UnsignedTx,
  UTXOSet,
  PlatformVMConstants
} from "avalanche/dist/apis/platformvm"
import sleep from '../common/sleep'
import { AVMU } from '../common/interfaces'
import { privKey, toAddress, mstimeout } from '../common/values'
import { UnixNow } from "avalanche/dist/utils"
    
const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 12345
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const xchain: AVMAPI = avalanche.XChain()
const pchain: PlatformVMAPI = avalanche.PChain()
const bintools: BinTools = BinTools.getInstance()
const xKeychain: AVMKeyChain = xchain.keyChain()
const pKeychain: PlatformKeyChain = pchain.keyChain()
xKeychain.importKey(privKey)
pKeychain.importKey(privKey)
const xAddressStrings: string[] = xchain.keyChain().getAddressStrings()
const pAddressStrings: string[] = pchain.keyChain().getAddressStrings()
const amount: BN = new BN(54321)
const memo: Buffer = bintools.stringToBuffer("Avalanche.js")
const nodeIDs: string[] = [
  "NodeID-MGrikMRTmooL1j7uawPHjaMS1cXkbewdb", 
  "NodeID-D3onstuMsGRctDjbksXU6BV3rrCbWHkB9",
  "NodeID-JRNiPWVdV7Vq7MzBmAQB4jekNTfvRAedj",
  "NodeID-36giFye5epwBTpGqPk7b4CCYe3hfyoFr1",
  "NodeID-DueWyGi3B9jtKfa9mPoecd4YSDJ1ftF69",
  "NodeID-Lai2VTTYk897ae9uq6cGk9FbhKD1KHvFS"
]
const nodeID: string = nodeIDs[3]

const startTime: BN = UnixNow().add(new BN(60)) //60 seconds from now
const endTime: BN = startTime.add(new BN(60 * 2))
    
const main = async (): Promise<any> => {
  const stakeAmounts = await pchain.getMinStake()
  let stakeAmount: BN = stakeAmounts.minValidatorStake
  const platformvmu = await pchain.getUTXOs(pAddressStrings)
  const utxoSet: UTXOSet = platformvmu.utxos 
  const delegationFeeRate: number = new BN(2).toNumber()
  const unsignedTx: UnsignedTx = await pchain.buildAddValidatorTx(
    utxoSet,
    pAddressStrings,
    pAddressStrings,
    pAddressStrings,
    nodeID,
    startTime,
    endTime,
    stakeAmount,
    pAddressStrings,
    delegationFeeRate,
  )
  const tx: Tx = unsignedTx.sign(pKeychain)
  const txid: string = await pchain.issueTx(tx)
  await sleep(mstimeout)
  const status: any = await pchain.getTxStatus(txid)
  console.log(`${status}! TXID: ${txid}`)
  console.log("----------------------------")
}
    
main()
  
// 00 00 
// f6 36 43 0d a1 84 a2 a6 ed af e9 85 90 52 7b be d5 46 76 cf 0e a9 a6 ab a9 49 2e 6d ee 17 0a 96 
// 00 00 00 00 
// db cf 89 0f 77 f4 9b 96 85 76 48 b7 2b 77 f9 f8 29 37 f2 8a 68 70 4a f0 5d a0 dc 12 ba 53 f2 db 
// 00 00 00 16 
// 00 00 00 00 61 62 2d 00 
// 00 00 00 07 
// 00 23 81 7d 73 e2 a0 00 
// 00 00 00 00 00 00 00 00 
// 00 00 00 01 
// 00 00 00 01 
// 3c b7 d3 84 2e 8c ee 6a 0e bd 09 f1 fe 88 4f 68 61 e1 b2 9c

