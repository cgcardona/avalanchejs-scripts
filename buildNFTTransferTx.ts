// imports
import {
  Avalanche,
  BinTools,
  BN
} from "avalanche" 
import {
  AVMAPI,
  AVMConstants,
  AVMKeyChain,
  InitialStates,
  SecpOutput,
  Tx,
  UnsignedTx,
  UTXOSet
} from "avalanche/dist/apis/avm"
import { Buffer } from 'buffer/'; 

// boilerplate
const getUTXOID = (utxoids: string[], txid: string): string => {
  let utxoid : string = ""
  let result: string = ""
  for (let index: number = 0; index < utxoids.length; ++index) {
      utxoid = utxoids[index]
      if (utxoid.substring(0, 10) === txid.substring(0, 10)) {
          result = utxoid
          break
      }
  }
  return result
}

// consts
const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 12345
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const xchain: AVMAPI = avalanche.XChain()
const bintools: BinTools = BinTools.getInstance()
const myKeychain: AVMKeyChain = xchain.keyChain()
const mypk: Buffer = bintools.cb58Decode("ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN")
myKeychain.importKey(mypk)
const addresses: Buffer[] = xchain.keyChain().getAddresses()
const addressStrings: string[] = xchain.keyChain().getAddressStrings()
const amount: BN = new BN(54321)
const locktime: BN = new BN(0)
const threshold: number = 1
const fee: BN = new BN(10)
xchain.setFee(fee)

const secpOutput1 = new SecpOutput(amount, addresses, locktime, threshold);
const initialState = new InitialStates();
initialState.addOutput(secpOutput1, AVMConstants.SECPFXID);

// the goods
const main = async (): Promise<any> => {
  const utxoSet: UTXOSet = await xchain.getUTXOs(addresses)
  const memoBuf: Buffer = bintools.stringToBuffer("Avalanche.js")
  const memoCB58: string = bintools.cb58Encode(memoBuf)
  let txid: string = "2DggrY1TJ3Qi6tejcPMybWdsbKA4pXGQ4darnQrKMKpCCbisq8"
  const utxoids: string[] = utxoSet.getUTXOIDs()
  const utxoid: string = getUTXOID(utxoids, txid)
  const memo: Buffer = bintools.stringToBuffer(memoCB58)
  const unsignedTx: UnsignedTx = await xchain.buildNFTTransferTx(
    utxoSet,
    addressStrings,
    addressStrings,
    utxoid,
    memo
  )
  const tx: Tx =  unsignedTx.sign(myKeychain)  
  txid = await xchain.issueTx(tx)
  console.log(txid)
}

main()
