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
import sleep from '../common/sleep'
import { AVMU } from '../common/interfaces'
import { privKey, mstimeout } from '../common/values'
import { StakeableLockOut } from "avalanche/dist/apis/platformvm"
import { UnixNow } from "avalanche/dist/utils"
  
const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 12345
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const cchain: EVMAPI = avalanche.CChain()
const xchain: AVMAPI = avalanche.XChain()
const bintools: BinTools = BinTools.getInstance()
const xKeychain: AVMKeyChain = xchain.keyChain()
xKeychain.importKey(privKey)
const xAddresses: Buffer[] = xchain.keyChain().getAddresses()
const xAddressStrings: string[] = xchain.keyChain().getAddressStrings()
  
const main = async (): Promise<any> => {
  const txid: any = await cchain.importAVAX("gabr13l", "2if3ZlOfZ7", "0xCD5C1f9B15DF1B2a49F9F3491A63A91d08D6c962", "X")
  console.log(txid)
}

let amount: BN = new BN(5000007) 
let addresses: Buffer[] = xAddresses
let locktime: BN
let threshold: number = 1
let a = new BN('dead', 16);
let b = new BN('101010', 2);

let res = a.add(b);
let stakeableLocktime: BN = new BN(UnixNow.add(new BN(0)))
// let transferableOutput? ParseableOutput
// new StakeableLockOut()
  
main()

// 00 00 
// 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 

// 00 00 00 01 
// db cf 89 0f 77 f4 9b 96 85 76 48 b7 2b 77 f9 f8 29 37 f2 8a 68 70 4a f0 5d a0 dc 12 ba 53 f2 db 
// 00 00 00 16 
// 00 00 00 00 61 62 2d 00 
// 00 00 00 07 
// 00 23 86 f2 6f c1 00 00 
// 00 00 00 00 00 00 00 00 
// 00 00 00 01 
// 00 00 00 01 
// 3c b7 d3 84 2e 8c ee 6a 0e bd 09 f1 fe 88 4f 68 61 e1 b2 9c

