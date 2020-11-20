import {
  UTXOSet as AVMUTXOSet
} from "avalanche/dist/apis/avm"

import {
  UTXOSet as PlatformVMUTXOSet
} from "avalanche/dist/apis/platformvm"

import {
  UTXOSet as EVMUTXOSet
} from "avalanche/dist/apis/evm"

export interface EndIndex {
  address: string,
  utxo: string
}

export interface VMU {
  numFetched: number
  endIndex: EndIndex
  encoding: string
}

export interface AVMU extends VMU {
  utxos: AVMUTXOSet
}

export interface PlatformVMU extends VMU {
  utxos: PlatformVMUTXOSet
}

export interface EVMU {
  numFetched: number;
  utxos: EVMUTXOSet;
  endIndex: EndIndex
}