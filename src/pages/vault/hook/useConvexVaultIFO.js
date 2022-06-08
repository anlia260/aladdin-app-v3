import { useEffect, useState } from 'react'
import { cBN, getLPTokenPrice, getTokenPrice } from 'utils'
import config from 'config'
import abi from 'config/abi'
import useWeb3 from 'hooks/useWeb3'
import { multiCall } from 'utils/contract'
import useACrv from './useACrv'
import { useContract } from 'hooks/useContracts'
import { VAULT_LIST_IFO } from 'config/convexVault'
import useStatus from './useStatus'
import NoPayableAction, { noPayableErrorAction } from 'utils/noPayableAction'

let ctime = 0
const useConvexVaultIFO = refreshTrigger => {
  const { web3, currentAccount, checkChain, CHAINSTATUS, web3Alc, getBlockNumber } = useWeb3()
  const { acrvInfo } = useACrv()
  const [ConvexVaultIFOInfo, setConvexVaultIFOInfo] = useState({ listInfo: VAULT_LIST_IFO, totalInfo: { tvl: 0 } })
  const convexVaultsIFOContract = useContract(config.contracts.concentratorIFOVault, abi.AladdinConcentratorContVaultABI)
  const { ifoInfo } = useStatus()

  const [poolList, setPoolList] = useState(VAULT_LIST_IFO)
  const [harvestList, setHarvestList] = useState([])
  const [convexVaultIFOTvl, setConvexVaultIFOTvl] = useState(0)

  const harvestVault = async pid => {
    const reward = await convexVaultsIFOContract.methods.harvest(pid, currentAccount, 0).call({ from: currentAccount, gas: 5000000 })
    if (reward * 1) {
      const _reward = cBN(reward)
        .multipliedBy(9)
        .div(10)
        .toFixed(0)
      const apiCall = await convexVaultsIFOContract.methods.harvest(pid, currentAccount, _reward)
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 'harvestVault',
        action: 'harvest',
      })
      return true
    }
  }

  const fetchPriceData = async () => {
    const priceToken =
      'curve-dao-token,convex-crv,frax-share,ethereum,staked-ether,frax,lp-3pool-curve,usd-coin,bitcoin,convex-finance,wrapped-steth,rocket-pool-eth,terrausd-wormhole,convex-crv,renbtc,wrapped-bitcoin'
    const _price = await getTokenPrice(priceToken)
    return _price
  }

  const fetchAllPoolData = async () => {
    let _web3 = web3;
    if (checkChain === CHAINSTATUS["checkWeb3"]) {
      _web3 = web3Alc
    }
    try {
      const poolContracts = VAULT_LIST_IFO.map(({ id }) => convexVaultsIFOContract.methods.poolInfo(id))
      const lpList = await multiCall(_web3, currentAccount, ...poolContracts)
      const lpPrice = await Promise.all(VAULT_LIST_IFO.map(item => getLPTokenPrice(_web3, item.tvlPriceTokenId)))

      const lpData = lpList.map((item, i) => {
        const { 0: totalUnderlying, 6: withdrawFeePercentage, 1: totalShare, 2: accRewardPerShare } = item
        return {
          ...item,
          ...VAULT_LIST_IFO[i],
          lpTokenPrice: lpPrice[i],
          totalUnderlying,
          withdrawFeePercentage,
          totalShare,
          accRewardPerShare,
        }
      })
      // console.log('lpData----ifo----', lpData)
      return lpData
    } catch (e) {
      return []
    }
  }

  const getPoolDataById = poolId => {
    return ConvexVaultIFOInfo.find(item => item.id === poolId)
  }

  useEffect(async () => {
    if (checkChain) {
      const crvPrice = await getTokenPrice('convex-crv')
      const listData = await fetchAllPoolData()
      const totalTvl = listData.reduce(
        (tvlAccum, item) => cBN(tvlAccum).plus(cBN(item.totalShare).multipliedBy(item.lpTokenPrice)),
        cBN(0),
      )
      // console.log(' ConvexVaultInfo.listData---totalTvl----', listData, totalTvl.toString(10))
      setConvexVaultIFOInfo({
        listInfo: listData
      })
      setConvexVaultIFOTvl(totalTvl)
    }
  }, [acrvInfo.totalUnderlying, getBlockNumber(), checkChain, poolList, refreshTrigger])

  return {
    poolList: VAULT_LIST_IFO,
    ConvexVaultIFOInfo,
    getPoolDataById,
    harvestVault,
    harvestList,
    convexVaultIFOTvl
  }
}

export const useUserPoolInfo = (info, refreshTrigger) => {
  const { web3, currentAccount, getBlockNumber, checkChain, CHAINSTATUS, getCurrentBlock } = useWeb3()
  const { stakeTokenContractAddress } = info
  const [userInfo, setUserInfo] = useState({
    userTokenAllowance: 0,
    pendingReward: 0,
  })
  const convexVaultsIFOContract = useContract(config.contracts.concentratorIFOVault, abi.AladdinConcentratorContVaultABI)
  const tokenContract = useContract(stakeTokenContractAddress, abi.erc20ABI)

  const fetchUserInfo = async () => {
    try {
      const goblinContracts = [
        tokenContract.methods.balanceOf(currentAccount),
        tokenContract.methods.allowance(currentAccount, config.contracts.convexVault),
        convexVaultsIFOContract.methods.pendingReward(info.id, currentAccount),
        convexVaultsIFOContract.methods.userInfo(info.id, currentAccount),
      ]
      const [userTokenBalance, userTokenAllowance, pendingReward, datainfo] = await multiCall(
        web3,
        currentAccount,
        ...goblinContracts,
      )
      const { 0: shares, 1: rewards, 2: rewardPerSharePaid } = datainfo

      setUserInfo({
        pendingReward,
        userTokenBalance,
        userTokenAllowance,
        rewardPerSharePaid,
        rewards,
        shares,
      })
    } catch (error) {
      // console.log(error)
    }
  }

  return {
    userInfo,
    convexVaultsIFOContract,
    tokenContract,
    fetchUserInfo,
  }
}

export default useConvexVaultIFO
