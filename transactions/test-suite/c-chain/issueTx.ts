import { 
  Avalanche
} from "avalanche"
import {
  EVMAPI
} from "avalanche/dist/apis/evm"
  
const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 12345
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const cchain: EVMAPI = avalanche.CChain()
  
const main = async (): Promise<any> => {
  const tx: string = "111119TRhWSfdBUPQq7hxhELyJucrru3AuLdBV11Su3JvbLj6sLKtDy7KMSRU9a5FfHLjuscARJxYJ6VouSLQpeYPb1yRH9UACDmmjoNQohQJyZP3kkaiL6iySn4FfGUFzaBCDQYWvGLhUW24pywJwwaY4HgzXNMPB567Gza8BPeAWkt3Ww1HmSY6FZGeipipWHeofu2zuN3zA5nohi8mTeqC7NMRMqq1NWVD4LP8p1yZE5Qwu2Vgy8aJrtQtjbreYgd1AM6VD5dj1ynFdg6s2iwVMrMLaD4qGXkYmcoRWVUZu7NQskJBVYpfmqhZJssZHFxVMgZDrUVB9pd5qMf8jcUrHnk5K2GJcZ2CjAAkAkSJaoBa6Rjw5dQrnyUYEernCoaKD3NvXq7Uqf9hAKpGsy4LEHwn74Sqccteo"
  const txid: any = await cchain.issueTx(tx)
  console.log(txid)
  console.log("----------------------------")
}
  
main()
