/* eslint no-underscore-dangle: 0 */
import Web3 from 'web3'
import { isAddress, AddressZero } from './index'
import WalletConnectProvider from '@walletconnect/web3-provider'
import config from 'config'
import abi from 'config/abi'

export function getContract(address, ABI, web3, currentAccount) {
  if (!isAddress(address, web3) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  if (!web3) return null

  return new web3.eth.Contract(ABI, address)
}
let web3;
function defaultProvider() {
  // console.log('config.devRpcurl[1]', config.devRpcurl[1])
  return new Web3.providers.HttpProvider(
    config.devRpcurl[1],
    // 'https://http-mainnet-node.huobichain.com',
    {
      ethereumNodeTimeout: 5000,
    }
  )
}

function initProvider() {
  let realProvider
  if (window.ethereum) {
    realProvider = window.ethereum
  }
  else if (window.web3) {
    realProvider = window.web3.currentProvider
  }
  else if (window.Web3) {
    realProvider = window.Web3.currentProvider
  }
  else {
    realProvider = defaultProvider()
  }
  return realProvider
}


// 初始化 web3
export function initWeb3(Provider) {
  // if (web3) return web3
  web3 = new Web3(Provider || initProvider());
  web3.eth.extend({
    methods: [
      {
        name: 'chainId',
        call: 'eth_chainId',
        outputFormatter: web3.utils.hexToNumber,
      },
    ],
  })

  web3.eth.transactionConfirmationBlocks = 1
  if (!web3.currentProvider || !web3.currentProvider.selectedAddress) {
    let user = web3.currentProvider?.accounts || null
    user = user ? user[0] : (web3.currentProvider.address || AddressZero);
    web3.currentProvider.selectedAddress = user
    web3.currentProvider.chainId = '0x1'
  }
  // setTimeout(() => {console.log(realProvider,'33')},1000)

  return web3
}
export async function multiCall(web3, currentAccount, ...methodsArr) {
  const multicallContract = getContract(config.contracts.multiCall, abi.multiCallABI, web3, currentAccount)
  const calls = []
  // console.log(methodsArr,'methodsArr')
  const decodeParametersType = []
  methodsArr.map(v => {
    calls.push([
      v._parent._address,
      v.encodeABI()
    ])
    decodeParametersType.push(
      v._method.outputs.map(v => v.type)
    )
  })
  // console.log({decodeParametersType})
  const res = await multicallContract.methods.aggregate(calls).call()
  // const web3 = initWeb3()
  return res[1].map((hex, i) => {
    const types = decodeParametersType[i]
    const oneType = types.length === 1
    return web3.eth.abi[oneType ? 'decodeParameter' : 'decodeParameters'](oneType ? types[0] : types, hex)
  })
}

export async function multiCallArr(web3, currentAccount, multiCallAddress, methodsArr, ...options) {
  const _multiCallAddress = multiCallAddress || config.contracts.multiCall;
  const multiCallContract = getContract(_multiCallAddress, abi.CrossChainMultiCallABI, web3, currentAccount)
  const calls = [];
  const len = methodsArr.length;

  for (let i = 0; i < len; i++) {
    const v = methodsArr[i];
    calls.push([v._parent._address, v.encodeABI()]);
  }

  const res = await multiCallContract.methods.aggregate(calls).call(...options);
  return res[1].map((hex, i) => {
    const v = methodsArr[i];
    const result = web3.eth.abi['decodeParameters'](v._method.outputs, hex);

    if (result.__length__ === 1) {
      return result[0];
    }
    return result;
  });
}

export function SendOn(methods, owner) {
  // let web3 = initWeb3()
  if (typeof owner === 'string') {
    owner = { from: owner }
  } else if (!owner) {
    owner = {
      from: methods._parent.options.from
    }
  }
  methods._parent.setProvider(web3.currentProvider)
  // console.log({owner})
  let pro = null
  // console.log(methods)
  const getHash = async () => {
    try {
      await methods.estimateGas(owner)
    } catch (err) {
      return {
        status: -1,
        data: err
      }
    }
    if (pro === null) pro = methods.send(owner)
    return new Promise((r, j) => {
      pro.on('transactionHash', function (hash) {
        // console.log({hash})
        r({
          status: 1,
          data: hash
        })
      })
      pro.on('error', function (err) {
        r({
          status: 0,
          data: null
        })
      })
    })
  }

  const confirmation = async () => {
    try {
      await methods.estimateGas(owner)
    } catch (err) {
      return {
        status: -1,
        data: err
      }
    }
    if (pro === null) pro = methods.send(owner)
    return new Promise((r, j) => {
      pro.on('confirmation', function (confirmationNumber, receipt) {
        // console.log({confirmationNumber, receipt})
        if (confirmationNumber > 1) {
          r({
            status: 1,
            data: receipt
          })
        }
      })

      pro.on('error', function (error, receipt) {
        if (error) {
          r({
            status: 0,
            data: error
          })
          return
        }
        if (receipt) {
          r({
            status: 1,
            data: receipt
          })
          // return
        }
      })
    })
  }


  return {
    getHash,
    confirmation,
    send: pro
  }
}
export default {
  getContract,
  initWeb3,
  SendOn,
  multiCall
}
