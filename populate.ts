// imports
import {
  AVMAPI, 
  AVMKeyChain, 
  MinterSet, 
  Tx,
  UnsignedTx, 
  UTXOSet,
} from "avalanche/dist/apis/avm";
import {
  UnixNow, 
  UTF8Payload, 
  URLPayload
} from "avalanche/dist/utils";
import { OutputOwners } from "avalanche/dist/common";
import { 
  Avalanche, 
  BinTools, 
  BN, 
  Buffer 
} from 'avalanche';

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

const createNFT = async (name: string, symbol: string, addresses: Buffer[], creatorAddresses: string[]): Promise<string> => {
  console.log("Creating NFT Asset...")
  const minterSet: MinterSet = new MinterSet(1, addresses)
  const minterSets: MinterSet[] = [minterSet]
  const utxoSet: UTXOSet = await avm.getUTXOs(creatorAddresses)
  const unsignedTx: UnsignedTx = await avm.buildCreateNFTAssetTx(
    utxoSet,
    creatorAddresses,
    minterSets,
    name,
    symbol,
    memo
  )

  const tx: Tx = unsignedTx.sign(myKeychain);
  const txid: string = await avm.issueTx(tx)
  console.log(`Create NFT Asset Success: ${txid}`)
  return txid;
}

const mintNFT = async (txid: string, addresses: Buffer[], addressStrings: string[], payload:any): Promise<string> => {
  console.log(`Creating NFT Mint Operation #1...`)
  let utxoSet = await avm.getUTXOs(addressStrings);
  let utxoids = utxoSet.getUTXOIDs();
  // let result: string = utxoids[0];
  let result: string = "";

  // scan utxos and find the nft one
  for (let index: number = 0; index < utxoids.length; ++index) {
    let value = utxoids[index];
    if (value.substring(0, 10) === txid.substring(0, 10)) {
      result = value
      break
    }
  }
  console.log("--------------")
  console.log(result)

  const groupID: number = 0
  let locktime = new BN(0);
  let threshold = 1;

  let outputOwners:Array<OutputOwners> = []
  outputOwners.push(new OutputOwners(addresses, locktime, threshold))

  let unsignedTx = await avm.buildCreateNFTMintTx(
    utxoSet,
    addressStrings,
    addressStrings,
    result,
    // fee,
    groupID,
    payload.toBuffer(),
    undefined,
    // addressStrings,
    UnixNow(),
    locktime,
    threshold,
  )

  let tx = unsignedTx.sign(avm.keyChain());
  // let tx =  avm.keyChain().signTx(unsignedTx)
  // console.log(tx.toBuffer().toString('hex'))
  let mintTxid:string = await avm.issueTx(tx)
  console.log(`NFT Mint Operation Success #1: ${mintTxid}`)
  return mintTxid;
}

const transferNFT = async (utxoId: string, toAddresses: string[]): Promise<string> => {
    // let fee = new BN(0);
    // let locktime = new BN(0);
    // let threshold = 1;

    let fromAddrs = myKeychain.getAddresses();
    let fromAddrsStr = myKeychain.getAddressStrings();
    let utxos = await avm.getUTXOs(fromAddrsStr);
    let utxoids = utxos.getUTXOIDs();

    console.log(`Utxo ids: `,utxoids);
    let sourceTxId: string = "";
    // let sourceTxId: string = utxoids[1];

    for (let index: number = 0; index < utxoids.length; ++index) {
        let value = utxoids[index];
        if (value.substring(0, 10) === utxoId.substring(0, 10)) {
            sourceTxId = value
            break;
        }
    }

    console.log("Source tx: ",sourceTxId);

    let unsignedTx = await avm.buildNFTTransferTx(
        utxos,
        toAddresses,
        fromAddrsStr,
        sourceTxId,
        // fee,
        // fromAddrsStr,
        // UnixNow(),
        // locktime,
        // threshold
    )

    let tx = unsignedTx.sign(avm.keyChain());

    // let tx =  avm.keyChain().signTx(unsignedTx)
    let txid = await avm.issueTx(tx)
    console.log(`NFT Transfer Operation Success: ${txid}`)
    return txid;
}

// the goods
const main = async (): Promise<any> => {
  const addresses: Buffer[] = avm.keyChain().getAddresses()
  const addressStrings: string[] = avm.keyChain().getAddressStrings()
  const name: string = "Avalanche"
  const symbol: string = "SNOW"
  let txId = await createNFT(name, symbol, addresses, addressStrings)
  await sleep(5000)
  // Minting the NFT
  const payload: URLPayload = new URLPayload('https://i.imgur.com/m44RDjm.jpg')
  const mintTxId: string = await mintNFT(txId, addresses, addressStrings, payload)

//   setTimeout(async () =>{
    // const payload: UTF8Payload = new UTF8Payload(`Test test`)
    // const payload: URLPayload = new URLPayload('https://upload.wikimedia.org/wikipedia/commons/f/f7/Bananas.svg')
    // const payload: URLPayload = new URLPayload('https://cloudflare-ipfs.com/ipfs/QmSRti2HK95NXWYG3t3he7UK7hkgw8w9TdqPc6hi5euV1p/prism/33a.gif')
    // const payload: URLPayload = new URLPayload('https://cloudflare-ipfs.com/ipfs/QmSRti2HK95NXWYG3t3he7UK7hkgw8w9TdqPc6hi5euV1p/sketch/30a.gif')
    // const payload: URLPayload = new URLPayload('https://cloudflare-ipfs.com/ipfs/Qmbxify5MLarmoxTZTCDzSsUY6tRFwt1zbRBeW3gowUNJX/tigerscratch/11b.gif')

    // setTimeout(async () => {
    //   let nftTo = ["X-local1tfemk93pgdlc5r3xmawt20nvksjgg7k8q7cd4y"]
    //     await transferNFT( mintTxId, nftTo)
    // }, 5000)
//   }, 5000)
}

main()