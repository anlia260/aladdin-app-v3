/* eslint-disable import/prefer-default-export */
import { useMemo, useContext } from 'react'
import { getContract, initWeb3 } from '../utils/contract'

let cache = {};
export function useContract(address, ABI) {
  const web3 = initWeb3();
  const owner = web3.currentProvider.selectedAddress;
  let contract = cache[address];
  if (cache[address]) {
    if (contract.options.from !== owner) {
      contract.options.from = owner;
    }
    return contract;
  }
  contract = new web3.eth.Contract(ABI);
  contract.options.address = address;
  if (owner) {
    contract.options.from = owner;
  }

  cache[address] = contract;
  return contract;
}