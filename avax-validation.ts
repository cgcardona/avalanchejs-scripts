import { Avalanche, BinTools, BN } from "avalanche"
import { Buffer } from 'buffer/'
import { UnixNow } from 'avalanche/dist/utils'
import { 
  AVMAPI, 
  AVMKeyChain, 
  AVMKeyPair,
  Tx as AVMTX, 
  UnsignedTx as AVMUTX,
  UTXOSet as AVMUTXOSet
} from "avalanche/dist/apis/avm"
import {
  PlatformVMAPI, 
  PlatformVMKeyChain,
  PlatformVMKeyPair,
  Tx, 
  UnsignedTx,
  UTXOSet,
  PlatformVMConstants
} from "avalanche/dist/apis/platformvm"
import { InfoAPI } from "avalanche/dist/apis/info"
import { KeystoreAPI } from "avalanche/dist/apis/keystore"

const sleep = (ms: number): Promise<unknown> => {
  return new Promise( resolve => setTimeout(resolve, ms) )
}

// consts
const ip: string = "localhost"
const protocol: string = "http"
const networkID: number = 12345
const port: number = 9650
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const bintools: BinTools = BinTools.getInstance()
const avm: AVMAPI = avalanche.XChain()
const platformvm: PlatformVMAPI = avalanche.PChain()
const xKeychain: AVMKeyChain = avm.keyChain()
const pKeychain: PlatformVMKeyChain = platformvm.keyChain()
const memoBuf: Buffer = bintools.stringToBuffer("Avalanche.js")
const memoCB58: string = bintools.cb58Encode(memoBuf)
const memo: Buffer = bintools.stringToBuffer(memoCB58)
xKeychain.importKey("PrivateKey-")
pKeychain.importKey("PrivateKey-")
const xAddresses: Buffer[] = avm.keyChain().getAddresses()
const xAddressStrings: string[] = avm.keyChain().getAddressStrings()
const pAddresses: Buffer[] = platformvm.keyChain().getAddresses()
const pAddressStrings: string[] = platformvm.keyChain().getAddressStrings()
console.log(pAddressStrings)

// const ava2: Avalanche = new Avalanche(ip, port, protocol, networkID)
// const ava3: Avalanche = new Avalanche(ip, port, protocol, networkID)

// const pchain: PlatformVMAPI = avalanche.PChain()
// const pchain2: PlatformVMAPI = ava2.PChain();
// const pchain3: PlatformVMAPI = ava3.PChain();
// const xchain: AVMAPI = ava3.XChain();

// const p3Keystore: KeystoreAPI = ava3.NodeKeys();

// const info1: InfoAPI = avalanche.Info();
// const info2: InfoAPI = ava2.Info();
// const xinfo: InfoAPI = ava3.Info();

// const xaddressStrings: string[] = myKeychain.getAddressStrings()
// const funderAddress: string = xaddressStrings[0]
// const mstimeout: number = 2000;

// const makeFunded = async (
//     xchain: AVMAPI, 
//     funderAddress: string, 
//     pchain: PlatformVMAPI, 
//     numAddrs: number, 
//     amount: BN
// ):Promise<Array<PlatformVMKeyPair>> => {
//     let result:Array<PlatformVMKeyPair> = [];
//     let xtxids:Array<string> = [];
//     let ptxids:Array<string> = [];
//     for(let i = 0; i  < numAddrs; i++){
//         const XutxoSet: AVMUTXOSet = await xchain.getUTXOs([funderAddress]);
//         console.log("xutos", XutxoSet.getAllUTXOStrings());
//         let kp:PlatformVMKeyPair = pchain.keyChain().makeKey();
//         let addr:string = kp.getAddressString();
//         let amtfee:BN = amount.add(pchain.getFee());
//         console.log(addr, amtfee.toString(10));
//         const memo: Buffer = bintools.stringToBuffer("Avalanche.js")
//         let eutx:AVMUTX = await xchain.buildExportTx(
//             XutxoSet,
//             amtfee,
//             pchain.getBlockchainID(),
//             [addr],
//             [funderAddress],
//             [funderAddress],
//             memo
//         );
//         let etx:AVMTX = eutx.sign(xchain.keyChain());
//         let etxid:string = await xchain.issueTx(etx);

//         xtxids.push(etxid);
//         console.log("funder address", funderAddress, "sent to", addr, "export txid", etxid);
//         await sleep(mstimeout); // sleep to at least propagate the tx (overkill on local network)
//         let utxos:UTXOSet = await pchain.getUTXOs(addr);
        
//         let iutx:UnsignedTx = await pchain.buildImportTx(utxos, [addr], xchain.getBlockchainID(), [addr], [addr], [addr]);
//         //console.log(iutx.toBuffer().toString("hex"));
//         let itx:Tx = iutx.sign(pchain.keyChain());
//         let itxid:string = await pchain.issueTx(itx);
//         ptxids.push(itxid);
//         await sleep(mstimeout); // sleep to at least propagate the tx (overkill on local network)
//         result.push(kp);
//         console.log("Funded: ", kp.getAddressString());
//     }
//     return result;
// } 

// const startTime: BN = UnixNow().add(new BN(60)); //60 seconds from now
// const startTimePast: BN = UnixNow().sub(new BN(60)); // one minute in past
// const endTime: BN = startTime.add(new BN(60 * 60 * 24 * 14)); 
// const endTimePlusOne:BN = endTime.add(new BN(1));
// const endTimeMinusOne:BN = endTime.sub(new BN(1));
// const endTimeOverYear:BN = startTime.add(new BN(60 * 60 * 24 * 367)); // 367 days later
// const stakeAmount: BN = PlatformVMConstants.MINSTAKE;
// const fundAmount:BN = PlatformVMConstants.MINSTAKE.mul(new BN(2));

// const username = "whocares" +  Math.floor(Math.random() * (100000000 - 1) + 1);
// const password = "iLiterallY12Dont.Care";
// console.log("My Username Is: ", username, "and my password is:", password);

const main = async (): Promise<any> => {
    return false

//     let p1kp:Array<PlatformVMKeyPair> = await makeFunded(xchain, funderAddress, pchain, 3, fundAmount);
//     let p1a:Array<string> = p1kp.map((kp) => kp.getAddressString());

//     let p2kp:Array<PlatformVMKeyPair> = await makeFunded(xchain, funderAddress, pchain2, 3, fundAmount);
//     let p2a:Array<string> = p2kp.map((kp) => kp.getAddressString());

//     let p3kp:Array<PlatformVMKeyPair> = await makeFunded(xchain, funderAddress, pchain3, 1, fundAmount);
//     let p3a:Array<string> = p3kp.map((kp) => kp.getAddressString());

//     let success:boolean = await p3Keystore.createUser(username, password);
//     //let ctrlkey:string = await pchain3.importKey(username, password, p3kp[0].getPrivateKeyString());
//     //let subnet:string = await pchain3.createSubnet(username, password, [ctrlkey], 1);

//     await sleep(mstimeout); 

//     const nodeID1: string = await info1.getNodeID();
//     console.log("nodeID1", nodeID1);
//     const nodeID2: string = await info2.getNodeID();
//     console.log("nodeID2", nodeID2);
//     const xnodeID: string = await xinfo.getNodeID();
//     console.log("xnodeID", xnodeID);

//     const addMe1: string = "NodeID-MYUmR31tU1HBo9sXaqi7ezDEyY9a7AMCg";
//     console.log("addMe1 NodeID: ", addMe1);
//     const addMe2: string = "NodeID-DGT4QxZM69WgqjoMVo8uyVAV48meY6T1y";
//     console.log("addMe2 NodeID: ", addMe2);
//     const addMe3: string = "NodeID-Dkhb8qc9FhbKCibRqM5z9QerjYh25d9mH";
//     console.log("addMe3 NodeID: ", addMe3);
//     const addMe4: string = "NodeID-PmWSEFBtP1DSrkgSgKW5VGJgy8V57vwTv";
//     console.log("addMe3 NodeID: ", addMe4);

//     let p1uset: UTXOSet = await pchain.getUTXOs(p1a);
//     let p2uset: UTXOSet = await pchain2.getUTXOs(p2a);
//     // return false
//     const memo: Buffer = bintools.stringToBuffer("Avalanche.js");

//     const txs:Array<string> = [];
//     let txid:string = '';

//     const p1val: UnsignedTx = await pchain.buildAddValidatorTx(
//         p1uset,
//         p1a,
//         p1a,
//         addMe1,
//         startTime,
//         endTime,
//         stakeAmount,
//         p1a,
//         0.01,
//         new BN(0),
//         1,
//         memo
//     );
//     const p1valTx:Tx =  p1val.sign(pchain.keyChain());
//     console.log("---------------------");
//     console.log(p1valTx.toBuffer().toString("hex"));
//     txid = await pchain.issueTx(p1valTx);
//     console.log("p1valTx txid: ", txid);
//     console.log("---------------------");
//     txs.push(txid);
//     await sleep(mstimeout);
//     p1uset = await pchain.getUTXOs(p1a);

//     const p2val: UnsignedTx = await pchain2.buildAddValidatorTx(
//         p2uset,
//         p2a,
//         p2a,
//         addMe2,
//         startTime,
//         endTime,
//         stakeAmount,
//         p2a,
//         0.02,
//         new BN(0),
//         1,
//         memo
//     );
//     const p2valTx:Tx =  p2val.sign(pchain2.keyChain());
//     console.log("---------------------");
//     console.log("")
//     console.log(p2valTx.toBuffer().toString("hex"));
//     txid = await pchain2.issueTx(p2valTx);
//     console.log("p2valTx txid: ", txid);
//     console.log("---------------------");
//     txs.push(txid);
//     await sleep(mstimeout);
//     p2uset = await pchain2.getUTXOs(p2a);

//     const p1del: UnsignedTx = await pchain.buildAddDelegatorTx(
//         p1uset,
//         p1a,
//         p1a,
//         nodeID2,
//         startTime,
//         endTime,
//         stakeAmount,
//         p1a,
//         new BN(0),
//         1,
//         memo
//     );
//     const p1delTx:Tx =  p1del.sign(pchain.keyChain());
//     console.log("---------------------");
//     console.log(p1delTx.toBuffer().toString("hex"));
//     txid = await pchain.issueTx(p1delTx);
//     console.log("p1delTx txid: ", txid);
//     console.log("---------------------");
//     txs.push(txid);
//     await sleep(mstimeout);
//     p1uset = await pchain.getUTXOs(p1a);

//     const p2del: UnsignedTx = await pchain2.buildAddDelegatorTx(
//         p2uset,
//         p2a,
//         p2a,
//         nodeID2,
//         startTime,
//         endTime,
//         stakeAmount,
//         p2a,
//         new BN(0),
//         1,
//         memo
//     );
//     const p2delTx:Tx =  p2del.sign(pchain2.keyChain());
//     console.log("---------------------");
//     console.log(p2delTx.toBuffer().toString("hex"));
//     txid = await pchain2.issueTx(p2delTx);
//     console.log("p2delTx txid: ", txid);
//     console.log("---------------------");
//     txs.push(txid);
//     await sleep(mstimeout);
//     p2uset = await pchain2.getUTXOs(p2a);
// /*
//     const p1sub: UnsignedTx = await pchain1.buildAddSubnetValidatorTx(
//         p1uset,
//         p1a,
//         p1a,
//         nodeID1,
//         startTime,
//         endTime,
//         stakeAmount,
//         memo
//     );
//     const p1subTx:Tx =  p1sub.sign(pchain1.keyChain());
//     txid = await pchain1.issueTx(p1subTx);
//     txs.push(txid);
//     sleep(mstimeout);
//     p1uset = await pchain1.getUTXOs(p1a);

//     const p2sub: UnsignedTx = await pchain2.buildAddDelegatorTx(
//         p2uset,
//         p2a,
//         p2a,
//         nodeID2,
//         startTime,
//         endTime,
//         stakeAmount,
//         p2a[3],
//         memo
//     );
//     const p2subTx:Tx =  p2sub.sign(pchain2.keyChain());
//     txid = await pchain2.issueTx(p2subTx);
//     txs.push(txid);
//     sleep(mstimeout);
//     p2uset = await pchain2.getUTXOs(p1a);
// */
  }
  
main()

