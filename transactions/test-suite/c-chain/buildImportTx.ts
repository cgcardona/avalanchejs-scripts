import { 
    Avalanche, 
    BinTools, 
    BN,
    Buffer
  } from "avalanche"
  import {
    AVMAPI,
    KeyChain as AVMKeyChain,
    TransferableInput,
  } from "avalanche/dist/apis/avm"
  import {
    EVMAPI,
    KeyChain as EVMKeyChain,
    ImportTx,
    Tx,
  } from "avalanche/dist/apis/evm"
  import sleep from '../common/sleep'
  import { AVMU } from '../common/interfaces'
  import { privKey, toAddress, mstimeout } from '../common/values'
  console.log(privKey)
    
  const ip: string = "localhost"
  const port: number = 9650
  const protocol: string = "http"
  const networkID: number = 12345
  const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
  const cchain: EVMAPI = avalanche.CChain()
  // const bintools: BinTools = BinTools.getInstance()
  // const xKeychain: AVMKeyChain = xchain.keyChain()
  const cKeychain: EVMKeyChain = cchain.keyChain()
  cKeychain.importKey(privKey)
  const cAddressStrings: string[] = cchain.keyChain().getAddressStrings()
  // const cAddressStrings: string[] = cchain.keyChain().getAddressStrings()
  console.log(cAddressStrings)
  const amount: BN = new BN(54321)
    
  const main = async (): Promise<any> => {
    return false
    // const evmu = await cchain.getUTXOs(xAddressStrings, "26sSDdFXoKeShAqVfvugUiUQKhMZtHYDLeBqmBfNfcdjziTrZA")
    // const utxoSet = evmu.utxos 
    // console.log(utxoSet)
    // const assetID: Buffer = await xchain.getAVAXAssetID()
    // const memoStr: string = "EVM Build Import Tx"
    // const memo: Buffer = bintools.stringToBuffer(memoStr)

    // const blockchainid: string = "2eNy1mUFdmaxXNj1eQHUe7Np4gju9sJsEtWQ4MX3ToiNKuADed"
    // const sourceChain: string = "26sSDdFXoKeShAqVfvugUiUQKhMZtHYDLeBqmBfNfcdjziTrZA"
    // const importedIns: TransferableInput[] = undefined 
    // const outs: EVMOutput[] = undefined

    // const importTx: ImportTx = new ImportTx(
    //   networkID, 
    //   bintools.stringToBuffer(blockchainid),
    //   bintools.stringToBuffer(sourceChain),
    //   utxoSet,

    // )
    // const unsignedTx: UnsignedTx = await cchain.buildExportTx(
    //   utxoSet,
    //   amount,
    //   "2eNy1mUFdmaxXNj1eQHUe7Np4gju9sJsEtWQ4MX3ToiNKuADed",
    //   xAddressStrings,
    //   pAddressStrings,
    //   pAddressStrings
    // )
    // const tx: Tx = unsignedTx.sign(pKeychain)
    // const txid: string = await pchain.issueTx(tx)
    // await sleep(mstimeout)
    // const status : string = await xchain.getTxStatus(txid)
    // console.log(`${status}! TXID: ${txid}`)
    
    // console.log("----------------------------")
  }
    
  main()
  