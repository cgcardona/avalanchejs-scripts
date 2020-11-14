import { Avalanche, BinTools, Buffer } from "avalanche"
import { 
  KeyPair,
} from "avalanche/dist/apis/avm"
import { InfoAPI } from "avalanche/dist/apis/info"
import { getPreferredHRP } from "avalanche/dist/utils"

const main = async (): Promise<any> => {
  const ip: string = "localhost"
  const protocol: string = "http"
  const networkID: number = 12345
  const port: number = 9650
  const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
  const info: InfoAPI = avalanche.Info()
  const hrp: string = getPreferredHRP(12345)
  const blockchainID: string = await info.getBlockchainID("X") 
  const keypair: KeyPair = new KeyPair(hrp, blockchainID)
  const bintools: BinTools = BinTools.getInstance()

  const messageStr: string = "2qDx8C17p5xs2k6Gok2tS"
  const signatureStr: string = "2j7w5VY4e1Cakje5LQQDgcJp3eKgRPhY82AofXEFC9hBXHhVBdQM6Psk8yNp8wHXFJrLk54UQmLo6p9HbAiMxwinDgtMiAJ"
  const pubKeyStr: string = "78XaCk8DiXr1YRrqxHPauYsVgArxr3KG7Ymosf1KKPmgzAQo6i"
  const msg: Buffer = bintools.cb58Decode(messageStr)
  const sig: Buffer = bintools.cb58Decode(signatureStr)
  const pk: Buffer = bintools.cb58Decode(pubKeyStr)
  const recover = keypair.recover(msg, sig)
  console.log(recover.toString('hex') === pk.toString('hex'))
}
  
main()