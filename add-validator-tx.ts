import { Avalanche, BinTools, BN, Buffer } from "avalanche"
import { UnixNow } from 'avalanche/dist/utils'
import { InfoAPI } from "avalanche/dist/apis/info"
import { 
  AVMAPI, 
  KeyChain as AVMKeyChain,
  Tx as AVMTx,
  UTXOSet as AVMUTXOSet,
  UnsignedTx as AVMUnsignedTx,
} from "avalanche/dist/apis/avm"

import {
  PlatformVMAPI, 
  KeyChain as PlatformVMKeyChain,
  Tx as PlatformVMTx,
  UTXO as PlatformUTXO,
  UTXOSet as PlatformVMUTXOSet,
  UnsignedTx as PlatformVMUnsignedTx,
  AmountOutput
} from "avalanche/dist/apis/platformvm"
import { Output } from "avalanche/dist/common"

const sleep = (ms: number): Promise<unknown> => {
  return new Promise( resolve => setTimeout(resolve, ms) )
}

interface AVMU {
  numFetched: number
  utxos: AVMUTXOSet
  endIndex: {
    address: string
    utxo: string
  }
}

interface PlatformVMU {
  numFetched: number
  utxos: PlatformVMUTXOSet 
  endIndex: {
    address: string
    utxo: string
  }
}

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
const privKey: string = "PrivateKey-"
xKeychain.importKey(privKey)
pKeychain.importKey(privKey)
const xAddressStrings: string[] = avm.keyChain().getAddressStrings()
// console.log(xAddressStrings)
const pAddressStrings: string[] = platformvm.keyChain().getAddressStrings()
// console.log(pAddressStrings)
let amount: BN = new BN(100000000000000)
const info: InfoAPI = avalanche.Info()
const mstimeout: number = 5000

const main = async (): Promise<any> => {
  let memoStr: string = "Step 1: Export AVAX from X-Chain"
  console.log(memoStr)
  const avmu: AVMU = await avm.getUTXOs([xAddressStrings[0]])
  const avmUTXOSet: AVMUTXOSet = avmu.utxos 
  // const amtfee: BN = amount.add(amount).mul(amount)
  const amtfee: BN = amount.add(avm.getTxFee());
  let memo: Buffer = bintools.stringToBuffer(memoStr)
  const avmUnsignedTx: AVMUnsignedTx = await avm.buildExportTx(
    avmUTXOSet,
    amtfee,
    platformvm.getBlockchainID(),
    [pAddressStrings[0]],
    [xAddressStrings[0]],
    [xAddressStrings[0]],
    memo
  )
  const avmTx: AVMTx = avmUnsignedTx.sign(avm.keyChain())
  let txid: string = await avm.issueTx(avmTx)
  await sleep(mstimeout)
  const AVMstatus: string = await avm.getTxStatus(txid)
  console.log(`${AVMstatus}! TXID: ${txid}`)
  console.log("----------------------------")

  memoStr = "Step 2: Import AVAX to the P-Chain"
  console.log(memoStr)
  let platformvmu: PlatformVMU = await platformvm.getUTXOs([pAddressStrings[0]])
  let platformVMUTXOSet: PlatformVMUTXOSet = platformvmu.utxos 
  const avmChainID: string = await info.getBlockchainID("X")
  memo = bintools.stringToBuffer(memoStr)
  let platformVMUnsignedTx: PlatformVMUnsignedTx = await platformvm.buildImportTx(
    platformVMUTXOSet,
    pAddressStrings,
    avmChainID,
    pAddressStrings,
    pAddressStrings,
    pAddressStrings,
    memo
  )
  let platformVMTx: PlatformVMTx = platformVMUnsignedTx.sign(platformvm.keyChain())
  txid = await platformvm.issueTx(platformVMTx)
  await sleep(mstimeout)
  let status: any = await platformvm.getTxStatus(txid, false)
  console.log(`${status}! TXID: ${txid}`)
  console.log("----------------------------")

  memoStr = "Step 3: Add Validator"
  console.log(memoStr)
  const nodeIDs: string[] = [
    "NodeID-MGrikMRTmooL1j7uawPHjaMS1cXkbewdb", 
    "NodeID-D3onstuMsGRctDjbksXU6BV3rrCbWHkB9",
    "NodeID-JRNiPWVdV7Vq7MzBmAQB4jekNTfvRAedj",
    "NodeID-36giFye5epwBTpGqPk7b4CCYe3hfyoFr1",
    "NodeID-DueWyGi3B9jtKfa9mPoecd4YSDJ1ftF69",
    "NodeID-Lai2VTTYk897ae9uq6cGk9FbhKD1KHvFS"
  ]
  const nodeID: string = nodeIDs[3]
  let startTime: BN = UnixNow().add(new BN(60))
  // let endTime: BN = startTime.add(new BN(60 * 60 * 24 * 14))
  let endTime: BN = startTime.add(new BN(60))
  const stakeAmounts = await platformvm.getMinStake()
  let stakeAmount: BN = stakeAmounts.minValidatorStake
  console.log(stakeAmount.toString())
  const delegationFeeRate: number = new BN(2).toNumber()
  memo = bintools.stringToBuffer(memoStr)
  const rewardLockTime: BN = new BN(0)
  const rewardThreshold: number = 1

  platformvmu = await platformvm.getUTXOs([pAddressStrings[0]])
  platformVMUTXOSet = platformvmu.utxos 
  let utxos: PlatformUTXO[] = platformVMUTXOSet.getAllUTXOs()
  let dummySet: PlatformVMUTXOSet = new PlatformVMUTXOSet()

  utxos.forEach(utxo => {
    console.log("====")
    const output: Output = utxo.getOutput()
    const o: AmountOutput = utxo.getOutput() as AmountOutput
    const outputID: number = output.getOutputID()
    const a: BN = o.getAmount()
    console.log(`OutputID: ${outputID} Amount: ${a.toString()}`)
    if(outputID === 7 && dummySet.getAllUTXOs().length === 0 && a.toString() <= stakeAmount.toString()) {
      dummySet.add(utxo)
      
    }
  })

  utxos.forEach(utxo => {
    const output: Output = utxo.getOutput()
    const o: AmountOutput = utxo.getOutput() as AmountOutput
    const outputID: number = output.getOutputID()
    if(outputID === 22 && dummySet.getAllUTXOs().length === 1) {
      dummySet.add(utxo)
    }
  })
  // console.log(dummySet.getAllUTXOStrings())

  platformVMUnsignedTx = await platformvm.buildAddValidatorTx(
    dummySet,
    pAddressStrings,
    pAddressStrings,
    pAddressStrings,
    nodeID,
    startTime,
    endTime,
    stakeAmount,
    pAddressStrings,
    delegationFeeRate,
    rewardLockTime,
    rewardThreshold,
    memo
  )
  // let serialized: any = platformVMUnsignedTx.serialize("display")
  // console.log(JSON.stringify(serialized))
  platformVMTx = platformVMUnsignedTx.sign(platformvm.keyChain())
  // console.log("++++++++++++++")
  // console.log(platformVMTx.toBuffer().toString('hex'))
  txid = await platformvm.issueTx(platformVMTx)
  await sleep(mstimeout)
  status = await platformvm.getTxStatus(txid)
  // console.log(status)
  console.log(`${status.status}! TXID: ${txid}`)
  console.log("----------------------------")
}
  
main()
