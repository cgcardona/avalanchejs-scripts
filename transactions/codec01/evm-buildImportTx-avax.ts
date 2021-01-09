import { 
    Avalanche,
    BinTools,
    BN,
    Buffer,
    evm
  } from "avalanche"
  import {
    EVMAPI, 
    KeyChain,
    EVMInput,
    UnsignedTx,
    Tx,
    UTXOSet,
    UTXO
  } from "avalanche/dist/apis/evm"
  import {
    AVMAPI, 
    KeyChain as AVMKeyChain
  } from "avalanche/dist/apis/avm"
  import { Defaults } from "avalanche/dist/utils"
  import { 
    iEVMUTXOResponse 
  } from "avalanche/dist/apis/evm/interfaces"
        
  const ip: string = "localhost"
  const port: number = 9650
  const protocol: string = "http"
  const networkID: number = 12345
  const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
  const xchain: AVMAPI = avalanche.XChain()
  const cchain: EVMAPI = avalanche.CChain()
  const bintools: BinTools = BinTools.getInstance()
  const xKeychain: AVMKeyChain = xchain.keyChain()
  const cHexAddress: string = "0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC"
  const privKey: string = "PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN"
  const cKeychain: KeyChain = cchain.keyChain()
  xKeychain.importKey(privKey)
  cKeychain.importKey(privKey)
  const xAddressStrings: string[] = xchain.keyChain().getAddressStrings()
  const cAddressStrings: string[] = cchain.keyChain().getAddressStrings()
  const xChainBlockchainId: string = Defaults.network['12345'].X.blockchainID
        
  const main = async (): Promise<any> => {
    const evmUTXOResponse: iEVMUTXOResponse = await cchain.getUTXOs(cAddressStrings, xChainBlockchainId)
    const utxoSet: UTXOSet = evmUTXOResponse.utxos
    
    const unsignedTx: UnsignedTx = await cchain.buildImportTx(
      utxoSet,
      cAddressStrings,
      xChainBlockchainId,
      cHexAddress,
      cAddressStrings
    )
    const tx: Tx = unsignedTx.sign(cKeychain)
    const id: string = await cchain.issueTx(tx)
    console.log(id)
  }
      
  main()