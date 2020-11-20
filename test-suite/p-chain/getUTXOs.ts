import { 
  Avalanche
} from "avalanche"
import {
  PlatformVMAPI,
  UTXOSet
} from "avalanche/dist/apis/platformvm"
import { PlatformVMU } from '../common/interfaces'
  
const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 12345
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const pchain: PlatformVMAPI = avalanche.PChain()

const main = async (): Promise<any> => {
  const utxosArray: string[] = [
    '11111111111111111111111111111111111111Gg5hxWRn7AAYPdHT6M1pXse6as74NPRMhX61CfMRde6rPaEjLcjrSCozp8iqckBbjt1D68aPc2FgrPDfwNsDgkf1bgcZjmBErFF2TL4rFXQam46mbuS',
    '11111111111111111111111111111111111113puUpkGWuui7cBaw9SkegT1215qd4gDbbs8GJmCVkb8SAiNQiDxEiioKSYGGz2S8kCK4BUf8DUieYUpFYF5hCDH1XqTGkEPiY29XEYk1aNrKfTvShDCWrjokcTDRiZjBxe7N',
    "11111111111111111111111111111111111111Gg5hxWRn7AAYPdHT6M1pXse6as74NPRMhX61CfMRde6rPaEjLcjrSCozpCzeLNhvai3Zi4k1jGzBVUZxu7syH8SXEstGnCenC7DHy2N6e9MANNkaRT1",
    "11111111111111111111111111111111111113puUpkGWuui7cBaw9SkegT1215qd4gDbbs8GJmCVkb8SAiNQiDxEiioKSYGGz2S8kCK4KByxBc7X9PG5tZsmKAHz47o56hmMsizmf22Lk6LkM4za1EF7h9AyRDVeiNm2Sbi6",
    "11111111111111111111111111111111111111Gg5hxWRn7AAYPdHT6M1pXse6as74NPRMhX61CfMRde6rPaEjLcjrSCozpHGT41EFRY5vKzudrXig8ZvFrrtisWE2t59ype8KXyBZUifM2mHjydefLYz",
    "11111111111111111111111111111111111113puUpkGWuui7cBaw9SkegT1215qd4gDbbs8GJmCVkb8SAiNQiDxEiioKSYGGz2S8kCK4SuJn9jWPkHhvEtfqS7JxaQ8sTB91DRr25VJfuoqB2g4hKFHiXYYCDymsiBjtvmLM"
  ] 
  console.log(utxosArray)
  let foo = 'bar'
  // const sourceChain: string = "P"
  // const newUTXOs: UTXOSet = new UTXOSet()
  // // console.log(newUTXOs)
  // newUTXOs.addArray(utxosArray)
  // console.log(newUTXOs.getAllUTXOStrings())
  // const address: string = `${sourceChain}-local18jma8ppw3nhx5r4ap8clazz0dps7rv5u00z96u`
  // const platformvmu: PlatformVMU = await pchain.getUTXOs(address, sourceChain)
  // const utxos: UTXOSet = platformvmu.utxos
  // console.log(utxos.getAllUTXOStrings())
  // console.log("----------------------------")
}
  
main()
