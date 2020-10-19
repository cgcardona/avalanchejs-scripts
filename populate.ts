// imports
import {
  AVMAPI, 
  AVMKeyChain, 
  MinterSet, 
  Tx,
  UnsignedTx, 
  UTXOSet,
  TransferableInput,
  TransferableOutput,
  AssetAmountDestination,
  TransferableOperation,
  NFTMintOperation,
  NFTTransferOutput,
  UTXO,
  OperationTx,
  AVMConstants,
  NFTMintOutput
} from "avalanche/dist/apis/avm"
import {
  URLPayload, UnixNow, Defaults
} from "avalanche/dist/utils"
import { OutputOwners } from "avalanche/dist/common"
import { 
  Avalanche, 
  BinTools, 
  BN, 
  Buffer 
} from 'avalanche'

// consts
const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 12345
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID, 'X')
const avm: AVMAPI = avalanche.XChain()
const bintools: BinTools = BinTools.getInstance()
const myKeychain: AVMKeyChain = avm.keyChain()
const memoBuf: Buffer = bintools.stringToBuffer("Avalanche.js")
const memoCB58: string = bintools.cb58Encode(memoBuf)
const memo: Buffer = bintools.stringToBuffer(memoCB58)

// boilerplate
const sleep = (ms: number): Promise<unknown> => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  });
}

// Create NFTs from the faucet private key (local)
myKeychain.importKey("PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN")

const createNFT = async (name: string, symbol: string, minterSets: MinterSet[], creatorAddresses: string[]): Promise<string> => {
  console.log("Creating NFT Asset...")
  const utxoSet: UTXOSet = await avm.getUTXOs(creatorAddresses)
  const unsignedTx: UnsignedTx = await avm.buildCreateNFTAssetTx(
    utxoSet,
    creatorAddresses,
    minterSets,
    name,
    symbol,
    memo
  )

  const tx: Tx = unsignedTx.sign(myKeychain)
  const txid: string = await avm.issueTx(tx)
  console.log(`Create NFT Asset Success: ${txid}`)
  return txid;
}

const mintNFT = async (txid: string, addresses: Buffer[], addressStrings: string[], payload:any): Promise<string> => {
  console.log(`Creating NFT Mint Operation #1...`)
  const utxoSet = await avm.getUTXOs(addressStrings)
  const utxoids: string[] = _getUTXOID(utxoSet, txid)
  const utxos: UTXO[] = []
  utxoids.forEach((utxoid: string) => {
    const utxo: UTXO = utxoSet.getUTXO(utxoid)
    utxos.push(utxo)
  })

  const zero: BN = new BN(0)
  const fee: BN = new BN(1000000)
  const asOf: BN = UnixNow() 
  const feeAssetID: Buffer = await avm.getAVAXAssetID()
  let ins: Array<TransferableInput> = []
  let outs: Array<TransferableOutput> = []
  
  if(_feeCheck(fee, feeAssetID)) {
    const aad: AssetAmountDestination = new AssetAmountDestination(addresses, addresses, addresses)
    aad.addAssetAmount(feeAssetID, zero, fee)
    const success: Error = utxoSet.getMinimumSpendable(aad, asOf)
    if(typeof success === "undefined") {
      ins = aad.getInputs()
      outs = aad.getAllOutputs()
    } else {
      throw success;
    }
  }
  let ops: TransferableOperation[] = []

  utxos.forEach((utxo: UTXO) => {
    const mintOut: NFTMintOutput = utxo.getOutput() as NFTMintOutput
    const groupID: number = mintOut.getGroupID()
    const locktime: BN = new BN(0)
    const threshold: number = 1
    if(threshold > addresses.length) {
        /* istanbul ignore next */
        throw new Error(`Error - UTXOSet.buildCreateNFTMintTx: threshold is greater than number of addresses`);
    }
    let xferOut:NFTTransferOutput = utxo.getOutput() as NFTTransferOutput;
    let spenders:Array<Buffer> = xferOut.getSpenders(addresses, asOf);
    let nftMintOperation: NFTMintOperation = new NFTMintOperation(groupID, payload, [new OutputOwners(addresses, locktime, threshold)]);

    for(let j:number = 0; j < spenders.length; j++) {
      let idx:number;
      idx = xferOut.getAddressIdx(spenders[j]);
      if(idx == -1){
        /* istanbul ignore next */
        throw new Error(`Error - UTXOSet.buildCreateNFTMintTx: no such address in output: ${spenders[j]}`);
       }
       nftMintOperation.addSignatureIdx(idx, spenders[j]);
    }
        
    let transferableOperation:TransferableOperation = new TransferableOperation(utxo.getAssetID(), utxoids, nftMintOperation);
    ops.push(transferableOperation);
  })

  const netid = 12345;
  const blockchainid: string = Defaults.network[netid].X.blockchainID;
  const blockchainID:Buffer = bintools.cb58Decode(blockchainid);
  console.log(blockchainID)

  let operationTx:OperationTx = new OperationTx(networkID, blockchainID, outs, ins, memo, ops);
  let unsignedTx:UnsignedTx = new UnsignedTx(operationTx);
  console.log(unsignedTx)
  const tx: Tx = unsignedTx.sign(myKeychain)
  txid = await avm.issueTx(tx)
  console.log(`NFT Mint Operation Success #1: ${txid}`)
  return txid
}

const transferNFT = async (utxoId: string, toAddresses: string[]): Promise<string> => {
  const fromAddrsStr: string[] = myKeychain.getAddressStrings()
  const utxos: UTXOSet = await avm.getUTXOs(fromAddrsStr)
  const utxoids: string[] = utxos.getUTXOIDs()

  console.log(`Utxo ids: `,utxoids)
  // let sourceTxId: string = ""
  let sourceTxId: string = utxoids[1]

  // for (let index: number = 0; index < utxoids.length; ++index) {
  //   let value = utxoids[index]
  //   if (value.substring(0, 10) === utxoId.substring(0, 10)) {
  //     sourceTxId = value
  //     break
  //   }
  // }

  const unsignedTx: UnsignedTx = await avm.buildNFTTransferTx(
    utxos,
    toAddresses,
    fromAddrsStr,
    sourceTxId
  )
  const tx: Tx = unsignedTx.sign(avm.keyChain())
  const txid: string = await avm.issueTx(tx)
  return txid
}

// the goods
const main = async (): Promise<any> => {
  const addresses: Buffer[] = avm.keyChain().getAddresses()
  const addressStrings: string[] = avm.keyChain().getAddressStrings()
  const name: string = "Coincert"
  const symbol: string = "TIXX"
  const minterSet1: MinterSet = new MinterSet(1, addresses)
  const minterSet2: MinterSet = new MinterSet(1, addresses)
  const minterSets: MinterSet[] = [minterSet1, minterSet2]
  let txId = await createNFT(name, symbol, minterSets, addressStrings)
  await sleep(5000)
  // Minting the NFT
  const payload: URLPayload = new URLPayload('https://media.giphy.com/media/ZTjQgJGDiuJZS/source.gif')
  const mintTxId: string = await mintNFT(txId, addresses, addressStrings, payload)
  // await sleep(5000)
  // const nftTo: string[] = ["X-local1tfemk93pgdlc5r3xmawt20nvksjgg7k8q7cd4y"]
  // await transferNFT(mintTxId, nftTo)
  // const payload: UTF8Payload = new UTF8Payload(`Test test`)
  // const payload: URLPayload = new URLPayload('https://upload.wikimedia.org/wikipedia/commons/f/f7/Bananas.svg')
  // const payload: URLPayload = new URLPayload('https://cloudflare-ipfs.com/ipfs/QmSRti2HK95NXWYG3t3he7UK7hkgw8w9TdqPc6hi5euV1p/prism/33a.gif')
  // const payload: URLPayload = new URLPayload('https://cloudflare-ipfs.com/ipfs/QmSRti2HK95NXWYG3t3he7UK7hkgw8w9TdqPc6hi5euV1p/sketch/30a.gif')
  // const payload: URLPayload = new URLPayload('https://cloudflare-ipfs.com/ipfs/Qmbxify5MLarmoxTZTCDzSsUY6tRFwt1zbRBeW3gowUNJX/tigerscratch/11b.gif')
}

const _feeCheck = (fee:BN, feeAssetID:Buffer):boolean => {
  return (typeof fee !== "undefined" && 
  typeof feeAssetID !== "undefined" &&
  fee.gt(new BN(0)) && feeAssetID instanceof Buffer);
}

const _getUTXOID = (utxoSet: UTXOSet, txid: string): string[] => {
  const utxoids: string[] = utxoSet.getUTXOIDs()
    let result: string[] = []
    for (let index: number = 0; index < utxoids.length; ++index) {
      if (utxoids[index].indexOf(txid.slice(0,10)) != -1 && utxoSet.getUTXO(utxoids[index]).getOutput().getOutputID() == AVMConstants.NFTMINTOUTPUTID ) {
          result.push(utxoids[index])
      }
    }
    return result
}

main()