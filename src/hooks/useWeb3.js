import { useContext, useState, useEffect, useRef, useMemo } from 'react'
import { Web3Context } from '../context/Web3Context'
import config from 'config'

function useWeb3() {
  // const [newBlock, setNewBlock] = useState(null)
  // const callRef = useRef(null);
  const [_, reLoad] = useState(true)

  const callRef = useRef(() => {
    // 这里会执行两次
    return getBlock.getNewBlock()
  })
  const {
    web3,
    web3Alc,
    web3AlcAccount,
    setWeb3,
    connected,
    currentAccount,
    currentBlock,
    currentChainId,
    chainBalance,
    aldBalance,
    connectWallet,
    getChainBalance,
    getErc20Balance,
    getErc20BalanceInWei,
    getTotalSupply,
    resetAccount,
    addOnBlockListener,
    removeOnBlockListener,
    updateChainBalance,
    updateCtrBalance,
    updateAldBalance,
    getCurrentBlock,
    getBlock,
    tokenPrice,
  } = useContext(Web3Context)

  const checkAllowsChains = useMemo(() => {
    if (config.ALLOWS_CHAINS.indexOf(currentChainId) > -1) {
      return true
    }
    return false
  }, [currentChainId])

  const checkChain = useMemo(() => {
    // const chainId = await web3.eth.getChainId()
    // console.log('chainId---', chainId)
    // console.log('web3 && currentAccount && currentChainId', connected, currentAccount, currentChainId, config.CHAIN_ID)
    let _status = config.NET_STATUS['err']
    if (web3Alc) {
      _status = config.NET_STATUS['err']
      // _status = config.NET_STATUS["checkWeb3"];
    }
    if (web3 && connected && currentChainId == config.CHAIN_ID) {
      _status = currentAccount != config.defaultAddress ? config.NET_STATUS['checkUser'] : config.NET_STATUS['checkNetWork']
    }
    return _status
  }, [web3, connected, currentAccount, currentChainId])

  let getBlockNumber = () => {
    // 这里会执行两次
    return callRef.current()
  }

  // effect 是最后才执行的
  useEffect(() => {
    // 这里 只执行 1 次
    const oldCall = () => reLoad(v => !v)
    callRef.current = () => {
      getBlock.start(oldCall)
      return getBlock.getNewBlock()
    }
    // 激活
    oldCall()
    return () => {
      getBlock.remove(oldCall)
    }
  }, [currentChainId])

  const getChainInfoByChainId = chainId => {
    const chainObj = config.ChainsInfo[chainId]
    return chainObj ? chainObj : {}
  }

  const getChainInfoByChainName = chainName => {
    let chainInfo = {}
    for (let key in config.ChainsInfo) {
      // console.log(config.ChainsInfo[key].chainName, chainName, config.ChainsInfo[key].shortName.toLocaleLowerCase().indexOf(chainName.toLocaleLowerCase()))
      if (config.ChainsInfo[key].shortName.toLocaleLowerCase().indexOf(chainName.toLocaleLowerCase()) > -1) {
        chainInfo = config.ChainsInfo[key]
        break
      }
    }
    return chainInfo
  }

  return {
    web3,
    web3Alc,
    web3AlcAccount,
    setWeb3,
    checkChain,
    CHAINSTATUS: config.NET_STATUS,
    currentAccount,
    currentBlock,
    currentChainId,
    chainBalance,
    aldBalance,
    connectWallet,
    getChainBalance,
    getErc20Balance,
    getErc20BalanceInWei,
    getTotalSupply,
    resetAccount,
    addOnBlockListener,
    removeOnBlockListener,
    updateCtrBalance,
    updateChainBalance,
    updateAldBalance,
    getCurrentBlock,
    getBlockNumber,
    tokenPrice,
    checkAllowsChains,
    getChainInfoByChainId,
    getChainInfoByChainName,
  }
}

export default useWeb3
