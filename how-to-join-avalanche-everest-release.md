# How to join Avalanche-Everest Release

_We just released the Everest release candidate for Avalanche, the final phase of testing before mainnet. We're nearly ready to share Avalanche with the world._

Avalanche features high-throughput (~5,000tps), fast finality (less than 2 seconds), and high resilience. In our recent incentivized testnet, Denali, we had over 1,000 full, block-producing validators participating in consensus.

## Stage 1 — Installing and Running Avalanche

Avalanche’s Gecko client has been tested to work with the following operating systems:

* Ubuntu 18.04 and 20.04
* OSX Catalina or higher

Minimum hardware requirements:

* CPU: 2 GHz
* RAM: 3 GB
* Storage: 250 MB free space
* The binaries are only compiled for x64, requires building from source yourself to make it work on other architectures

Recommended hardware:

* CPU: > 2 GHz
* RAM: > 3 GB
* Storage: > 5 GB free space on SSD
* The binaries are only compiled for x64, requires building from source yourself to make it work on other architectures

For the purpose of this tutorial, a utility called `curl` is used to make the API calls. Alternative options such as the tool [Postman](https://www.postman.com) are also commonly used to make API calls on the Avalanche network, however. While not a Gecko requirement, it is suggested to install this utility on your operating system to go through the tutorial verbatim.

* Download the latest Everest tar.gz (zip for osx) found here: [https://github.com/ava-labs/gecko/releases](https://github.com/ava-labs/gecko/releases)
* Unpack into a folder of our choosing:
  * Linux: `tar -xvf gecko-linux-<VERSION>.tar.gz`
  * OSX: `unzip gecko-osx-<VERSION>.zip`
* `cd <gecko_VERSION>`

Once we have extracted the files into a folder of our choosing, we will need simply need to open the directory in a command-line terminal, and type:

```bash
OSX and Linux
> ./avalanche
```

## Stage 2 — Staking Avalanche

To become a validator in the Avalanche network, one must first stake AVAX to the platform. For Everest, minimum staking amount is 10,000 nAVAX (nano-AVAX). This amount will not be the same as on Mainnet, but we set this threshold to a very reasonable amount to encourage as many enthusiasts to become validators.

The Avalanche platform currently employs basic RPC primitives to get work done. These types of primitives help users build transactions, sign transactions, send transactions, and maintain the node. In the future, these primitives will be abstracted on further to assist with basic duties, but for Everest we’re making sure these building blocks are functioning as expected.

### Step 1 — Create a User and Addresses

In order to become a validator, a user must be created. The following API call will create a user with the username and password we specify.

```bash
curl -X POST --data '{
     "jsonrpc": "2.0",
     "id": 1,
     "method": "keystore.createUser",
     "params": {
         "username": "YOUR USERNAME",
         "password": "YOUR PASSWORD"
     }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/keystore
```

Now that we have an account, we need to create an address on the X-Chain. This address will receive AVAX from the faucet

```bash
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"avm.createAddress",
    "params" :{
        "username": "YOUR USERNAME",
        "password": "YOUR PASSWORD"
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/bc/X
```

This will return a response as follows, which contains the address we just created. **We’ll need to jot down our X-Chain address as we’ll use it in later steps.**

```bash
{
    "jsonrpc": "2.0",
    "result": {
        "address": "YOUR X-CHAIN ADDRESS"
    },
    "id": 1
}
```

We also must create an address on the P-Chain using our user.


```bash
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.createAddress",
    "params": {
        "username": "YOUR USERNAME",
        "password": "YOUR PASSWORD"
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

This returns the P-Chain account. **We must jot this down as well, since we’ll use it in later steps.**

```bash
{
    "jsonrpc": "2.0",
    "result": {
        "address": "YOUR P-CHAIN ADDRESS"
    },
    "id": 1
}
```

### Step 2 — Acquire Funds

Alright! Now we have some accounts, let’s put some funds in them. To start, we’re going to get some funds from the [Avalanche Testnet Faucet](https://faucet.avax.network). We put our X-Chain address into the form, confirm we’re human, and request 20,000 nAVAX (nano-AVAX).

These funds should arrive in under 2 seconds. To verify that the funds are in our address, call the following function, replacing “YOUR X-CHAIN ADDRESS HERE” with the X-Chain address provided to the faucet.

```bash
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"avm.getBalance",
    "params" :{
        "address":"YOUR X-CHAIN ADDRESS HERE",
        "assetID"  :"AVAX"
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/bc/X
```

We will see the following response, confirming that we have received our AVAX.

```bash
{
    "jsonrpc": "2.0",
    "result": {
        "balance": "20000",
        "utxoIDs": [
            {
                "txID": "ZckGnBciWaRyDXiYcs9igvXjyMZH28cSrDVvpkBteHxhYEA3Z",
                "outputIndex": 0
            }
        ]
    },
    "id": 1
}
```

### Step 3 — Send it to the Platform

We’re funded! Now time to do something with it. To do this, we’re going to put AVAX from our X-Chain onto our P-Chain. The P-Chain controls all staker accounts and validator sets. It is where platform coordination occurs, and like the X-Chain, it is run by default across all nodes on the AVAX platform.

The API call “exportAVAX” begins a procedure on the local node to sign a transaction that can, in one step, transfer funds from the X-Chain to the P-Chain across the network. This is an atomic swap and every node will conduct it. Be sure to use the P-Chain address created in Step 1, **not** the X-Chain address. We’re going to send the Everest minimum staking amount — 10,000 nAVAX — to the P-Chain so that we can validate on the network.


```bash
curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"avm.exportAVAX",
    "params" :{
        "username": "YOUR USERNAME",
        "password": "YOUR PASSWORD",
        "to":"YOUR PLATFORM ADDRESS HERE",
        "amount": 10000
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/bc/X
```

This will return a TxID in the response. We do not need to retain this TxID and it can be ignored.

The next step is to accept this transfer on the P-Chain. To do this, we must pass our P-Chain address to the “importAVAX” method on the P-Chain, indicating that we’re accepting any AVAX sent to this address.

```bash
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.importAVAX",
    "params": {
        "username": "YOUR USERNAME",
        "password": "YOUR PASSWORD",
        "to":"YOUR PLATFORM ADDRESS HERE"
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/bc/P
```

This will return a TxID.


```bash
{
    "jsonrpc": "2.0",
    "result": {
        "TxID": "2i8QJNyTCx4ybr4V9LWsWNXNkVq6x9u5jYoAGvmGCbgQASvLfg"
    },
    "id": 1
}
```

That should be it! The P-Chain should have sufficient funds to stake and participate as a validator in the Everest testnet. To verify, we call getBalance on the P-Chain and verify the balance.

```bash
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.getBalance",
    "params":{
        "address":"YOUR PLATFORM ADDRESS HERE"
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/bc/P
```

### Stage 3 — Validation

Success! Now that we have funds on the P-Chain, we’re ready to register to become a validator on the network. Each node has a “nodeID” which is used to uniquely identify the node on the network. In order to become a validator, we need to commit this nodeID to be the node that does the work. The first thing to do, is to get our nodeID and **jot it down** so we can use it later.

```bash
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "info.getNodeID",
    "params":{},
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/info
```

The next step is to build a transaction that adds our nodeID to the network. In the below example, we’re putting a start time of 15 minutes from now, and we’re ending on August 15th, 2021.

__* Note: on OSX, you should use “$(gdate” instead of “$(date”. If you do not have “gdate” installed, execute “brew install coreutils” in your terminal.__

```bash
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.addDefaultSubnetValidator",
    "params": {
        "nodeID":"YOUR NODEID HERE",
        "rewardAddress":"YOUR PLATFORM ADDRESS HERE",
        "startTime":'$(date --date="15 minutes" +%s)',
        "endTime":1629032852,
        "stakeAmount":10000,
        "delegationFeeRate":0
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

This will return a TxID.


```bash
{
    "jsonrpc":"2.0",
    "id"     :1,
    "result" :{
        "TxID": "2hy1Bxsd1gmFpxzj2ZCJWfv1VJDwFNcReJJz6AfhPJLg3fPwYw"
    }
}
```

And that should be that! We should see ourselves in the list of pending validators now, and in 15 minutes we’ll be in the list of current validators!


```bash
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.getPendingValidators",
    "params": {},
    "id": 4
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.getCurrentValidators",
    "params": {},
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

## Tools Available

Now that we have a node set up locally, feel free to check out the other tools and resources available for Avalanche.

* [https://explorer.avax.network](https://explorer.avax.network)
* [https://faucet.avax.network](https://faucet.avax.network)
* [https://wallet.avax.network](https://wallet.avax.network)
* [https://docs.avax.network](https://docs.avax.network)
* [https://chat.avalabs.org](https://chat.avax.network)
* [https://github.com/ava-labs](https://github.com/ava-labs)

Have fun! And let everyone know in our Discord channel if you need assistance.
