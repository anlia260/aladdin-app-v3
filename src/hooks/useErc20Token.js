import { useEffect, useState, useContext } from 'react'
import { Web3Context } from 'context/Web3Context'
import useWeb3 from 'hooks/useWeb3'
import { multiCall } from 'utils/contract'
import abis from 'config/abi'
import { useContract } from 'hooks/useContracts'


const useErc20Token = (refreshTrigger, tokenAddr, approveForAddr) => {
  const { currentAccount, web3 } = useContext(Web3Context)
  const { getBlockNumber, checkChain } = useWeb3()
  const [tokenInfo, setTokenInfo] = useState({ balance: 0, allowance: 0, })


  const tokenContract = useContract(tokenAddr, abis.erc20ABI)

  const fetchTokenInfo = async () => {
    const { balanceOf: tokenBalanceOf, allowance: tokenAllowance } = tokenContract.methods
    try {
      const calls = [
        tokenBalanceOf(currentAccount),
        tokenAllowance(currentAccount, approveForAddr),
      ]
      const [
        balance,
        allowance,
      ] = await multiCall(web3, currentAccount, ...calls)

      console.log('meta >-- token info => ', balance, allowance);
      setTokenInfo({ balance, allowance })
    } catch (error) {
      console.log(error)
    }

  }

  useEffect(() => {
    if (checkChain) {
      fetchTokenInfo()
    }
  }, [web3, getBlockNumber(), checkChain, refreshTrigger])

  return {
    tokenContract,
    tokenInfo
  }
}


export default useErc20Token
