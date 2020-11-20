// import { Avalanche} from "avalanche"
// let myNetworkID = 5; //default is 3, we want to override that for our local network
// let myBlockchainID = "X"; // The X-Chain blockchainID on this network
// const avalanche: Avalanche = new Avalanche("localhost", 9650, "http", myNetworkID, myBlockchainID)
// let xchain = avalanche.XChain();

// let addresscheck = ['X-fuji1gkw5z7qw0fn49xn875uyfd9hhcw9fctddvkdru']
// getUTXOs(addresscheck);

// async function getUTXOs(addresscheck: string[])
// {
//   let u = await xchain.getUTXOs(addresscheck);
//   let utxos = u.utxos
//   console.log("Checking utxos: ", utxos);
//   let sendAmount = new BN(100);

//   let assetid = "U8iRqJoiJm8xZHAacmvYyZVwqQx6uDNtQeP3CQ6fcgQk3JqnK"; //avaSerialized string
//   let friendsAddress = "X-fuji1acx2e6drpwkyuy5dtfqxt65vygtxd4xse60lwk";
//   let unsignedTx = await xchain.buildBaseTx(utxos, sendAmount, assetid, [friendsAddress], addresscheck, addresscheck);
// }