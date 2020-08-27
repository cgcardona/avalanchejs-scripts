// import Avalanche from "avalanche/dist";
// import BinTools from "avalanche/dist/utils/bintools";
import {AVMAPI, AVMKeyChain, MinterSet, UTXOSet, UnsignedTx, Tx} from "avalanche/dist/apis/avm";
import {UnixNow, UTF8Payload, URLPayload} from "avalanche/dist/utils";
import {OutputOwners} from "avalanche/dist/common";

import { Avalanche, BinTools, BN, Buffer } from 'avalanche';

// import { Buffer } from 'buffer/';
// import BN from "bn.js";

const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 12345
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID, 'X')
// const avalanche: Avalanche = new Avalanche('testapi.avax.network', 443, 'https', 4, 'X')
const avm: AVMAPI = avalanche.XChain()
const platform = avalanche.PChain();
const info = avalanche.Info();
const bintools: BinTools = BinTools.getInstance()
const myKeychain: AVMKeyChain = avm.keyChain()

let fee = new BN('1000000');
avm.setFee(fee)


// Create NFTs from the faucet private key (local)
myKeychain.importKey("PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN")

async function createNFT(name: string, symbol: string, addresses: Buffer[], creatorAddresses: string[]): Promise<string>{
    console.log("Creating NFT Asset...")
    const minterSet: MinterSet = new MinterSet(1, addresses)
    const minterSets: MinterSet[] = [minterSet]

    let utxoSet: UTXOSet = await avm.getUTXOs(addresses)
    let assetIds = utxoSet.getAssetIDs();
    // let utxoids: string[] = utxoSet.getUTXOIDs()
    // let locktime = new BN(0);
    // const fee: BN = new BN(0);


    console.log(utxoSet.getBalance(addresses, assetIds[0]).toString());

    let unsignedTx: UnsignedTx = await avm.buildCreateNFTAssetTx(
        utxoSet,
        creatorAddresses,
        minterSets,
        name,
        symbol,
    )


    let tx: Tx = unsignedTx.sign(myKeychain);
    // let tx: Tx =  avm.keyChain().signTx(unsignedTx)
    // console.log(tx)
    let txid: string = await avm.issueTx(tx)
    console.log(`Create NFT Asset Success: ${txid}`)
    return txid;
}


async function mintNFT(txid: string, addresses: Buffer[], addressStrings: string[], payload:any): Promise<string>{
    console.log(`Creating NFT Mint Operation #1...`)
    let utxoSet = await avm.getUTXOs(addresses);
    let utxoids = utxoSet.getUTXOIDs();
    console.log(utxoids)
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


async function transferNFT(utxoId: string, toAddresses: string[]): Promise<string>{
    // let fee = new BN(0);
    // let locktime = new BN(0);
    // let threshold = 1;

    let fromAddrs = myKeychain.getAddresses();
    let fromAddrsStr = myKeychain.getAddressStrings();
    let utxos = await avm.getUTXOs(fromAddrs);
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
    // Using faucet addresses
    const addresses: Buffer[] = avm.keyChain().getAddresses()
    const addressStrings: string[] = avm.keyChain().getAddressStrings()

    const name: string = "Brace Yourself";
    const symbol: string = "MEME";
    let txId = await createNFT(name, symbol, addresses, addressStrings);

    setTimeout(async () =>{
        // Minting the NFT
        // const payload: UTF8Payload = new UTF8Payload(`Test test`)
        // const payload: URLPayload = new URLPayload('https://upload.wikimedia.org/wikipedia/commons/f/f7/Bananas.svg')
        // const payload: URLPayload = new URLPayload('https://cloudflare-ipfs.com/ipfs/QmSRti2HK95NXWYG3t3he7UK7hkgw8w9TdqPc6hi5euV1p/prism/33a.gif')
        // const payload: URLPayload = new URLPayload('https://cloudflare-ipfs.com/ipfs/QmSRti2HK95NXWYG3t3he7UK7hkgw8w9TdqPc6hi5euV1p/sketch/30a.gif')
        const payload: URLPayload = new URLPayload('https://i.imgur.com/m44RDjm.jpg')
        // const payload: URLPayload = new URLPayload('https://cloudflare-ipfs.com/ipfs/Qmbxify5MLarmoxTZTCDzSsUY6tRFwt1zbRBeW3gowUNJX/tigerscratch/11b.gif')
        let mintTxId = await mintNFT(txId, addresses, addressStrings, payload)

        setTimeout(async () => {
            let nftTo = ["X-local1tfemk93pgdlc5r3xmawt20nvksjgg7k8q7cd4y"];
            await transferNFT( mintTxId, nftTo)
        }, 5000);

    }, 5000);
}

main()

// step 1 utxo

// * codec_id: 00 00 
// * tx_id: 15 c8 a3 71 6e 4c 29 a6 58 91 80 3e 39 cd 9c d6 c2 fa 73 dc f9 c2 85 28 75 45 9a 15 74 7d 16 73 
// * output_index: 00 00 00 01 
// * asset_id: 15 c8 a3 71 6e 4c 29 a6 58 91 80 3e 39 cd 9c d6 c2 fa 73 dc f9 c2 85 28 75 45 9a 15 74 7d 16 73 
// * output
// * output_id: 00 00 00 0a 
// * group_id: 00 00 00 00 
// * locktime: 00 00 00 00 00 00 00 00 
// * threshold: 00 00 00 01 
// * addresses[]
// * num_addresses: 00 00 00 01 
// * addresses[0]: 3c b7 d3 84 2e 8c ee 6a 0e bd 09 f1 fe 88 4f 68 61 e1 b2 9c


// * codec_id: 00 00 
// * tx_id: 15 c8 a3 71 6e 4c 29 a6 58 91 80 3e 39 cd 9c d6 c2 fa 73 dc f9 c2 85 28 75 45 9a 15 74 7d 16 73 
// * output_index: 00 00 00 00 
// * asset_id: 39 c3 3a 49 9c e4 c3 3a 3b 09 cd d2 cf a0 1a e7 0d bf 2d 18 b2 d7 d1 68 52 44 40 e5 5d 55 00 88 
// * output_id: 00 00 00 07 
// * amount: 00 11 c3 79 37 d1 3d c0 
// * locktime: 00 00 00 00 00 00 00 00 
// * threshold: 00 00 00 01 
// * addresses[]
// * num_addresses: 00 00 00 01 
// * addresses[0]: 3c b7 d3 84 2e 8c ee 6a 0e bd 09 f1 fe 88 4f 68 61 e1 b2 9c


// step 2 utxo

// 00 00 
// c5 03 84 eb 74 68 6e 16 af f7 48 7a 27 ba 0a a8 e1 f3 1f 84 be 31 57 98 27 a2 c4 87 61 2b 0a 00 
// 00 00 00 00 
// 39 c3 3a 49 9c e4 c3 3a 3b 09 cd d2 cf a0 1a e7 0d bf 2d 18 b2 d7 d1 68 52 44 40 e5 5d 55 00 88 
// 00 00 00 07 
// 00 11 c3 79 37 c1 fb 80 
// 00 00 00 00 00 00 00 00 
// 00 00 00 01 
// 00 00 00 01 
// 3c b7 d3 84 2e 8c ee 6a 0e bd 09 f1 fe 88 4f 68 61 e1 b2 9c

// 00 00 
// c5 03 84 eb 74 68 6e 16 af f7 48 7a 27 ba 0a a8 e1 f3 1f 84 be 31 57 98 27 a2 c4 87 61 2b 0a 00 
// 00 00 00 01 
// 15 c8 a3 71 6e 4c 29 a6 58 91 80 3e 39 cd 9c d6 c2 fa 73 dc f9 c2 85 28 75 45 9a 15 74 7d 16 73 
// 00 00 00 0b 
// 00 00 00 00 
// 00 00 00 67 
// 00 00 00 63 1b 68 74 74 70 73 3a 2f 2f 63 6c 6f 75 64 66 6c 61 72 65 2d 69 70 66 73 2e 63 6f 6d 2f 69 70 66 73 2f 51 6d 62 78 69 66 79 35 4d 4c 61 72 6d 6f 78 54 5a 54 43 44 7a 53 73 55 59 36 74 52 46 77 74 31 7a 62 52 42 65 57 33 67 6f 77 55 4e 4a 58 2f 74 69 67 65 72 62 6f 72 64 65 72 2f 33 62 2e 67 69 66 
// 00 00 00 00 00 00 00 00 
// 00 00 00 01 
// 00 00 00 01 
// 3c b7 d3 84 2e 8c ee 6a 0e bd 09 f1 fe 88 4f 68 61 e1 b2 9c
