/* eslint-disable import/prefer-default-export */
import { useMemo, useContext } from 'react'
import config from '../config'
import abi from '../config/abi'
import { Web3Context } from 'context/Web3Context'
import { getContract, initWeb3 } from '../utils/contract'

// returns null on errors
export function useContract(address, ABI) {
  const { currentAccount, web3 } = useContext(Web3Context)
  return useMemo(() => {
    if (!address || !ABI || !web3) return null
    try {
      return getContract(address, ABI, web3, currentAccount)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, web3, currentAccount])
}