// // imports
// import {
//   Avalanche,
//   AVM,
//   Metrics 
// } from "avalanche" 

// // the goods
// const main = async (): Promise<any> => {
//   const ip: string = "localhost"
//   const port: number = 9650
//   const protocol: string = "http"
//   const networkID: number = 12345
//   const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID)

//   const avm: AVM = avalanche.AVM()
//   const metrics: Metrics = new Metrics(avalanche)
//   const m: string = await metrics.getMetrics()
//   console.log(`Metrics: ${m}`)
// }
// main()
