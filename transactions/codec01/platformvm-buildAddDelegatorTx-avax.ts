import { 
  Avalanche,
  BinTools,
  BN,
  Buffer,
} from "avalanche"
import {
  PlatformVMAPI,
  KeyChain,
  UTXOSet,
  UnsignedTx,
  Tx
} from "avalanche/dist/apis/platformvm"
import { UnixNow } from "avalanche/dist/utils"
import { iGetMinStakeResponse, iPlatformVMUTXOResponse } from "avalanche/dist/apis/platformvm/interfaces"
    
const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 12345
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const pchain: PlatformVMAPI = avalanche.PChain()
const bintools: BinTools = BinTools.getInstance()
const pKeychain: KeyChain = pchain.keyChain()
const privKey: string = "PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN"
pKeychain.importKey(privKey)
const pAddressStrings: string[] = pchain.keyChain().getAddressStrings()
const threshold: number = 1
const locktime: BN = new BN(0)
const memo: Buffer = bintools.stringToBuffer("PlatformVM utility method buildAddDelegatorTx to add a delegator to the primary subnet")
const asOf: BN = UnixNow()
const nodeID: string = "NodeID-DueWyGi3B9jtKfa9mPoecd4YSDJ1ftF69"
const startTime: BN = UnixNow().add(new BN(60 * 1))
const endTime: BN = new BN(1612098701)
 
const main = async (): Promise<any> => {
  const stakeAmount: iGetMinStakeResponse = await pchain.getMinStake()
  const platformVMUTXOResponse: iPlatformVMUTXOResponse = await pchain.getUTXOs(pAddressStrings)
  const utxoSet: UTXOSet = platformVMUTXOResponse.utxos

  const unsignedTx: UnsignedTx = await pchain.buildAddDelegatorTx(
    utxoSet,
    pAddressStrings,
    pAddressStrings,
    pAddressStrings,
    nodeID,
    startTime,
    endTime,
    stakeAmount.minDelegatorStake,
    pAddressStrings,
    locktime,
    threshold,
    memo,
    asOf
  )

  // start uncomment for codecID 00 00
  const tx: Tx = unsignedTx.sign(pKeychain)
  const id: string = await pchain.issueTx(tx)
  // stop uncomment for codecID 00 00

  // start uncomment for codecID 00 01
  // const codecID: number = 1
  // const tx: Tx = unsignedTx.sign(xKeychain, codecID)
  // const cb58EncodedTx: string = bintools.cb58Encode(tx.toBuffer(codecID))
  // const id: string = await xchain.issueTx(cb58EncodedTx)
  // stop uncomment for codecID 00 01

  console.log(id)
}
  
main()
  