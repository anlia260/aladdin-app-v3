import { useEffect, useState } from 'react'
import { cBN, getTokenPrice, fb4, getConvexInfo } from 'utils'
import { useAsyncEffect } from "ahooks"
// import useWeb3 from 'hooks/useWeb3'
import useACrvNew from '../hook/useACrvNew'

const getApy = () => {
  const convexApy = getConvexInfo('CRV')?.apy?.project || 0
  const apy = cBN(parseFloat(convexApy))
    .dividedBy(100)
    .dividedBy(365)
    .plus(1)
    .pow(365)
    .minus(1)
    .shiftedBy(2)

  return { apy, convexApy }
}

const useActionBoard = ({ vaultType = 'old', refreshTrigger }) => {
  // const { web3, currentAccount, checkChain, CHAINSTATUS, web3Alc, getBlockNumber } = useWeb3()
  const { userInfo, acrvInfo } = useACrvNew(refreshTrigger)
  const [crvPrice, setCrvPrice] = useState(0)

  useAsyncEffect(async () => {
    const price = await getTokenPrice('convex-crv')
    setCrvPrice(price)
  }, [])

  const [data, setData] = useState({
    userInfo,
    acrvInfo,
    apy: 0,
  })

  const getHarvestEarn = () => {
    // const [totalUnderlying, userAcrvWalletBalance, allPoolRewardaCrv,
    //   allIFOPoolRewardaCrv, harvestBountyPercentage, platformFeePercentage, harvestReward, totalSupply] = await multiCall(web3, currentAccount, ...goblinContracts)
    // console.log("totalUnderlying,userAcrvWalletBalance, allPoolRewardaCrv, harvestBountyPercentage, platformFeePercentage, harvestReward, totalSupply----", totalUnderlying, userAcrvWalletBalance, allPoolRewardaCrv, harvestBountyPercentage, platformFeePercentage, harvestReward, totalSupply)

    const { userAcrvWalletBalance, allPoolRewardaCrv, allIFOPoolRewardaCrv, harvestReward } = userInfo
    const { platformFeePercentage, harvestBountyPercentage, totalSupply } = acrvInfo
    // console.log(
    //   'harvestReward,userAcrvWalletBalance,allPoolRewardaCrv,allIFOPoolRewardaCrv,platformFeePercentage,harvestBountyPercentage',
    //   harvestReward,
    //   userAcrvWalletBalance,
    //   allPoolRewardaCrv,
    //   allIFOPoolRewardaCrv,
    //   platformFeePercentage,
    //   harvestBountyPercentage,
    //   totalSupply,
    // )
    const _userBalance = cBN(userAcrvWalletBalance || 0).plus(allPoolRewardaCrv || 0)
    const _userBalanceIFO = cBN(userAcrvWalletBalance || 0).plus(allIFOPoolRewardaCrv || 0)
    const _fee = cBN(1).minus(
      cBN(platformFeePercentage)
        .plus(harvestBountyPercentage)
        .div(1e9),
    )
    // // console.log('_fee', _fee.toString(10))
    // // console.log('_userBalance--', _userBalance.toNumber(), totalSupply)
    const _rewardCvxCrv = cBN(harvestReward)
      .div(1e18)
      .multipliedBy(_fee)
      .multipliedBy(_userBalance)
      .div(totalSupply)
    const _rewardCvxCrvIFO = cBN(harvestReward)
      .div(1e18)
      .multipliedBy(_fee)
      .multipliedBy(_userBalanceIFO)
      .div(totalSupply)
    // // const rate = acrvInfo.totalSupply * 1 ? cBN(acrvInfo.totalUnderlying).div(acrvInfo.totalSupply) : 1;
    // // console.log('_rewardCvxCrv--', _rewardCvxCrv.toNumber())
    const harvestEarn = _rewardCvxCrv ? _rewardCvxCrv : 0
    const harvestIFOEarn = _rewardCvxCrvIFO ? _rewardCvxCrvIFO : 0
    // // console.log('_reward----', _rewardCvxCrv.toString(), rate.toString())
    // setHarvestEarn(_reward)
    // setHarvestIFOEarn(_rewardIFO)
    return { harvestEarn, harvestIFOEarn }
  }

  const getActionBoardInfo = async vaultType => {
    const poolsRewardaCrv = vaultType == 'new' ? userInfo.allIFOPoolRewardaCrv : userInfo.allPoolRewardaCrv
    const myBalance = cBN(poolsRewardaCrv).plus(userInfo.userAcrvWalletBalance)
    const cvxCrvNum = cBN(myBalance).multipliedBy(acrvInfo.rate)

    const myAcrvBalance = cBN(crvPrice)
      .multipliedBy(myBalance)
      .multipliedBy(acrvInfo.rate)

    const acrvText = cBN(myBalance || 0).isZero() ? '' : `≈ ${fb4(cvxCrvNum)} cvxCRV / ${fb4(myAcrvBalance, true)}`

    const { apy, convexApy } = getApy()
    const { harvestEarn, harvestIFOEarn } = getHarvestEarn()
    const CRVConcentrated = cBN(crvPrice)
      .multipliedBy(acrvInfo.totalUnderlying)
      .multipliedBy(acrvInfo.rate)
    setData({
      ...data,
      userInfo,
      acrvInfo,
      myBalance,
      poolsRewardaCrv,
      cvxCrvNum,
      acrvText,
      apy,
      convexApy,
      harvestEarn,
      harvestIFOEarn,
      CRVConcentrated,
    })
  }

  useEffect(async () => {
    await getActionBoardInfo(vaultType)
  }, [vaultType, userInfo, acrvInfo, crvPrice])

  return data
}

export default useActionBoard
