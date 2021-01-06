import { Avalanche, BinTools, BN, Buffer } from "avalanche"
import { 
  AmountOutput,
  AVMAPI, 
  KeyChain, 
  BaseTx,
  SECPTransferInput,
  SECPTransferOutput,
  TransferableInput,
  TransferableOutput,
  Tx, 
  UnsignedTx,
  UTXO,
  UTXOSet,
} from "avalanche/dist/apis/avm"

const ip: string = "localhost"
const protocol: string = "http"
const networkID: number = 12345
const port: number = 9650
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const bintools: BinTools = BinTools.getInstance()
const xchain: AVMAPI = avalanche.XChain()
const blockchainID: Buffer = bintools.cb58Decode(xchain.getBlockchainID())
const xKeychain: KeyChain = xchain.keyChain()
const memo: Buffer = bintools.stringToBuffer("Avalanche.js")
xKeychain.importKey("PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN")
const xAddresses: Buffer[] = xchain.keyChain().getAddresses()
const xAddressStrings: string[] = xchain.keyChain().getAddressStrings()
const locktime: BN = new BN(0)
const threshold: number = 1
const ins: TransferableInput[] = []
const outs: TransferableOutput[] = []

const main = async (): Promise<any> => {
  const assetID: Buffer = await xchain.getAVAXAssetID()
  const fromAddress = xAddressStrings[0];

  // prepare outputs
  const toAmount: BN = new BN(100);
  const secpOutput: SECPTransferOutput = new SECPTransferOutput(toAmount, xAddresses, locktime, threshold)
  const transferableOutput: TransferableOutput = new TransferableOutput(assetID, secpOutput);
  outs.push(transferableOutput);

  // prepare utxos
  const avmu = await xchain.getUTXOs([xAddressStrings[0]])
  const utxoSet: UTXOSet = avmu.utxos 

  // prepare inputs
  const utxo: UTXO = utxoSet.getAllUTXOs()[0]
  const output: AmountOutput = utxo.getOutput() as AmountOutput;
  const amt: BN = output.getAmount().clone();
  const txid: Buffer = utxo.getTxID();
  const outputidx: Buffer = utxo.getOutputIdx();

  const secpInput: SECPTransferInput = new SECPTransferInput(amt);
  secpInput.addSignatureIdx(0, xAddresses[0])

  const transferableInput: TransferableInput = new TransferableInput(txid, outputidx, assetID, secpInput);

  ins.push(transferableInput);

  const baseTx: BaseTx = new BaseTx(networkID, blockchainID, outs, ins, memo);
  const unsignedTx: UnsignedTx = new UnsignedTx(baseTx);
  const tx: Tx = unsignedTx.sign(xKeychain)
  console.log(tx.toBuffer().toString('hex'))
  const id: string = await xchain.issueTx(tx)
  console.log(id)
}
  
main()
