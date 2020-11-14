# Testing Workflow

Before and after deploying a new build of AvalancheJS, manually run these tests and confirm everything is working properly.

## X-Chain

1. test-suite/x-chain/buildBaseTx-avax.ts
    * Send AVAX between two X-Addresses
2. test-suite/x-chain/buildCreateAssetTx-fixed-cap-asset.ts
    * Create a new secp fixed cap asset
3. test-suite/x-chain/buildBaseTx-secp.ts
    * Paste in the txid/assetid from step #2
    * Send SECP asset between two X-Addresses
4. test-suite/x-chain/buildCreateAssetTx-variable-cap-asset.ts
    * Create a new secp variable capped asset with a secp mint output
5. test-suite/x-chain/buildMintSecp
    * Paste in the txid/assetid from step #4
    * Mint more secp asset
6. test-suite/x-chain/buildCreateNFTAssetTx.ts
    * Create a new non fungible asset with an nft mint output
7. test-suite/x-chain/buildCreateNFTMintTx.ts
    * Paste in the txid/assetid from step #6
    * Mint a new non fungible asset with an nft transfer output
8. test-suite/x-chain/buildNFTTransferTx.ts
    * Paste in the txid/assetid from step #7
    * Transfer an NFT

## P-Chain

## C-Chain

## Import Tx

* codec id: 00 00
* type id: 00 00 00 00
* network id: 00 00 30 39
* blockchain id: 91 06 0e ab fb 5a 57 17 20 10 9b 58 96 e5 ff 00 01 0a 1c fe 6b 10 3d 58 5e 6e bf 27 b9 7a 17 35
* source chain: d8 91 ad 56 05 6d 9c 01 f1 8f 43 f5 8b 5c 78 4a d0 7a 4a 49 cf 3d 1f 11 62 38 04 b5 cb a2 c6 bf

* num imported inputs: 00 00 00 01
* imported inputs[0]:
* txid: 09 b1 44 1f d8 1f b5 6e 11 ff f8 92 3b 9b ae e5 cb a4 9d 51 07 b6 bb 77 8c 5c 38 16 2d fc a4 f3 
* utxo index: 00 00 00 01
* asset id: db cf 89 0f 77 f4 9b 96 85 76 48 b7 2b 77 f9 f8 29 37 f2 8a 68 70 4a f0 5d a0 dc 12 ba 53 f2 db
* type id: 00 00 00 05
* amount: 00 00 03 a3 52 a3 82 40
* num address indices: 00 00 00 01
* address indices: 00 00 00 00

* num outs: 00 00 00 01
* outs[0]:
* address: 8d b9 7c 7c ec e2 49 c2 b9 8b dc 02 26 cc 4c 2a 57 bf 52 fc
* amount: 00 00 03 a3 52 a3 82 40
* asset id: db cf 89 0f 77 f4 9b 96 85 76 48 b7 2b 77 f9 f8 29 37 f2 8a 68 70 4a f0 5d a0 dc 12 ba 53 f2 db

* num creds: 00 00 00 01
* cred[0]:
* type id: 00 00 00 09
* num sigs: 00 00 00 01
* sig[0]: a2 29 7f 49 64 b0 93 3a 96 4c a7 20 2d cc c3 9e 64 62 2e e9 a3 2d d3 ac 16 c3 97 af dc ab 52 38 2f 4a 6c d4 75 69 cd 58 76 32 25 11 c9 90 37 49 3d 46 45 a5 43 b4 c6 79 01 6a e3 eb 7b c6 f7 b4 01

## Export Tx:

* codec id: 00 00
* type id: 00 00 00 01
* network id: 00 00 30 39
* blockchain id: 91 06 0e ab fb 5a 57 17 20 10 9b 58 96 e5 ff 00 01 0a 1c fe 6b 10 3d 58 5e 6e bf 27 b9 7a 17 35
* destination chain: d8 91 ad 56 05 6d 9c 01 f1 8f 43 f5 8b 5c 78 4a d0 7a 4a 49 cf 3d 1f 11 62 38 04 b5 cb a2 c6 bf

* num inputs: 00 00 00 01
* input[0]:
* address: 8d b9 7c 7c ec e2 49 c2 b9 8b dc 02 26 cc 4c 2a 57 bf 52 fc
* amount: 00 00 01 d1 a9 68 a4 80
* asset id: db cf 89 0f 77 f4 9b 96 85 76 48 b7 2b 77 f9 f8 29 37 f2 8a 68 70 4a f0 5d a0 dc 12 ba 53 f2 db
* nonce 00 00 00 00 00 00 00 00

* num exported outputs: 00 00 00 01
* exported outputs[0]:
* asset id: db cf 89 0f 77 f4 9b 96 85 76 48 b7 2b 77 f9 f8 29 37 f2 8a 68 70 4a f0 5d a0 dc 12 ba 53 f2 db
* type id: 00 00 00 07
* amount: 00 00 01 d1 a9 59 62 40
* locktime: 00 00 00 00 00 00 00 00
* threshold: 00 00 00 01
* num addrs[0]: 00 00 00 01
* address: 3c b7 d3 84 2e 8c ee 6a 0e bd 09 f1 fe 88 4f 68 61 e1 b2 9c

* num creds: 00 00 00 01
* type id: 00 00 00 09
* num sigs: 00 00 00 01
* sigs[0]: 19 ea b0 70 bc b2 82 03 51 7f 3e 77 a4 15 49 9c b7 dd 06 29 c3 7a 7a b7 d0 00 fc 2b bc 8c 02 0c 11 0f 90 73 8a 2c 0b 7d f2 6c 5c ec 14 aa 4a a3 25 6e 47 9a 2e 83 96 08 8e 01 a4 0b 54 42 07 0e 01

## Questions for Stephen

* Base58 Check encoding. Did we follow a standard?
* Enable github daily dependency security audits and credentials check

## Apps that use avalanchejs

* wallet
* chainlink
* polyient
* magic
* telegram bot
* https://github.com/ava-labs/avalanchejs/network/dependents?package_id=UGFja2FnZS0xMzI1NjM1OQ%3D%3D


## URLs

* https://github.com/ava-labs/avalanchejs
* https://github.com/ava-labs/avalanche-postman-collection
* https://avalanche-tools.herokuapp.com/
* give url to utxo management for avm and platformvm
* https://github.com/ava-labs/avash

* codec id: 00 00 
* type id: 00 00 00 0c 
* network id: 00 00 00 01 
00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 
00 00 00 00 
00 00 00 01 c5 ac db a3 46 e8 0d 10 1c a0 e2 c1 d4 1b 9b c9 21 10 97 a6 5e d2 7d b3 3b 6c c9 d1 e0 86 56 04 00 00 00 00 21 e6 73 17 cb c4 be 2a eb 00 67 7a d6 46 27 78 a8 f5 22 74 b9 d6 05 df 25 91 b2 30 27 a8 7d ff 00 00 00 05 00 00 02 ba 7d ef 30 00 00 00 00 01 00 00 00 00 00 00 00 04 00 00 00 00 09 7f 48 0f d1 28 14 98 a6 10 a8 4c e4 a3 77 e2 c1 72 99 e3 00 00 00 00 5f 6d 7d c4 00 00 00 00 5f 7f f3 3c 00 00 02 ba 7d ef 30 00 00 00 00 01 21 e6 73 17 cb c4 be 2a eb 00 67 7a d6 46 27 78 a8 f5 22 74 b9 d6 05 df 25 91 b2 30 27 a8 7d ff 00 00 00 07 00 00 02 ba 7d ef 30 00 00 00 00 00 00 00 00 00 00 00 00 01 00 00 00 01 41 b9 12 46 ef fa aa fd 26 3e 0a d6 be 5c 94 d5 d3 68 b8 64 00 00 00 0b 00 00 00 00 00 00 00 00 00 00 00 01 00 00 00 01 41 b9 12 46 ef fa aa fd 26 3e 0a d6 be 5c 94 d5 d3 68 b8 64 00 03 0d 40 
00 00 00 01 
00 00 00 09 
00 00 00 01 
a5 02 48 d1 03 85 2b b1 4b ce 6c 00 b9 54 72 e8 b1 2c 8d 65 6b 0b 69 98 90 d6 f3 fa 73 ae 49 21 5c 54 b4 a0 24 7b 19 0e 35 46 b6 13 44 60 fc e8 df 1e d4 6a dd 06 46 43 b5 58 4f b5 43 87 6b a6 01