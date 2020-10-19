import { Avalanche, BinTools, BN } from "avalanche"
import { Buffer } from 'buffer/'
import { 
  AVMAPI, 
  AVMKeyChain, 
  TransferableInput,
  TransferableOutput,
} from "avalanche/dist/apis/avm"
import { MetricsAPI } from "avalanche/dist/apis/metrics"

const ip: string = "localhost"
const protocol: string = "http"
const networkID: number = 12345
const port: number = 9650
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)
const metrics: MetricsAPI= avalanche.Metrics()

const main = async (): Promise<any> => {
  const m = await metrics.getMetrics()
  console.log(m)
}
  
main()
