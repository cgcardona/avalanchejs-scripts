import {
  BinTools,
} from "avalanche"
import { 
  AVMConstants,
  UTXOSet
} from "avalanche/dist/apis/avm"

const bintools: BinTools = BinTools.getInstance()

const getUTXOIDs = (utxoSet: UTXOSet, txid: string, outputType: number = AVMConstants.SECPXFEROUTPUTID, assetID = "SSUAMrVdqYuvybAMGNitTYSAnE4T5fVdVDB82ped1qQ9f8DDM"): string[] => {
  const utxoids: string[] = utxoSet.getUTXOIDs()
  console.log(utxoids)
  console.log(txid)
  console.log(assetID)
  console.log(outputType)
  const result: string[] = []
  for (let index: number = 0; index < utxoids.length; ++index) {
    console.log("----")
    console.log(utxoids[index].indexOf(txid.slice(0,10)))
    console.log(utxoSet.getUTXO(utxoids[index]).getOutput().getOutputID())
    console.log(bintools.cb58Encode(utxoSet.getUTXO(utxoids[index]).getAssetID()))

    // console.log(utxoSet.getUTXO(utxoids[index]).getOutput().getOutputID())
    if (utxoids[index].indexOf(txid.slice(0,10)) != -1 && utxoSet.getUTXO(utxoids[index]).getOutput().getOutputID() == outputType && assetID == bintools.cb58Encode(utxoSet.getUTXO(utxoids[index]).getAssetID())) {
      result.push(utxoids[index])
    }
  }
  return result
}

export default getUTXOIDs