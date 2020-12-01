import { 
  Avalanche,
  BinTools,
  BN,
  Buffer
} from 'avalanche'
import {
  AVMAPI, 
  UTXOSet as AVMUTXOSet,
  KeyChain as AVMKeyChain,
  UnsignedTx as AVMUnsignedTx,
  Tx as AVMTx,
  InitialStates,
  AVMConstants,
  TransferableInput as AVMTransferInput,
  SECPTransferInput as AVMSECPTransferInput,
  SECPTransferOutput as AVMSECPTransferOutput,
  TransferableOutput as AVMTransferableOutput,
  UTXO as AVMUTXO,
  ExportTx as AVMExportTx,
  AmountOutput
} from 'avalanche/dist/apis/avm'
import {
  EVMAPI, 
  ExportTx as EVMExportTx,
  KeyChain as EVMKeyChain,
  ImportTx as EVMImportTx,
  EVMInput,
  TransferableOutput as EVMTransferableOutput,
  TransferableInput as EVMTransferableInput,
  SECPTransferOutput as EVMSECPTransferOutput,
  UnsignedTx as EVMUnsignedTx,
  EVMOutput,
  SECPTransferInput as EVMSECPTransferInput,
  Tx as EVMTx,
  UTXO as EVMUTXO,
  AmountOutput as EVMAmountOutput
} from 'avalanche/dist/apis/evm'
import { DefaultLocalGenesisPrivateKey } from 'avalanche/dist/utils'
// import { AVMU } from '../common/interfaces'
import {
  PlatformVMAPI,
  KeyChain as PlatformVMKeyChain,
} from 'avalanche/dist/apis/platformvm'
import { KeystoreAPI } from 'avalanche/dist/apis/keystore'
const Web3 = require('web3')

const sleep = (ms: number): Promise<unknown> => {
  return new Promise( resolve => setTimeout(resolve, ms) )
}
    
const ip: string = 'localhost'
const port: number = 9650
const protocol: string = 'http'
const networkID: number = 12345
const path: string = '/ext/bc/C/rpc'
const web3 = new Web3(`${protocol}://${ip}:${port}${path}`)
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)

// APIs
const bintools: BinTools = BinTools.getInstance()
const xchain: AVMAPI = avalanche.XChain()
const cchain: EVMAPI = avalanche.CChain()
const pchain: PlatformVMAPI = avalanche.PChain()
const keystore: KeystoreAPI = avalanche.NodeKeys()

// keychains
const xKeychain: AVMKeyChain = xchain.keyChain()
const cKeychain: EVMKeyChain = cchain.keyChain()
const pKeychain: PlatformVMKeyChain = pchain.keyChain()
const pkPrefix: string = 'PrivateKey'
xKeychain.importKey(`${pkPrefix}-${DefaultLocalGenesisPrivateKey}`)
cKeychain.importKey(`${pkPrefix}-${DefaultLocalGenesisPrivateKey}`)
pKeychain.importKey(`${pkPrefix}-${DefaultLocalGenesisPrivateKey}`)

// addresses
const xAddresses: Buffer[] = xchain.keyChain().getAddresses()
const xAddressStrings: string[] = xchain.keyChain().getAddressStrings()
const cAddresses: Buffer[] = cchain.keyChain().getAddresses()
const cAddressStrings: string[] = cchain.keyChain().getAddressStrings()
const pAddresses: Buffer[] = pchain.keyChain().getAddresses()
const pAddressStrings: string[] = pchain.keyChain().getAddressStrings()
const prefixCAddress: string = '0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC'

// chain ids
const xChainIdStr: string = '2eNy1mUFdmaxXNj1eQHUe7Np4gju9sJsEtWQ4MX3ToiNKuADed'
const xChainIdBuf: Buffer = bintools.cb58Decode(xChainIdStr)
const cChainIdStr: string = '26sSDdFXoKeShAqVfvugUiUQKhMZtHYDLeBqmBfNfcdjziTrZA'
const cChainIdBuf: Buffer = bintools.cb58Decode(cChainIdStr)
const pChainIdStr: string = '11111111111111111111111111111111LpoYY'
const pChainIdBuf: Buffer = bintools.cb58Decode(pChainIdStr)

// asset ids
const avaxAssetIDStr: string = '2fombhL7aGPwj3KH4bfrmJwW6PVnMobf9Y2fn9GwxiAAJyFDbe'
const avaxAssetIDBuf: Buffer = bintools.cb58Decode(avaxAssetIDStr)

// empty arrays
const avmTransferInputs: AVMTransferInput[] = []
const avmTransferableOutputs: AVMTransferableOutput[] = []
const evmInputs: EVMInput[] = []
const exportedAVMTransferableOutputs: AVMTransferableOutput[] = []

const fee: BN = new BN(1000000)
const mstimeout: number = 5000
const username: string = 'gabr13l'
const password: string = 'i224rjEezt'
const xChainExportAmount: BN = new BN(1000000000)
    
const main = async (): Promise<any> => {
  // console.log('Step 1: Add users to Keystore as needed')
  // // fetch all usernames from keystore
  // const users: string[] = await keystore.listUsers()
  // // log all usernames
  // console.log(`Users: ${users}`)

  // // If ${username} isn't already in the keystore then add it
  // if(!users.includes(username)) {
  //   console.log(`User ${username} doesn't exist in keystore`)
  //   console.log(`Adding ${username} to keystore`)

  //   const createdUser: boolean = await keystore.createUser(username, password)
  //   if(createdUser) {
  //     console.log(`Added ${username} to keystore`)
  //   }
  // } else {
  //   console.log(`User ${username} exist in keystore. No need to create user`)
  // }

  // await sleep(mstimeout)
  // console.log('+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!')
  // console.log('\n\n')
  // memo
  let memoStr: string = 'Step 1: Create Fixed Cap asset'
  console.log(memoStr)
  let memoBuf: Buffer = bintools.stringToBuffer(memoStr)
  let memoCB58: string = bintools.cb58Encode(memoBuf)
  let memo: Buffer = bintools.stringToBuffer(memoCB58)

  // utxos
  let avmu = await xchain.getUTXOs([xAddressStrings[0]])
  let avmUTXOSet: AVMUTXOSet = avmu.utxos 

  // token details
  const tokenAmount: BN = new BN(54321)
  const tokenName: string = "Fixed cap asset"
  const tokenSymbol: string = "FIXC"
  const tokenDenomination: number = 9
  const tokenLocktime: BN = new BN(0)
  const tokenThreshold: number = 1

  const avmSECPTransferOutput: AVMSECPTransferOutput = new AVMSECPTransferOutput(
    tokenAmount, 
    xAddresses, 
    tokenLocktime, 
    tokenThreshold
  )
  const initialState: InitialStates = new InitialStates()
  initialState.addOutput(avmSECPTransferOutput, AVMConstants.SECPFXID)

  let avmUnsignedTx: AVMUnsignedTx = await xchain.buildCreateAssetTx(
    avmUTXOSet,
    xAddressStrings,
    xAddressStrings,
    initialState,
    tokenName,
    tokenSymbol, 
    tokenDenomination
  )
  let avmtx: AVMTx =  avmUnsignedTx.sign(xKeychain)
  let txid: string = await xchain.issueTx(avmtx)
  console.log(`TXID: ${txid}`)
  const newAssetId: string = txid
  const newAssetIdBuf: Buffer = bintools.cb58Decode(newAssetId)

  // return false
  await sleep(mstimeout)
  console.log('+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!')
  console.log('\n')
  // memos
  memoStr = 'Step 2: Export AVAX from the X-Chain'
  memoBuf = bintools.stringToBuffer(memoStr)
  memoCB58 = bintools.cb58Encode(memoBuf)
  memo = bintools.stringToBuffer(memoCB58)
  console.log(memoStr)

  // utxos
  avmu = await xchain.getUTXOs([xAddressStrings[0]])
  avmUTXOSet = avmu.utxos 

  avmUnsignedTx = await xchain.buildExportTx(
    avmUTXOSet,
    xChainExportAmount,
    cChainIdStr,
    cAddressStrings,
    xAddressStrings,
    xAddressStrings,
    memo
  )
  avmtx =  avmUnsignedTx.sign(xKeychain)
  txid = await xchain.issueTx(avmtx)
  console.log(`TXID: ${txid}`)
  // return false
  await sleep(mstimeout)
  console.log('+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!')
  console.log('\n')

  memoStr = 'Step 3: Export ANT from the X-Chain'
  console.log(memoStr)
  avmu = await xchain.getUTXOs([xAddressStrings[0]])
  avmUTXOSet = avmu.utxos 
  avmUTXOSet.getAllUTXOs().forEach(async (utxo: AVMUTXO) => {
    const tmpAssetIdBuf: Buffer = utxo.getAssetID()
    const tmpAssetIdStr: string = bintools.cb58Encode(tmpAssetIdBuf)
    if(tmpAssetIdStr === avaxAssetIDStr) {
      // if the utxo is AVAX then consume it to pay the fee and create a new output paying change back to the X-Address
      const amountoutput = utxo.getOutput() as AmountOutput
      const amt: BN = amountoutput.getAmount()
      const avmSECPTransferInput: AVMSECPTransferInput = new AVMSECPTransferInput(amt)
      avmSECPTransferInput.addSignatureIdx(0, xAddresses[0])
      
      const txid: Buffer = utxo.getTxID()
      const outputIdx: Buffer = utxo.getOutputIdx()
      const assetId: Buffer = utxo.getAssetID()
      
      const avmTransferInput: AVMTransferInput = new AVMTransferInput(txid, outputIdx, assetId, avmSECPTransferInput)
      avmTransferInputs.push(avmTransferInput)
      
      const avmSECPTransferOutput: AVMSECPTransferOutput = new AVMSECPTransferOutput(
        amt.sub(fee),
        cAddresses,
        tokenLocktime,
        tokenThreshold
      )
      const avmTransferableOutput: AVMTransferableOutput = new AVMTransferableOutput(
        avaxAssetIDBuf, 
        avmSECPTransferOutput
      )
      avmTransferableOutputs.push(avmTransferableOutput)
    }
    if(tmpAssetIdStr === newAssetId) {
      // if the utxo is our newly created asset then add it to `exportedOuts` to become an atomic UTXO

      // first consume it as a SECPTransferInput
      const amountoutput = utxo.getOutput() as AmountOutput
      const amt: BN = amountoutput.getAmount()
      const avmSECPTransferInput: AVMSECPTransferInput = new AVMSECPTransferInput(amt)
      avmSECPTransferInput.addSignatureIdx(0, xAddresses[0])
      
      const txid: Buffer = utxo.getTxID()
      const outputIdx: Buffer = utxo.getOutputIdx()
      const assetId: Buffer = utxo.getAssetID()
      
      const avmTransferInput: AVMTransferInput = new AVMTransferInput(txid, outputIdx, assetId, avmSECPTransferInput)
      avmTransferInputs.push(avmTransferInput)

      const newAssetIdBuf: Buffer = bintools.cb58Decode(newAssetId)
      const avmSECPTransferOutput: AVMSECPTransferOutput = new AVMSECPTransferOutput(
        tokenAmount,
        cAddresses,
        tokenLocktime,
        tokenThreshold
      )
      const avmTransferableOutput: AVMTransferableOutput = new AVMTransferableOutput(
        newAssetIdBuf, 
        avmSECPTransferOutput
      )
      exportedAVMTransferableOutputs.push(avmTransferableOutput)
    }
  })
  let avmExportTx: AVMExportTx = new AVMExportTx(
    networkID,
    xChainIdBuf,
    avmTransferableOutputs,
    avmTransferInputs,
    memo,
    cChainIdBuf,
    exportedAVMTransferableOutputs
  )
  avmUnsignedTx = new AVMUnsignedTx(avmExportTx)
  avmtx = avmUnsignedTx.sign(xKeychain)
  // console.log(avmtx.toBuffer().toString('hex'))
  txid = await xchain.issueTx(avmtx)
  console.log(txid)
  memoBuf = bintools.stringToBuffer(memoStr)
  memoCB58 = bintools.cb58Encode(memoBuf)
  memo = bintools.stringToBuffer(memoCB58)

  // return false
  await sleep(mstimeout)
  console.log('+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!')
  console.log('\n')

  memoStr = 'Step 4: Import AVAX and ANT to the C-Chain'
  console.log(memoStr)
  const importedIns: EVMTransferableInput[] = []
  const outs: EVMOutput[] = []
  const evmAtomicU: any = await cchain.getUTXOs(cAddressStrings[0], 'X')
  const evmAtomicUTXOSet: any = evmAtomicU.utxos

  evmAtomicUTXOSet.getAllUTXOs().forEach(async (utxo: EVMUTXO) => {
    const assetID: Buffer = utxo.getAssetID() 
    const id: Buffer = utxo.getTxID()
    const outputidx: Buffer = utxo.getOutputIdx()
    const evmAmountOutput: EVMAmountOutput = utxo.getOutput() as EVMAmountOutput
    const evmAmount: BN = evmAmountOutput.getAmount().clone()
    const evmsecptransferinput: EVMSECPTransferInput = new EVMSECPTransferInput(evmAmount)
    evmsecptransferinput.addSignatureIdx(0, cAddresses[0])
    const evmTransferableInput: EVMTransferableInput = new EVMTransferableInput(id, outputidx, assetID, evmsecptransferinput)
    importedIns.push(evmTransferableInput)
    const o: EVMOutput = new EVMOutput(prefixCAddress, evmAmount, assetID)
    outs.push(o)
  });

  const evmImportTx: EVMImportTx = new EVMImportTx(
    networkID,
    cChainIdBuf,
    xChainIdBuf,
    importedIns,
    outs
  )
  let evmUnsignedTx: EVMUnsignedTx = new EVMUnsignedTx(evmImportTx)
  let evmtx: EVMTx = evmUnsignedTx.sign(cKeychain)
  txid = await cchain.issueTx(evmtx)
  console.log(txid)

  await sleep(mstimeout)
  console.log('+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!+!')
  console.log('\n')

  memoStr = 'Step 5: Export AVAX and ANT to the X-Chain'
  console.log(memoStr)


  const avaxAmount: BN = new BN(1000000000)
  const txcount = await web3.eth.getTransactionCount(prefixCAddress)
  const nonce: number = txcount
  // Create an AVAX input
  const avaxEVMInput: EVMInput = new EVMInput(prefixCAddress, avaxAmount, avaxAssetIDStr, nonce)
  avaxEVMInput.addSignatureIdx(0, cAddresses[0])
  evmInputs.push(avaxEVMInput)

  // Create an asset input
  const assetAmount: BN = new BN(54321)
  const assetEVMInput: EVMInput = new EVMInput(prefixCAddress, assetAmount, newAssetIdBuf, nonce)
  assetEVMInput.addSignatureIdx(0, cAddresses[0])
  evmInputs.push(assetEVMInput)

  const locktime: BN = new BN(0)
  const threshold: number = 1
  const exportedOuts: EVMTransferableOutput[] = []
  // Create Asset Output
  const assetOutput: AVMSECPTransferOutput = new AVMSECPTransferOutput(assetAmount, xAddresses, locktime, threshold)
  const assetAVMTransferableOutput: EVMTransferableOutput = new EVMTransferableOutput(avaxAssetIDBuf, assetOutput)
  exportedOuts.push(assetAVMTransferableOutput)
  // Create AVAX Output
  const avaxOutput: AVMSECPTransferOutput = new AVMSECPTransferOutput(avaxAmount.sub(fee), xAddresses, locktime, threshold)
  const avaxAVMTransferableOutput: EVMTransferableOutput = new EVMTransferableOutput(avaxAssetIDBuf, avaxOutput)
  exportedOuts.push(avaxAVMTransferableOutput)
  const evmExportTx: EVMExportTx = new EVMExportTx(
    networkID,
    cChainIdBuf,
    xChainIdBuf,
    evmInputs,
    exportedOuts
  )
  evmUnsignedTx = new EVMUnsignedTx(evmExportTx)
  evmtx = evmUnsignedTx.sign(cKeychain)
  console.log(evmtx.toBuffer().toString('hex'))
  txid = await cchain.issueTx(evmtx)
  console.log(txid)

  return false

  // let threshold: number = 1
  // // let avaxAmount: BN = new BN(await web3.eth.getBalance(prefixCAddress)).div(new BN(1000000))
  // let avaxAmount: BN = new BN(1000000000)
  // console.log(await web3.eth.getBalance(prefixCAddress))
  // // console.log(avaxAmount.sub(fee).toString())
  // // return false
  // let txcount = await web3.eth.getTransactionCount(prefixCAddress)
  // const nonce: number = txcount
  // console.log(nonce)
  // // return false
  // const locktime: BN = new BN(0)
  // const input: EVMInput = new EVMInput(prefixCAddress, avaxAmount, avaxAssetID, nonce)
  // input.addSignatureIdx(0, cAddresses[0])
  // inputs.push(input)
  // const avaxOutput: SECPTransferOutput = new SECPTransferOutput(avaxAmount.sub(fee), xAddresses, locktime, threshold)
  // const transferableOutput: TransferableOutput = new TransferableOutput(bintools.cb58Decode(avaxAssetID), avaxOutput)
  // exportedOuts.push(transferableOutput)
  // const exportTx: ExportTx = new ExportTx(
  //     networkID,
  //     bintools.cb58Decode(cChainid),
  //     bintools.cb58Decode(xChainId),
  //     inputs,
  //     exportedOuts
  // )
  // // console.log(exportTx.toBuffer().toString('hex'))
  // // console.log('--')
  
  // // const exportTx2: ExportTx = new ExportTx()
  // // exportTx2.fromBuffer(exportTx.toBuffer())
  // const unsignedTx: UnsignedTx = new UnsignedTx(exportTx)
  // const tx: Tx = unsignedTx.sign(cKeychain)
  // console.log(tx.toBuffer().toString('hex'))
  // const id: string = await cchain.issueTx(tx)
  // console.log(id)
}
  
main()
  