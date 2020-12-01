import { 
  Avalanche,
  BinTools,
  BN,
  Buffer
} from "avalanche"
import {
  EVMAPI, 
  EVMOutput, 
  ImportTx,
  TransferableInput,
  KeyChain,
  UTXO,
  SECPTransferInput,
  AmountOutput
} from "avalanche/dist/apis/evm"
import { privKey } from '../common/values'
import { UnsignedTx } from "avalanche/dist/apis/evm"
import { Tx } from "avalanche/dist/apis/evm"
  
const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 12345
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const cchain: EVMAPI = avalanche.CChain()
const bintools: BinTools = BinTools.getInstance()
const cKeychain: KeyChain = cchain.keyChain()
cKeychain.importKey(privKey)
const cAddresses: Buffer[] = cchain.keyChain().getAddresses()
const cAddressStrings: string[] = cchain.keyChain().getAddressStrings()
const blockchainid: string = "26sSDdFXoKeShAqVfvugUiUQKhMZtHYDLeBqmBfNfcdjziTrZA"
const sourceChain: string = "2eNy1mUFdmaxXNj1eQHUe7Np4gju9sJsEtWQ4MX3ToiNKuADed"
const importedIns: TransferableInput[] = []
const outs: EVMOutput[] = []
  
const main = async (): Promise<any> => {
  const u: any = await cchain.getUTXOs(cAddressStrings[0], "X")
  const utxos = u.utxos
  const utxo: UTXO = utxos.getAllUTXOs()[0];
  const assetID:Buffer = utxo.getAssetID(); 
  const txid:Buffer = utxo.getTxID();
  const outputidx:Buffer = utxo.getOutputIdx();
  const output:AmountOutput = utxo.getOutput() as AmountOutput;
  const amt:BN = output.getAmount().clone();
  const cETHAddress: string = "0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC"
  const input: SECPTransferInput = new SECPTransferInput(amt);
  input.addSignatureIdx(0, cAddresses[0])
  const xferin: TransferableInput = new TransferableInput(txid, outputidx, assetID, input);
  importedIns.push(xferin)
  const o: EVMOutput = new EVMOutput(cETHAddress, amt, assetID)
  outs.push(o)
  const importTx: ImportTx = new ImportTx(
    networkID,
    bintools.cb58Decode(blockchainid),
    bintools.cb58Decode(sourceChain),
    importedIns,
    outs
  )
  const unsignedTx: UnsignedTx = new UnsignedTx(importTx)
  const tx: Tx = unsignedTx.sign(cKeychain)
  const id: string = await cchain.issueTx(tx)
  console.log(id)
}

main()