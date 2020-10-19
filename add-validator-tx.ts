import { Avalanche, BinTools, BN, Buffer } from "avalanche"
import { UnixNow } from 'avalanche/dist/utils';
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
  UTXOSet as PlatformVMUTXOSet,
  UnsignedTx as PlatformVMUnsignedTx,
} from "avalanche/dist/apis/platformvm";

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
const privKey: string = "PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN"
xKeychain.importKey(privKey)
pKeychain.importKey(privKey)
const xAddressStrings: string[] = avm.keyChain().getAddressStrings()
console.log(xAddressStrings)
const pAddressStrings: string[] = platformvm.keyChain().getAddressStrings()
console.log(pAddressStrings)
const amount: BN = new BN(100000000000000)
const info: InfoAPI = avalanche.Info()

const main = async (): Promise<any> => {
  let memoStr: string = "Step 1: Export AVAX from X-Chain"
  console.log(memoStr)
  const avmu: AVMU = await avm.getUTXOs([xAddressStrings[0]])
  const avmUTXOSet: AVMUTXOSet = avmu.utxos 
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
  console.log(`Success! TXID: ${txid}`)
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
  console.log(`Success! TXID: ${txid}`)
  console.log("----------------------------")

  memoStr = "Step 3: Add Validator"
  console.log(memoStr)
  const nodeID: string = "NodeID-MYUmR31tU1HBo9sXaqi7ezDEyY9a7AMCg";
  const startTime: BN = UnixNow().add(new BN(60))
  const endTime: BN = startTime.add(new BN(60 * 60 * 24 * 14))
  platformvmu = await platformvm.getUTXOs([pAddressStrings[0]])
  platformVMUTXOSet = platformvmu.utxos 
  const stakeAmounts = await platformvm.getMinStake()
  const stakeAmount: BN = stakeAmounts.minValidatorStake
  const delegationFeeRate: number = 0.01
  const rewardLockTime: BN = new BN(0)
  const rewardThreshold: number = 1
  platformVMUnsignedTx = await platformvm.buildAddValidatorTx(
    platformVMUTXOSet,
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
  platformVMTx = platformVMUnsignedTx.sign(platformvm.keyChain())
  txid = await platformvm.issueTx(platformVMTx)
  console.log(`Success! TXID: ${txid}`)
  console.log("----------------------------")
}
  
main()
