import { useEffect, useState, useContext } from 'react'
import { Web3Context } from 'context/Web3Context'
import useWeb3 from 'hooks/useWeb3'
import { multiCall, getContract } from 'utils/contract'
import abis from 'config/abi'
import config from 'config'

const useTokens = (addresses, options) => {
  const { currentAccount, web3 } = useContext(Web3Context)
  const { getBlockNumber, checkChain, CHAINSTATUS } = useWeb3()
  const [tokenContracts, setTokenContracts] = useState([])
  const [tokenBalance, setTokenBalance] = useState([])

  const fetchUserInfo = async () => {
    try {
      const ethBalance = await web3.eth.getBalance(currentAccount)
      const tokenContracts = (addresses || [])
        .filter(i => i != config.zeroAddress)
        .map(address => getContract(address, abis.erc20ABI, web3, currentAccount))
      const calls = tokenContracts.map(i => i.methods.balanceOf(currentAccount))
      const res = await multiCall(web3, currentAccount, ...calls)

      const ethIndex = options.findIndex(i => i.address == config.zeroAddress)

      const list = res.map((i, index) => ({
        symbol: options.filter(i => i.address != config.zeroAddress)[index].symbol,
        balance: i,
      }))

      if (ethIndex > -1) {
        list.splice(ethIndex, 0, {
          symbol: 'eth',
          balance: ethBalance,
        })
      }

      setTokenBalance(list.map(i => i.balance))
      setTokenContracts(tokenContracts)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (checkChain == CHAINSTATUS["checkUser"]) {
      fetchUserInfo()
    }
  }, [web3, getBlockNumber()])

  return {
    tokenContracts,
    tokenBalance,
  }
}

export const useToken = (address, refreshTrigger, contractType) => {
  const { currentAccount, web3 } = useContext(Web3Context)
  const { getBlockNumber, checkChain, CHAINSTATUS } = useWeb3()
  const [token, setToken] = useState({
    balance: 0,
    allowance: 0,
  })

  const fetchUserInfo = async () => {
    try {
      if (address === config.zeroAddress) {
        const ethBalance = await web3.eth.getBalance(currentAccount)
        setToken({
          balance: ethBalance,
          allowance: ethBalance,
        })
      } else {
        let _contractAddress = config.contracts.convexVault;
        switch (contractType) {
          case 'vault':
            _contractAddress = config.contracts.convexVault;
            break;
          case 'vaultIFO':
            _contractAddress = config.contracts.concentratorIFOVault;
            break;
          case 'liquidity':
            _contractAddress = config.contracts.aladdinConcentratorLiquidityGauge;
            break;
          default:
            _contractAddress = config.contracts.convexVault;
            break;
        }
        const tokenContract = getContract(address, abis.erc20ABI, web3, currentAccount)
        const calls = [
          tokenContract.methods.balanceOf(currentAccount),
          tokenContract.methods.allowance(currentAccount, _contractAddress),
        ]
        const [balance, allowance] = await multiCall(web3, currentAccount, ...calls)

        setToken({
          balance,
          allowance,
          contract: tokenContract,
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (checkChain == CHAINSTATUS["checkUser"] && address) {
      fetchUserInfo()
    }
  }, [web3, getBlockNumber(), checkChain, refreshTrigger, address])

  return token
}

export default useTokens
