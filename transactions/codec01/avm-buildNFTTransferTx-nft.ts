import { 
  Avalanche,
  BinTools,
  BN,
  Buffer
} from "avalanche"
import {
  AVMAPI, 
  KeyChain,
  UTXOSet,
  UnsignedTx,
  Tx,
  AVMConstants,
  UTXO,
} from "avalanche/dist/apis/avm"
import { 
  iAVMUTXOResponse 
} from "avalanche/dist/apis/avm/interfaces"
import { UnixNow } from "avalanche/dist/utils"

const getUTXOIDs = (utxoSet: UTXOSet, txid: string, outputType: number = AVMConstants.SECPXFEROUTPUTID_CODECONE, assetID = "2fombhL7aGPwj3KH4bfrmJwW6PVnMobf9Y2fn9GwxiAAJyFDbe"): string[] => {
  const utxoids: string[] = utxoSet.getUTXOIDs()
  let result: string[] = []
  for (let index: number = 0; index < utxoids.length; ++index) {
    if (utxoids[index].indexOf(txid.slice(0,10)) != -1 && utxoSet.getUTXO(utxoids[index]).getOutput().getOutputID() == outputType && assetID == bintools.cb58Encode(utxoSet.getUTXO(utxoids[index]).getAssetID())) {
      result.push(utxoids[index])
    }
  }
  return result
}
    
const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 12345
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const xchain: AVMAPI = avalanche.XChain()
const bintools: BinTools = BinTools.getInstance()
const xKeychain: KeyChain = xchain.keyChain()
const privKey: string = "PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN"
xKeychain.importKey(privKey)
const xAddressStrings: string[] = xchain.keyChain().getAddressStrings()
const threshold: number = 1
const locktime: BN = new BN(0)
const memo: Buffer = bintools.stringToBuffer("AVM utility method buildNFTTransferTx to transfer an ANT")
const asOf: BN = UnixNow()
    
const main = async (): Promise<any> => {
  const avmUTXOResponse: iAVMUTXOResponse = await xchain.getUTXOs(xAddressStrings)
  const utxoSet: UTXOSet = avmUTXOResponse.utxos
  const utxos: UTXO[] = utxoSet.getAllUTXOs()
  let txid: Buffer = Buffer.from("")
  let assetID: Buffer = Buffer.from("")
  utxos.forEach((utxo: UTXO) => {
    if(utxo.getOutput().getTypeID() === 11) {
      txid = utxo.getTxID()
      assetID = utxo.getAssetID()
    }
  })
  const nftTransferOutputUTXOIDs: string[] = getUTXOIDs(utxoSet, bintools.cb58Encode(txid), AVMConstants.NFTXFEROUTPUTID, bintools.cb58Encode(assetID))
  const nftTransferOutputUTXOID: string = nftTransferOutputUTXOIDs[0]

  const unsignedTx: UnsignedTx = await xchain.buildNFTTransferTx(
    utxoSet,
    xAddressStrings,
    xAddressStrings,
    xAddressStrings,
    nftTransferOutputUTXOID,
    memo,
    asOf,
    locktime,
    threshold
  )

  // start uncomment for codecID 00 00
  const tx: Tx = unsignedTx.sign(xKeychain)
  const id: string = await xchain.issueTx(tx)
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
  