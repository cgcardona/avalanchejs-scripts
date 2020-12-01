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
//   const bintools: BinTools = BinTools.getInstance()
//   const xKeychain: AVMKeyChain = xchain.keyChain()
//   const pKeychain: PlatformKeyChain = pchain.keyChain()
//   xKeychain.importKey(privKey)
//   const xAddressStrings: string[] = xchain.keyChain().getAddressStrings()
//   const pAddressStrings: string[] = pchain.keyChain().getAddressStrings()
//   const amount: BN = new BN(54321)
    
  const main = async (): Promise<any> => {
    // const platformvmu = await pchain.getUTXOs(pAddressStrings)
    // const utxoSet: UTXOSet = platformvmu.utxos 
    // const assetID: Buffer = await xchain.getAVAXAssetID()
    // const memoStr: string = "PlatformVM Build Import Tx"
    // const memo: Buffer = bintools.stringToBuffer(memoStr)
    // const unsignedTx: UnsignedTx = await pchain.buildImportTx(
    //   utxoSet,
    //   amount,
    //   assetID,
    //   [toAddress],
    //   addressStrings,
    //   addressStrings,
    //   memo
    // )
    const tx: Tx = new Tx()
    tx.fromString("111114byEf8hutzHXAatjdrRVm4ptpMxie86U59j8APVmSH3ihy4gR4NFfSAde51useMvSu9LYiSH2xrG7URYW99Kh3DSiYtZab78PdTLFeEBxMDiLt6rqMzb8vbDfY5zBQEF7DfTF2Uf1HeezwY6LRvXYd17d9NrFismZen4Gdf8JyrYFw64weAGxcD2G7P2aHR9taDJkNUgun2MDiRdzhJ4tH4H8KAxmK22SyPWSJQoRawLFZ4eNasUyGK6odwYaGnTAqpMak9wv1WEb6gBKMATQQJcr2XpT5csRijfV5wLL865pDshrby5BwCQdr2ipjQepv31U8FVEL5HB1i3jEeWVuNAgFaz7ULiY9r9PH3BA65mKV2C7KtKoZCgfGmkYMoJWwHPTLpRefXSg1YJVfbWKGtGjqH1R4HNEpaoKbaz9hxz3iFSjq2nUszoqaTZyAHgDhwonuA7ATg9reeQwGzEehnX4JispTfrWY9wpZdTX3ArnSDkDTJpqaGPbac94gVw9h6svbHsFCkZZJupTUbZUz4Mgo")
    // console.log(tx)
    let serialized: any = tx.serialize("display")
    console.log(JSON.stringify(serialized))
    // const txid: string = await xchain.issueTx(tx)
    // await sleep(mstimeout)
    // const status : string = await xchain.getTxStatus(txid)
    // console.log(`${status}! TXID: ${txid}`)
    // console.log("----------------------------")
  }
    
  main()
  