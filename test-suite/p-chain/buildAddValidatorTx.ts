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

const startTime: BN = UnixNow().add(new BN(60)); //60 seconds from now
const endTime: BN = startTime.add(new BN(60 * 60 * 24 * 14))
    
  const main = async (): Promise<any> => {
    const stakeAmounts = await pchain.getMinStake()
    let stakeAmount: BN = stakeAmounts.minValidatorStake
    const platformvmu = await pchain.getUTXOs(pAddressStrings)
    const utxoSet: UTXOSet = platformvmu.utxos 
    const assetID: Buffer = await xchain.getAVAXAssetID()
    const memoStr: string = "PlatformVM Build Import Tx"
    const memo: Buffer = bintools.stringToBuffer(memoStr)
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
  