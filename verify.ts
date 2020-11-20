// import { BinTools, Buffer } from "avalanche"
// import { KeyPair } from "avalanche/dist/apis/avm"
// import { getPreferredHRP } from "avalanche/dist/utils"
// const createHash = require('create-hash')

// const main = async (): Promise<any> => {
//   const hrp: string = getPreferredHRP(12345)
//   const blockchainID: string = "X" 
//   const keypair: KeyPair = new KeyPair(hrp, blockchainID)
//   const bintools: BinTools = BinTools.getInstance()

//   const addy: string = "X-local18jma8ppw3nhx5r4ap8clazz0dps7rv5u00z96u"
//   const message: string = "Gabriel"
//   const buff: Buffer = Buffer.from(message, "utf8");
//   const msg: Buffer = createHash('sha256').update(buff).digest();
//   const signatureStr: string = "2oWf4woxH2XJ5AGxaZeuq4qY6NqkWTfMSrvU3jeTatVCx3FkyH8V52PnJcbEpN56UQdcAdxp6SWR8EAkPJXgTNTTYJg7cmF"
//   const sig: Buffer = bintools.cb58Decode(signatureStr)
//   const pubkey: Buffer = keypair.recover(msg, sig)
//   const addressBuff: Buffer = keypair.addressFromPublicKey(pubkey)
//   const address: string = bintools.addressToString(hrp, "X", addressBuff)
//   console.log(addy === address)
// }
  
// main()
// o