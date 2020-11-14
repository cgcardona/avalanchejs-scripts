import { Avalanche, BinTools, Buffer } from "avalanche"
import { 
  AVMAPI, 
  KeyChain,
  KeyPair,
} from "avalanche/dist/apis/avm"

const main = async (): Promise<any> => {
  const ip: string = "localhost"
  const protocol: string = "http"
  const networkID: number = 12345
  const port: number = 9650
  const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
  const avm: AVMAPI = avalanche.XChain()
  const xKeychain: KeyChain = avm.keyChain()
  const privKey: string = "PrivateKey-"
  const keypair: KeyPair = xKeychain.importKey(privKey)
  const bintools: BinTools = BinTools.getInstance()

  const message: Buffer = Buffer.from("AvalancheJS")
  const messageStr: string = bintools.cb58Encode(message)
  console.log(messageStr)
  const signature: Buffer = keypair.sign(message)
  const signatureStr: string = bintools.cb58Encode(signature)
  console.log(signatureStr)
  const isValid: boolean = keypair.verify(message, signature)
  console.log(isValid)
  const pubKey: Buffer = keypair.getPublicKey()
  const pubKeyStr: string = bintools.cb58Encode(pubKey)
  console.log(pubKeyStr)

  // in another script
  const msg: Buffer = bintools.cb58Decode(messageStr)
  const sig: Buffer = bintools.cb58Decode(signatureStr)
  const pk: Buffer = bintools.cb58Decode(pubKeyStr)
  const recover = keypair.recover(msg, sig)
  console.log(recover.toString('hex') === pk.toString('hex'))
}
  
main()
