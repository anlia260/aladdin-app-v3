import { useEffect, useState } from 'react'
import config from 'config'
import { getLPTokenPrice } from 'utils'
import abi from 'config/abi'
import useWeb3 from 'hooks/useWeb3'
import { multiCall, getContract } from 'utils/contract'
import { AllVaults } from 'config/convexVault'
import VAULT from 'config/contract/VAULT'
import VAULTNEW from 'config/contract/VAULTNEW'

const groupByLength = (array, subGroupLength) => {
  var index = 0;
  var newArray = [];

  while (index < array.length) {
    newArray.push(array.slice(index, index += subGroupLength));
  }

  return newArray;
}


/**
 * @description get all vaults baice info
 * @param {*} refreshTrigger
 * @returns arr[poolinfo]
 */
export const useAllVaultsBaicInfo = ({ refreshTrigger }) => {
  const { web3, currentAccount, checkChain, CHAINSTATUS, web3Alc, getBlockNumber } = useWeb3()
  const [data, setData] = useState(AllVaults)

  const fetchAllPoolData = async (arr) => {
    const WEB3 = checkChain === CHAINSTATUS["checkWeb3"] ? web3Alc : web3;

    const list = arr ?? AllVaults
    try {
      const basicCalls = list.map(i => {
        const contract = i.isIfo ? VAULTNEW() : VAULT()
        const { poolInfo } = contract.methods
        return poolInfo(i.id)
      })
      console.log('fetchAllPoolData------1')
      const allVaultsBasicInfo = await multiCall(WEB3, currentAccount, ...basicCalls)
      const lpPrice = await Promise.all(list.map(item => getLPTokenPrice(WEB3, item.tvlPriceTokenId)))

      console.log('fetchAllPoolData------2')
      const listData = allVaultsBasicInfo.map((item, i) => {

        const { 0: totalUnderlying, 6: withdrawFeePercentage, 1: totalShare, 2: accRewardPerShare } = item
        const lpTokenPrice = lpPrice[i]

        return {
          ...list[i],
          totalUnderlying,
          withdrawFeePercentage,
          totalShare,
          accRewardPerShare,
          lpTokenPrice,
        }
      })
      return listData
    } catch (error) {
      console.log(error)
      return []
    }
  }

  useEffect(async () => {
    if (checkChain) {
      const res = await fetchAllPoolData()
      setData(res)
    }
  }, [getBlockNumber(), checkChain])

  useEffect(async () => {
    if (checkChain && refreshTrigger && refreshTrigger.toString().includes('_')) {
      const index = refreshTrigger.split('_')[1]
      const res = await fetchAllPoolData([...AllVaults].splice(index, 1))
      setData(prev => {
        const arr = [...prev]
        arr.splice(index, 1, res[0])
        return arr
      })
    }
  }, [checkChain, refreshTrigger])

  return data
}

/**
 * @description get all vaults user info
 * @param {*} refreshTrigger
 * @returns arr[userinfo]
 */
export const useAllVaultsUserInfo = ({ refreshTrigger }) => {
  const { web3, currentAccount, checkChain, CHAINSTATUS, web3Alc, getBlockNumber } = useWeb3()
  const [data, setData] = useState(AllVaults)

  const fetchAllPoolUserData = async (arr) => {
    const WEB3 = checkChain === CHAINSTATUS["checkWeb3"] ? web3Alc : web3;

    try {
      const list = (arr ?? AllVaults)
      const userCalls = list.map(i => {
        const contract = i.isIfo ? VAULTNEW() : VAULT()
        const tokenContract = getContract(i.stakeTokenContractAddress, abi.erc20ABI, web3, currentAccount)

        const { balanceOf, allowance } = tokenContract.methods
        const allowanceContractAddr = i.isIfo ? config.contracts.concentratorIFOVault : config.contracts.convexVault

        const { pendingReward, userInfo } = contract.methods
        return [balanceOf(currentAccount), allowance(currentAccount, allowanceContractAddr), pendingReward(i.id, currentAccount), userInfo(i.id, currentAccount),]
      })

      const allVaultsUserInfo = await multiCall(WEB3, currentAccount, ...userCalls.reduce((prev, cur) => [...prev, ...cur], []))
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
          userInfo: { shares }
        }
      })
      return listData
    } catch (error) {
      console.log(error)
      return []
    }
  }

  useEffect(async () => {
    if (checkChain && currentAccount) {
      const res = await fetchAllPoolUserData()
      setData(res)
    }
  }, [getBlockNumber(), checkChain, currentAccount])

  useEffect(async () => {
    if (checkChain && currentAccount && refreshTrigger && refreshTrigger.toString().includes('_')) {

      const index = refreshTrigger.split('_')[1]
      const res = await fetchAllPoolUserData([...AllVaults].splice(index, 1))
      setData(prev => {
        const arr = [...prev]
        arr.splice(index, 1, res[0])
        return arr
      })
    }
  }, [getBlockNumber(), checkChain, currentAccount, refreshTrigger])


  return data
}


export default useAllVaultsBaicInfo
