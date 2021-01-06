import { 
    Avalanche,
    Buffer
  } from "avalanche"
  import {
    AVMAPI, 
    KeyChain as AVMKeyChain,
    UTXOSet,
    UTXO,
    SECPTransferOutput,
  } from "avalanche/dist/apis/avm"
    
  const ip: string = "localhost"
  const port: number = 9650
  const protocol: string = "http"
  const networkID: number = 12345
  const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
  const xchain: AVMAPI = avalanche.XChain()
  const xKeychain: AVMKeyChain = xchain.keyChain()
  const privKey: string = "PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN"
  xKeychain.importKey(privKey)
  const xAddressStrings: string[] = xchain.keyChain().getAddressStrings()
    
  const main = async (): Promise<any> => {

    const u: any = await xchain.getUTXOs(xAddressStrings)
    const utxoSet: UTXOSet = u.utxos
    const utxos: UTXO[] = utxoSet.getAllUTXOs()
    console.log(utxos)
    utxos.forEach((utxo: UTXO) => {
      const output = utxo.getOutput()
      const buf: Buffer = output.toBuffer()
      const secpTransferOutput = new SECPTransferOutput()
      secpTransferOutput.fromBuffer(buf)
      console.log(secpTransferOutput.getGroupID())
      console.log(secpTransferOutput.getTypeID())
    })

  }
  
  main()
  