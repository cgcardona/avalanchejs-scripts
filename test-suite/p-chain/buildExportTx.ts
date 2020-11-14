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
    UTXOSet
  } from "avalanche/dist/apis/platformvm"
  import sleep from '../common/sleep'
  import { AVMU } from '../common/interfaces'
  import { privKey, toAddress, mstimeout } from '../common/values'
    
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
  const main = async (): Promise<any> => {
    const stakeAmounts = await pchain.getMinStake()
    let amount: BN = stakeAmounts.minValidatorStake.mul(new BN(2))    
    const platformvmu = await pchain.getUTXOs(pAddressStrings)
    const utxoSet: UTXOSet = platformvmu.utxos 
    const unsignedTx: UnsignedTx = await pchain.buildExportTx(
      utxoSet,
      amount,
      "2eNy1mUFdmaxXNj1eQHUe7Np4gju9sJsEtWQ4MX3ToiNKuADed",
      xAddressStrings,
      pAddressStrings,
      pAddressStrings
    )
    const tx: Tx = unsignedTx.sign(pKeychain)
    const txid: string = await pchain.issueTx(tx)
    await sleep(mstimeout)
    const status : string = await xchain.getTxStatus(txid)
    console.log(`${status}! TXID: ${txid}`)
    console.log("----------------------------")
  }
    
  main()
  