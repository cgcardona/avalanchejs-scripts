import {
  UTXOSet as AVMUTXOSet
} from "avalanche/dist/apis/avm"

import {
  UTXOSet as EVMUTXOSet
} from "avalanche/dist/apis/evm"

export interface AVMU {
  numFetched: number
  utxos: AVMUTXOSet
  endIndex: {
    address: string
    utxo: string
  }
}

export interface EVMU {
  numFetched: number;
  utxos: EVMUTXOSet;
  endIndex: {
      address: string;
      utxo: string;
  };
}