import { Avalanche, Buffer } from "avalanche"
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
  const privKey: string = "PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN"
  const keypair: KeyPair = xKeychain.importKey(privKey)
  const message: Buffer = Buffer.from("AvalancheJS")
  const signature: Buffer = keypair.sign(message)
  const recover = keypair.recover(message, signature)
  console.log(recover)
  const isValid: boolean = keypair.verify(message, signature)
  console.log(isValid)
  const pubKey: Buffer = keypair.getPublicKey()
}
  
main()

