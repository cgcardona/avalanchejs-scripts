// // imports
// import {
//     AVMKeyChain,
//     AVMKeyPair,
//   } from "avalanche/dist/apis/avm"
//   import {
//     PlatformVMKeyChain,
//     PlatformVMKeyPair
//   } from "avalanche/dist/apis/platformvm"
//   import { Buffer } from 'buffer/'
//   import * as bip39 from "bip39"
//   import HDKey from 'hdkey'
  
//   // the goods
//   const main = async (): Promise<any> => {
//     const AVAX_ACCOUNT_PATH: string = `m/44'/9000'/0'`
//     // const mnemonic: string = bip39.generateMnemonic(256)
//     // const mnemonic: string = "mobile tonight decorate wagon series round pottery peanut egg country plunge multiply pen razor select beyond dune trumpet spider jeans album vast ginger law"
//     const mnemonic: string = "burden radio forget pact horn blade fame give detail stereo gun logic float over swing must fog hair anxiety prevent injury boss shallow letter"
//     console.log(`Mnemonic: ${mnemonic}`)
  
//     const seed: globalThis.Buffer = bip39.mnemonicToSeedSync(mnemonic)
//     const hdkey: HDKey = HDKey.fromMasterSeed(seed)
//     let derivationPath: string = `${AVAX_ACCOUNT_PATH}/0`
//     console.log("X ADDRESSES")
//     for (let i: number = 0; i < 5; i++) {
//       let key: HDKey = hdkey.derive(`${derivationPath}/${i}`) as HDKey
//       let keychain: AVMKeyChain = new AVMKeyChain("everest", 'X')
//       let pkHex: string = key.privateKey.toString('hex')
//       let pkBuf: Buffer = new Buffer(pkHex, 'hex')
//       let addr: AVMKeyPair = keychain.importKey(pkBuf)
//       console.log(`${i} Address: ${addr.getAddressString()}`)
//       console.log(`${i} Public Key: ${key.publicKey.toString('hex')}`)
//       console.log(`${i} Private Key: ${key.privateKey.toString('hex')}`)
//       console.log("--")
//     }
//     console.log("+++++++++++++++++++++++++++++++++++")
//     console.log("P ADDRESSES")
//     for (let i: number = 0; i < 5; i++) {
//       let key = hdkey.derive(`${derivationPath}/${i}`) as HDKey
//       let keychain: PlatformVMKeyChain = new PlatformVMKeyChain('everest', 'P')
//       let pkHex: string = key.privateKey.toString('hex')
//       let pkBuf: Buffer = new Buffer(pkHex, 'hex')
//       let addr: PlatformVMKeyPair = keychain.importKey(pkBuf)
//       console.log(`${i} Address: ${addr.getAddressString()}`)
//       console.log(`${i} Public Key: ${key.publicKey.toString('hex')}`)
//       console.log(`${i} Private Key: ${key.privateKey.toString('hex')}`)
//       console.log("--")
//     }
//   }
//   main()
