const Web3 = require('web3');
let web3 = new Web3("http://localhost:9650/ext/bc/C/rpc");

const main = async (): Promise<any> => {
  let account = await web3.eth.personal.newAccount();
  console.log(account)
  let unlock = await web3.eth.personal.unlockAccount(account)
  console.log(unlock)
  let price = await web3.eth.getGasPrice()
  console.log(price)

  // let txcount = await web3.eth.getTransactionCount('0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC')
  // console.log(txcount)
}
  
main()
