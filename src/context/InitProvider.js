import { useEffect, useContext, createContext, useState } from 'react'
import { cBN, getLPTokenPrice, getTokenPrice } from 'utils'
import axios from 'axios'
import config from 'config'
import { useDebounceEffect } from 'ahooks'
import abi from 'config/abi'
import useWeb3 from 'hooks/useWeb3'
import BALANCER from 'config/contract/BALANCER'
import VAULT from 'config/contract/VAULT'
import VAULTNEW from 'config/contract/VAULTNEW'
import { AllVaults, VAULT_LIST, VAULT_LIST_IFO } from 'config/convexVault'
import { multiCall, getContract } from 'utils/contract'
const groupByLength = (array, subGroupLength) => {
  var index = 0
  var newArray = []

  while (index < array.length) {
    newArray.push(array.slice(index, (index += subGroupLength)))
  }

  return newArray
}

const priceToken = (() => {
  const _tokenInf = config.TOKENS_INFO;
  let keys = []
  for (let key in _tokenInf) {
    if (_tokenInf[key][0]) {
      keys.push(_tokenInf[key][0])
    }
  }
  return keys.join(',')
})()

const INIT = {
  AllPool: AllVaults,
  AllPoolUserInfo: [],
  updateAllPoolData: () => { },
  updateAllPoolUserData: () => { },
}
export const Context = createContext(INIT)

const initApy = async () => {
  const json = await axios.get('https://concentrator-api.aladdin.club/apy/', { timeout: 2000 })
  localStorage.setItem('app.settings.apy', JSON.stringify(json.data))
}

const initPrice = async () => {
  await getTokenPrice(priceToken)
}

const getCtrCrvBalancer = async () => {
  const BalancerContract = BALANCER()
  const ctrCRV = await BalancerContract.methods.getPoolTokens(config.BalancerPools.CTRACRVPOOLS).call()
  console.log('ctrCRV---', ctrCRV)
  return ctrCRV
}

const useInitProvider = () => {
  const { web3, currentAccount, checkChain, CHAINSTATUS, web3Alc, getBlockNumber } = useWeb3()

  const [data, setData] = useState(INIT)

  const ifoSourceList = VAULT_LIST_IFO.filter(i => !i.isExpired).map(i => {
    i.isIfo = true
    return i
  })
  const oldVaultsList = VAULT_LIST.filter(i => !i.isExpired)

  const fetchAllPoolData = async arr => {
    const WEB3 = checkChain === CHAINSTATUS['checkWeb3'] ? web3Alc : web3
    const list = arr ?? AllVaults
    try {
      const basicCalls = list.map(i => {
        const contract = i.isIfo ? VAULTNEW() : VAULT()
        const { poolInfo } = contract.methods
        return poolInfo(i.id)
      })
      console.log('vaultlistdata => basicCalls.length', basicCalls.length)
      const allVaultsBasicInfo = await multiCall(WEB3, currentAccount, ...basicCalls)
      const lpPrice = await Promise.all(list.map(item => getLPTokenPrice(WEB3, item.tvlPriceTokenId)))

      const res = allVaultsBasicInfo.length > 0 ? allVaultsBasicInfo : AllVaults
      const listData = res.map((item, i) => {
        const { 0: totalUnderlying, 6: withdrawFeePercentage, 1: totalShare, 2: accRewardPerShare } = item || {
          0: 0, 6: 0, 1: 0, 2: 0
        }
        const lpTokenPrice = lpPrice[i]

        return {
          ...list[i],
          totalUnderlying,
          withdrawFeePercentage,
          totalShare,
          accRewardPerShare,
          lpTokenPrice,
          lpTokenPriceString: lpTokenPrice.toString(10)
        }
      })

      return listData
    } catch (error) {
      console.log(error)
      return AllVaults
    }
  }

  const updateAllPoolData = async triggerIndex => {
    console.log('accr => updateAllPoolData', triggerIndex, checkChain, currentAccount)
    if (checkChain && currentAccount && triggerIndex && triggerIndex.toString().includes('_')) {
      const index = triggerIndex.split('_')[1]
      const arr = [...AllVaults].splice(index, 1)
      console.log('accr', arr, AllVaults)
      const res = await fetchAllPoolData(arr)
      setData(prev => {
        const arr = [...prev.AllPool]
        arr.splice(index, 1, res[0])
        console.log('accr => result poolinfo', index, res[0], arr)
        return {
          ...prev,
          AllPool: arr,
        }
      })
    }
  }

  const fetchAllPoolUserData = async arr => {
    const WEB3 = checkChain === CHAINSTATUS['checkWeb3'] ? web3Alc : web3

    try {
      const list = arr ?? AllVaults
      const userCalls = list.map(i => {
        const contract = i.isIfo ? VAULTNEW() : VAULT()
        const tokenContract = getContract(i.stakeTokenContractAddress, abi.erc20ABI, web3, currentAccount)

        const { balanceOf, allowance } = tokenContract.methods
        const allowanceContractAddr = i.isIfo ? config.contracts.concentratorIFOVault : config.contracts.convexVault

        const { pendingReward, userInfo } = contract.methods
        return [
          balanceOf(currentAccount),
          allowance(currentAccount, allowanceContractAddr),
          pendingReward(i.id, currentAccount),
          userInfo(i.id, currentAccount),
        ]
      })
      const callList = userCalls.reduce((prev, cur) => [...prev, ...cur])
      const allVaultsUserInfo = await multiCall(WEB3, currentAccount, ...callList)
      const listData = groupByLength(allVaultsUserInfo, 4).map((item, i) => {
        const [userTokenBalance, userTokenAllowance, pendingReward, datainfo] = item
        const { 0: shares, 1: rewards, 2: rewardPerSharePaid } = datainfo
        return {
          id: list[i].id,
          name: list[i].name,
          isIfo: list[i].isIfo,
          pendingReward,
          userTokenBalance,
          userTokenAllowance,
          rewardPerSharePaid,
          rewards,
          shares,
          userInfo: { shares },
        }
      })
      return listData
    } catch (error) {
      console.log(error)
      return []
    }
  }

  const updateAllPoolUserData = async triggerIndex => {
    console.log('accr => triggerIndex', triggerIndex, checkChain, currentAccount)
    if (checkChain && currentAccount && triggerIndex && triggerIndex.toString().includes('_')) {
      const index = triggerIndex.split('_')[1]
      const arr = [...AllVaults].splice(index, 1)
      console.log('accr', arr, AllVaults)
      const res = await fetchAllPoolUserData(arr)
      setData(prev => {
        const arr = [...prev.AllPoolUserInfo]
        arr.splice(index, 1, res[0])
        console.log('accr => result userInfo', index, res[0], arr)
        return {
          ...prev,
          AllPoolUserInfo: arr,
        }
      })
    }
  }

  const [a, setA] = useState(false)
  const [b, setB] = useState(false)
  const [blockChangeTimes, setBlockChangeTimes] = useState(0)

  useEffect(() => {
    setBlockChangeTimes(prev => prev + 1)
  }, [getBlockNumber()])

  useEffect(() => {
    if (a & b) {
      console.timeEnd('vaultlistdata => initPool')
    }
  }, [a, b])

  useEffect(() => {
    if (data) {
      console.count('vaultlistdata => data changed')
      console.log('vaultlistdata:data', data)
    }
  }, [data])

  const initPoolData = async () => {
    console.time('vaultlistdata => fetchAllPoolData new')
    console.time('vaultlistdata => fetchAllPoolUserData')

    console.time('vaultlistdata => initPool')
    console.log('vaultlistdata => ifoSourceList.length', ifoSourceList.length)
    // fetchAllPoolData(ifoSourceList).then(newPools => {
    //   console.timeEnd('vaultlistdata => fetchAllPoolData new')
    //   console.log('vaultlistdata', oldVaultsList.length, newPools.length, newPools)
    //   setA(true)
    //   setData(prev => {
    //     return {
    //       ...prev,
    //       AllPool: [...oldVaultsList, ...newPools.filter(i => i.isIfo)], // TOTO may be call response.length != ifoSourceList.length
    //     }
    //   })
    //   console.time('vaultlistdata => fetchAllPoolData old')
    //   fetchAllPoolData(oldVaultsList).then(oldPools => {
    //     console.timeEnd('vaultlistdata => fetchAllPoolData old')
    //     setA(true)
    //     setData(prev => {
    //       return {
    //         ...prev,
    //         AllPool: [...oldPools, ...newPools],
    //       }
    //     })
    //   })
    // })

    fetchAllPoolData(AllVaults).then(newPools => {
      console.timeEnd('vaultlistdata => fetchAllPoolData new')
      console.log('vaultlistdata', oldVaultsList.length, newPools.length, newPools)
      setA(true)
      setData(prev => {
        return {
          ...prev,
          AllPool: newPools,
        }
      })
    })
    fetchAllPoolUserData().then(res => {
      console.timeEnd('vaultlistdata => fetchAllPoolUserData')
      console.log('vaultlistdata => res', res)
      setB(true)
      setData(prev => {
        return {
          ...prev,
          AllPoolUserInfo: res,
        }
      })
    })
  }

  useDebounceEffect(
    () => {
      if (checkChain && blockChangeTimes != 2) {
        console.log('vaultlistdata : doit initPoolData', blockChangeTimes)
        initPoolData()
      }
    },
    [blockChangeTimes, checkChain],
    {
      wait: 20000,
      leading: false,
    },
  )

  useEffect(() => {
    if (checkChain) {
      console.time('vaultlistdata => fetchAllPoolData new change')
      fetchAllPoolData(AllVaults).then(newPools => {
        console.timeEnd('vaultlistdata => fetchAllPoolData new change')
        // console.log('vaultlistdata', oldVaultsList.length, newPools.length, newPools)
        setA(true)
        setData(prev => {
          return {
            ...prev,
            AllPool: newPools,
          }
        })
      })
    }
  }, [checkChain])

  useEffect(() => {
    if (checkChain && currentAccount) {
      console.time('vaultlistdata => fetchAllPoolUserData change')
      fetchAllPoolUserData().then(res => {
        console.timeEnd('vaultlistdata => fetchAllPoolUserData change')
        console.log('vaultlistdata => res', res)
        setB(true)
        setData(prev => {
          return {
            ...prev,
            AllPoolUserInfo: res,
          }
        })
      })
    }
  }, [checkChain, currentAccount])

  const updateCtrCrvBalancer = async () => {
    const res = await getCtrCrvBalancer()
    console.log('updateCtrCrvBalancer---', res)
    setData(prev => {
      return {
        ...prev,
        ctrCrvBalancer: res,
      }
    })
  }

  useEffect(async () => {
    initApy()
    initPrice()
    console.time('vaultlistdata => component did mount')
    const res = await getCtrCrvBalancer()
    console.timeEnd('vaultlistdata => component did mount')
    setData(prev => {
      return {
        ...prev,
        ctrCrvBalancer: res,
      }
    })
  }, [])

  return {
    ...data,
    updateAllPoolData,
    updateAllPoolUserData,
    updateCtrCrvBalancer
  }
}

const InitProvider = ({ children }) => {
  const data = useInitProvider()
  return <Context.Provider value={data}>{children}</Context.Provider>
}

export default InitProvider

export const useInit = () => useContext(Context)
