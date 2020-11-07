import { BinTools } from "avalanche"
import {
  UnsignedTx as PlatformVMUnsignedTx,
} from "avalanche/dist/apis/platformvm";

const bintools: BinTools = BinTools.getInstance()

const main = async (): Promise<any> => {
  let unsignedTx = new PlatformVMUnsignedTx() 
  let txStr = "111113zAwixEcdaRJgRtdyfjzdbRgntU39vVm4d37x61P2XUDi76vPDsDczwAUSL3MwKAr22g7DmEDjasnLR5bS4PaWFgR493KH62nVDUyuU5tiSLACtgVceJNeZzZbW5FGVmkRQHMYF4FnVF8QoMswV3jJq3jxEGbkj6Aczrd7dNqC34gg3FVhavnntT7sGVEnSFXvQw8reokcAqFwifiwGzPNPLxKagCr35ieL9nZUqdc7gU2CQRhKEHp4UyVA4Gmon1efFpin5Q33AdPApwMbb6y2Z94nXcDFG9r4cDZMDwiSgzHEJBZpiJDNwtAVkynbtznY9SXbZbrZf5u4rsXhfabGymN6zj1kWXZ1JRnMGFUXsRdoQ594CHAveuGPkVDN1zLFj5bVbLV7mvi6rRgK22r5wuwXv2u8Hy5o6F3vd1gibo1NDYjazdufcZx8eUD5QNyFnwjTa37UxN387W6n9tjyoNa3P8XMvmBFRZDSoiAHv9WHo1sM5nYDNBRLp23Deo1rkKSQChvAPr1ZJqtXVWBVUeFKexee5d9gTK6L6F8jJhJPpURU4q63XBXRQW9xJSQLJ5cfkc44z37axWoGXhjtAFss5oND6BzwWYkXrYcnGY83eywUJt4SiSf2Ssdq94oMNm6uGnSvQTH1wzLvSvvb8VrMK7prnuD996M4BG8PBCecqcBU"
  let decoded = bintools.cb58Decode(txStr)
  unsignedTx.fromBuffer(decoded)
  let serialized: any = unsignedTx.serialize("display")
//   console.log(JSON.stringify(serialized))
  console.log(serialized.transaction.outs)
  console.log(serialized.transaction.outs[0].output.transferableOutput)
  console.log(serialized.transaction.outs[0].output.transferableOutput.output.addresses)
//   console.log(unsignedTx.toBuffer().toString('hex'))
}
  
main()

