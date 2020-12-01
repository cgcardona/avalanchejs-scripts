// // imports
// import { 
//     Avalanche, 
//     BinTools, 
//     BN 
//   } from "avalanche"

//   import {
//     AVMAPI,
//     AVMConstants,
//     AVMKeyChain,
//     AVMKeyPair,
//     InitialStates,
//     SecpOutput,
//     Tx,
//     UnsignedTx,
//     UTXOSet
//   } from "avalanche/dist/apis/avm"

//   import {
//     PlatformVMKeyChain,
//     PlatformVMKeyPair
//   } from "avalanche/dist/apis/platformvm"


// import { Buffer } from 'buffer/'
// import * as bip39 from "bip39"
// import HDKey from 'hdkey'

// // the goods
// const main = async (): Promise<any> => {
//     const AVAX_ACCOUNT_PATH: string = `m/44'/9000'/0'`
//     // const mnemonic: string = bip39.generateMnemonic(256)
//     // console.log(mnemonic)
//     // return false
//     const mnemonic: string = "urban top ribbon pond purpose spare network mesh fish tackle valley shock token chat unaware pond public stone picture faculty sample number vintage guess"

//     const seed: globalThis.Buffer = bip39.mnemonicToSeedSync(mnemonic)
//     const hdkey: HDKey = HDKey.fromMasterSeed(seed)
//     let derivationPath: string = `${AVAX_ACCOUNT_PATH}/0`
//     console.log("X ADDRESSES")
//     for(let i:number=0;i<1;i++) {
//         let key: HDKey = hdkey.derive(`${derivationPath}/${i}`) as HDKey
//         let keychain: AVMKeyChain = new AVMKeyChain("avax", 'X');
//         let pkHex: string = key.privateKey.toString('hex');
//         let pkBuf: Buffer = new Buffer(pkHex, 'hex');
//         let addr: AVMKeyPair = keychain.importKey(pkBuf);
//         console.log(addr.getAddressString())
//     }
//     console.log("+++++++++++++++++++++++++++++++++++")
//     console.log("P ADDRESSES")
//     for(let i:number=0;i<1;i++) {
//         let key = hdkey.derive(`${derivationPath}/${i}`) as HDKey
//         let keychain: PlatformVMKeyChain = new PlatformVMKeyChain('avax', 'P');
//         let pkHex: string = key.privateKey.toString('hex');
//         let pkBuf: Buffer = new Buffer(pkHex, 'hex');
//         let addr: PlatformVMKeyPair = keychain.importKey(pkBuf);
//         console.log(addr.getAddressString())
//     }
// }
// main()