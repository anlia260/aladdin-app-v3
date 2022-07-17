import { useEffect, useState } from 'react'
import { cBN, getLPTokenPrice, getTokenPrice } from 'utils'
import config from 'config'
import abi from 'config/abi'
import useWeb3 from 'hooks/useWeb3'
import { multiCall } from 'utils/contract'
import useACrv from './useACrv'
import { useContract } from 'hooks/useContracts'
import { VAULT_LIST } from 'config/convexVault'
import NoPayableAction, { noPayableErrorAction } from 'utils/noPayableAction'

let ctime = 0
const useConvexVault = refreshTrigger => {
  const { web3, currentAccount, checkChain, CHAINSTATUS, web3Alc, getBlockNumber } = useWeb3()
  const { acrvInfo } = useACrv()
  const [ConvexVaultInfo, setConvexVaultInfo] = useState({ listInfo: VAULT_LIST, totalInfo: { tvl: 0 } })
  const convexVaultsContract = useContract(config.contracts.convexVault, abi.AladdinConvexVaultABI)

  const [poolList, setPoolList] = useState(VAULT_LIST)
  const [harvestList, setHarvestList] = useState([])

  const harvestVault = async pid => {
    const reward = await convexVaultsContract.methods.harvest(pid, currentAccount, 0).call({ from: currentAccount, gas: 5000000 })
    if (reward * 1) {
      const _reward = cBN(reward)
        .multipliedBy(9)
        .div(10)
        .toFixed(0)
      const apiCall = await convexVaultsContract.methods.harvest(pid, currentAccount, _reward)
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
      'curve-dao-token,convex-crv,frax-share,ethereum,staked-ether,frax,lp-3pool-curve,usd-coin,bitcoin,convex-finance,wrapped-steth,rocket-pool-eth,terrausd-wormhole,convex-crv,renbtc,wrapped-bitcoin,pusd,seth,sbtc,nusd'
    const _price = await getTokenPrice(priceToken)
    return _price
  }

  const fetchAllPoolData = async () => {
    let _web3 = web3;
    if (checkChain === CHAINSTATUS["checkWeb3"]) {
      _web3 = web3Alc
    }
    try {
      const poolContracts = VAULT_LIST.map(({ id }) => convexVaultsContract.methods.poolInfo(id))
      const lpList = await multiCall(_web3, currentAccount, ...poolContracts)
      const lpPrice = await Promise.all(VAULT_LIST.map(item => getLPTokenPrice(_web3, item.tvlPriceTokenId)))

      const lpData = lpList.map((item, i) => {
        const { 0: totalUnderlying, 6: withdrawFeePercentage, 1: totalShare, 2: accRewardPerShare } = item
        return {
          ...item,
          ...VAULT_LIST[i],
          lpTokenPrice: lpPrice[i],
          totalUnderlying,
          withdrawFeePercentage,
          totalShare,
          accRewardPerShare,
        }
      })
      return lpData
    } catch (e) {
      return []
    }
  }

  const getPoolDataById = poolId => {
    return ConvexVaultInfo.find(item => item.id === poolId)
  }

  useEffect(() => {
    const _currTime = +new Date()
    if (_currTime - ctime > 1000 * 60 * 2) {
      ctime = _currTime
      fetchPriceData()
    }
  }, [getBlockNumber()])


  useEffect(async () => {
    if (checkChain) {
      const crvPrice = await getTokenPrice('convex-crv')
      const listData = await fetchAllPoolData()
      const totalTvl = listData.reduce(
        (tvlAccum, item) => cBN(tvlAccum).plus(cBN(item.totalShare).multipliedBy(item.lpTokenPrice)),
        cBN(0),
      )

      setConvexVaultInfo({
        listInfo: listData,
        totalInfo: {
          tvl: cBN(totalTvl).plus(cBN(crvPrice).multipliedBy(acrvInfo.totalUnderlying)),
        },
      })
    }
  }, [web3, currentAccount, acrvInfo.totalUnderlying, getBlockNumber(), checkChain, poolList, refreshTrigger])

  return {
    poolList: VAULT_LIST,
    ConvexVaultInfo,
    getPoolDataById,
    harvestVault,
    harvestList,
  }
}

export const useUserPoolInfo = (info, refreshTrigger) => {
  const { web3, currentAccount, getBlockNumber, checkChain, CHAINSTATUS, getCurrentBlock } = useWeb3()
  const { stakeTokenContractAddress } = info
  const [userInfo, setUserInfo] = useState({
    userTokenAllowance: 0,
    pendingReward: 0,
  })
  const vaultContract = useContract(config.contracts.convexVault, abi.AladdinConvexVaultABI)
  const tokenContract = useContract(stakeTokenContractAddress, abi.erc20ABI)

  const fetchUserInfo = async () => {
    try {
      const goblinContracts = [
        tokenContract.methods.balanceOf(currentAccount),
        tokenContract.methods.allowance(currentAccount, config.contracts.convexVault),
        vaultContract.methods.pendingReward(info.id, currentAccount),
        vaultContract.methods.userInfo(info.id, currentAccount),
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
    vaultContract,
    tokenContract,
    fetchUserInfo,
  }
}

export default useConvexVault
