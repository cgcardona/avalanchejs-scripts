import { 
  Avalanche,
  BinTools,
  BN,
  Buffer
} from "avalanche"
import {
  AVMAPI,
  KeyChain as AVMKeyChain
} from "avalanche/dist/apis/avm"
import {
  EVMAPI
} from "avalanche/dist/apis/evm"
import { privKey, mstimeout } from '../common/values'
import { StakeableLockOut, UTXO } from "avalanche/dist/apis/platformvm"
import { UnixNow } from "avalanche/dist/utils"
console.log("-------------")
  
const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 12345
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const cchain: EVMAPI = avalanche.CChain()
const xchain: AVMAPI = avalanche.XChain()
const bintools: BinTools = BinTools.getInstance()
// const xKeychain: AVMKeyChain = xchain.keyChain()
// console.log("-------------")
// xKeychain.importKey(privKey)
// const addresses: Buffer[] = xchain.keyChain().getAddresses()
// const addressStrings: string[] = xchain.keyChain().getAddressStrings()
// console.log("-------------")

// let amount: BN = new BN(5000007) 
// let locktime: BN
// let threshold: number = 1
// let a = new BN('aaaa', 16);
// let b = new BN('101010', 2);
// console.log("-------------")

// let stakeableLocktime: BN = new BN(UnixNow.add(new BN(0)))
// // let transferableOutput? ParseableOutput
// let foo = new StakeableLockOut(amount, addresses, locktime, threshold, stakeableLocktime)
// let u = new UTXO(0, Buffer.alloc(32, 16), 0, Buffer.alloc(32, 16), 0)
// console.log(foo)

// let utxoArray: UTXO[] = [foo];
// let tmpUTXOArray: UTXO[] = [];

// let res = a.add(b);
// constructor(amount:BN = undefined, addresses:Array<Buffer> = undefined, locktime:BN = undefined, threshold:number = undefined, stakeableLocktime:BN = undefined, transferableOutput:ParseableOutput = undefined) {


  
const main = async (): Promise<any> => {
  // let amount: BN = new BN(5000007) 
  // let locktime: BN
  // let threshold: number = 1
  // let a = new BN('dead', 16);
  // let b = new BN('101010', 2);

  // let res = a.add(b);
  // let stakeableLocktime: BN = new BN(UnixNow.add(new BN(0)))
  // const address: string = "C-local18jma8ppw3nhx5r4ap8clazz0dps7rv5u00z96u"
  // // cchain.ex
  // const u: any = await cchain.getUTXOs(address, "X")
  // console.log(u)
  // const utxos = u.utxos
  // console.log(utxos.getAllUTXOStrings())
  // console.log("----------------------------")
}
  
main()
