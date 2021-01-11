import { 
  Avalanche, 
  BinTools, 
  BN 
} from "avalanche"
import { Buffer } from 'buffer/'
import { 
  AVMAPI, 
  KeyChain, 
  TransferableInput,
  TransferableOutput,
} from "avalanche/dist/apis/avm"
import { MetricsAPI } from "avalanche/dist/apis/metrics"
import { RESTAPI } from "avalanche/dist/common"

const ip: string = "localhost"
const protocol: string = "http"
const networkID: number = 12345
const port: number = 9650
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const metrics: MetricsAPI= avalanche.Metrics()
avalanche.addAPI('rest', RESTAPI);
// const rest: RESTAPI = avalanche.RE()

const main = async (): Promise<any> => {
  const m: string = await metrics.getMetrics()
  RESTAPI
  console.log(m)
}
  
main()
