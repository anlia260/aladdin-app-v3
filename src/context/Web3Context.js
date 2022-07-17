/* eslint-disable no-unreachable */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import Web3 from 'web3'
import { useContract } from 'hooks/useContracts'
import Web3Modal from 'web3modal'
// @ts-ignore
import WalletConnectProvider from '@walletconnect/web3-provider'
import CoinbaseWalletSDK from '@coinbase/wallet-sdk'
// import { createAlchemyWeb3 } from "@alch/alchemy-web3"
// @ts-ignore
// import Fortmatic from "fortmatic";
// import Torus from '@toruslabs/torus-embed'
import Authereum from 'authereum'
// import { useSelector } from 'react-redux'
// import { Bitski } from "bitski";
import abi from '../config/abi'
import config from '../config'
import { initWeb3, getContract } from '../utils/contract'
import { getETHPrice } from 'utils'

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: config.INFURA_ID,
      rpc: {
        [config.devRpcurl[0]]: config.devRpcurl[1],
      },
    },
  },
  coinbasewallet: {
    package: CoinbaseWalletSDK,
    options: {
      appName: 'Conentrator',
      infuraId: config.INFURA_ID,
      rpc: '',
    },
  },
  // torus: {
  //   package: Torus,
  // },
  authereum: {
    package: Authereum,
  },
  // see if we need it
  // fortmatic: {
  //   package: Fortmatic,
  //   options: {
  //     key: process.env.REACT_APP_FORTMATIC_KEY
  //   }
  // },
  // bitski: {
  //   package: Bitski,
  //   options: {
  //     clientId: process.env.REACT_APP_BITSKI_CLIENT_ID,
  //     callbackUrl: `${window.location.href}bitski-callback.html`
  //   }
  // }
}

let web3Modal = new Web3Modal({
  // network: NETWORK_NAME,
  cacheProvider: true,
  providerOptions,
  theme: { main: '#fff', secondary: '#fff', background: 'rgb(30,30,30)' },
})

export const Web3Context = React.createContext({
  web3: null,
  setWeb3: {},
  setCurrentAccount: {},
  currentAccount: config.defaultAddress,
  currentBlock: 0,
  currentChainId: 0,
  chainBalance: 0,
  aldBalance: 0,
  ctrBalance: 0,
  tokenPrice: {},
  connectWallet: async () => {},
  getChainBalance: async () => {},
  getErc20Balance: async () => {},
  getErc20BalanceInWei: async () => {},
  getTotalSupply: async () => {},
  resetAccount: async () => {},
  updateAldBalance: async () => {},
  updateChainBalance: async () => {},
})

export const Web3ContextProvider = ({ children }) => {
  const [web3, setWeb3] = useState('')
  const [provider, setProvider] = useState(null)
  const [onBlockListeners, setOnBlockListeners] = useState({})
  // eslint-disable-next-line no-unused-vars
  const [connected, setConnected] = useState(false)
  const [currentAccount, setCurrentAccount] = useState(config.defaultAddress)
  const [currentChainId, setCurrentChainId] = useState(0)
  const [currentBlock, setCurrentBlock] = useState('')
  // eslint-disable-next-line no-unused-vars
  const [currentNetworkId, setCurrentNetworkId] = useState(1)
  const [chainBalance, setChainBalance] = useState(0)
  const [aldBalance, setAldBalance] = useState(0)
  const [ctrBalance, setCtrBalance] = useState(0)
  const [tokenPrice, setTokenPrice] = useState({})
  // const theme = useSelector(state => state.settings.theme)
  const { INFURA_URL } = config
  // const web3_Alc = createAlchemyWeb3("https://eth-mainnet.alchemyapi.io/v2/NYoZTYs7oGkwlUItqoSHJeqpjqtlRT6m");
  const [web3Alc, setWeb3Alc] = useState(new Web3(INFURA_URL))
  // const [web3AlcAccount, setWeb3AlcAccount] = useState(web3_Alc)
  // web3Alc.eth.getAccounts().then(accounts => {
  //   setWeb3AlcAccount(accounts ? accounts[0] : null)
  // });

  const resetAccount = async () => {
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close()
    }
    await web3Modal.clearCachedProvider()
    setCurrentAccount(config.defaultAddress)
  }

  const subscribeProvider = async providerNew => {
    if (!providerNew.on) {
      return
    }
    providerNew.on('close', () => {
      resetAccount()
    })
    providerNew.on('accountsChanged', async accounts => {
      setCurrentAccount(accounts[0])
    })
    providerNew.on('chainChanged', chainId => {
      setCurrentChainId(parseInt(chainId, 16))
    })
  }

  const connectWallet = useCallback(async () => {
    // console.log('[context] connectWallet starts')

    // create web3Modal again, to update the theme according to localStorage
    web3Modal = new Web3Modal({
      cacheProvider: true,
      providerOptions,
      theme: { main: '#fff', secondary: '#fff', background: 'rgb(30,30,30)' },
    })

    try {
      const providerNew = await web3Modal.connect()

      await subscribeProvider(providerNew)

      const web3New = initWeb3(providerNew)
      setWeb3(web3New)
      // console.log('[context] set web3', web3New)

      const accounts = await web3New.eth.getAccounts()

      const address = accounts[0]
      setCurrentAccount(address)

      const networkId = await web3New.eth.net.getId()
      // console.log('setCurrentNetworkId', networkId)
      setCurrentNetworkId(networkId)

      const chainId = await web3New.eth.chainId()
      setCurrentChainId(chainId)
      // console.log('setCurrentChainId', chainId)

      setProvider(providerNew)
      setConnected(true)
    } catch (err) {
      const isDev = process.env.NODE_ENV === 'development'
      const { INFURA_URL } = config
      const _web3 = initWeb3(INFURA_URL)
      // setWeb3Alc(new Web3(INFURA_URL))
      setWeb3(_web3)
      const networkId = await _web3.eth.net.getId()
      // console.log('setCurrentNetworkId', networkId)
      setCurrentChainId(networkId)

      const chainId = await _web3.eth.chainId()
      setCurrentChainId(chainId)
    }
  }, [])

  useEffect(() => {
    if (connectWallet) {
      connectWallet()
    }
  }, [connectWallet])

  const getCurrentBlock = useCallback(async () => {
    let currentBlockData = 0
    try {
      currentBlockData = await web3.eth.getBlockNumber()
    } catch (e) {
      console.error(e)
    }
    return currentBlockData
  }, [web3])

  const updateCtrBalance = async () => {
    const tokenCRTContract = getContract(config.contracts.aladdinCTR, abi.AladdinCTRABI, web3, currentAccount)
    const res = await tokenCRTContract.methods.balanceOf(currentAccount).call()
    setCtrBalance(res)
  }

  useEffect(() => {
    if (web3 && currentAccount) {
      updateCtrBalance()
    }
  }, [web3, currentAccount])

  /* eslint-disable no-unreachable */
  /* eslint-disable no-await-in-loop */
  /* eslint-disable no-unused-vars */
  function pollingBlock() {
    let start = false
    let newBlock = 0
    let callMap = new Map()
    let stopTime // poll 事件 索引

    async function poll(isUpdate) {
      // 要优化 就是 用 wss
      try {
        const blockNumberChain = await web3.eth.getBlockNumber()
        const blockTime = await web3.eth.getBlock(blockNumberChain)
        console.log('blockTime--', blockTime.timestamp)
        // console.log('blockNumberChain----111---', blockNumberChain)
        if (newBlock < blockNumberChain || isUpdate) {
          // console.log(callMap.size)
          newBlock = blockNumberChain

          for (let [key] of callMap) {
            if (key instanceof Function) {
              key(newBlock)
            }
          }
        }
      } catch (error) {
        console.log(error.message) // 区块同步报错 通知客户端
      }

      if (start) {
        stopTime = setTimeout(poll, 3000)
      }
    }

    return {
      start(call) {
        if (!call) return

        if (start === false) {
          // console.log(call)
          start = true
          poll(true)
        }

        if (callMap.has(call)) return
        callMap.set(call, true)
      },

      remove(call) {
        if (!call) return

        if (callMap.has(call)) {
          callMap.delete(call)
        }

        if (callMap.size === 0) {
          start = false
          clearTimeout(stopTime)
        }
      },

      getNewBlock: () => newBlock,
    }
  }

  const getBlock = pollingBlock()

  return (
    <Web3Context.Provider
      value={{
        web3,
        web3Alc,
        setWeb3,
        connected,
        currentAccount,
        currentBlock,
        currentChainId,
        chainBalance,
        aldBalance,
        ctrBalance,
        tokenPrice,
        updateCtrBalance,
        connectWallet,
        resetAccount,
        getCurrentBlock,
        getBlock,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}
export const Web3ContextConsumer = Web3Context.Consumer
