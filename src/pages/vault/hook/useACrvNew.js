import { useEffect, useState } from 'react'
// import { Web3Context } from 'context/Web3Context'
// import { useContract } from 'hooks/useContracts'
import useWeb3 from 'hooks/useWeb3'
import { multiCall } from 'utils/contract'
// import abis from 'config/abi'
import config from 'config'
import ACRV from 'config/contract/ACRV'
import CVXCRV from 'config/contract/CVXCRV'
import CRV from 'config/contract/CRV'
import VAULT from 'config/contract/VAULT'
import VAULTNEW from 'config/contract/VAULTNEW'
import { cBN, numberToString } from 'utils'
import NoPayableAction from 'utils/noPayableAction'

const { convexVault: convexVaultAddr, convexVaultAcrv: convexVaultAcrvAddr, concentratorIFOVault } = config.contracts

const INIT = {
  userInfo: {
    userAcrvWalletBalance: 0,
    allPoolRewardaCrv: 0,
    allIFOPoolRewardaCrv: 0,
    poolsRewardaCrv: 0,
    userCvxCrvBalance: 0,
    userCvxCrvAllowance: 0,
    userCrvBalance: 0,
    userCrvAllowance: 0,
  },
  acrvInfo: {
    totalUnderlying: 0,
    totalSupply: 0,
    rate: 1,
    withdrawFee: 0,
    harvestBountyPercentage: 0,
    platformFeePercentage: 0,
  },
}

const useACrvNew = refreshTrigger => {
  const { getBlockNumber, currentAccount, web3, web3Alc, checkChain, CHAINSTATUS } = useWeb3()
  // const [harvestEarn, setHarvestEarn] = useState(0)
  // const [harvestIFOEarn, setHarvestIFOEarn] = useState(0)
  const [data, setData] = useState(INIT)
  const aCrvContract = ACRV()
  const cvxCrvContract = CVXCRV()
  const crvContract = CRV()
  const convexVaultsContract = VAULT()
  const convexVaultsIFOContract = VAULTNEW()
  const fetchCotractInfo = async () => {
    try {
      let _web3 = web3
      if (checkChain === CHAINSTATUS['checkWeb3']) {
        _web3 = web3Alc
      }
      const goblinContracts = [
        aCrvContract.methods.withdrawFeePercentage(),
        aCrvContract.methods.totalUnderlying(),
        aCrvContract.methods.totalSupply(),
        aCrvContract.methods.harvestBountyPercentage(),
        aCrvContract.methods.platformFeePercentage(),
      ]
      const [withdrawFee, totalUnderlying, totalSupply, harvestBountyPercentage, platformFeePercentage] = await multiCall(
        _web3,
        currentAccount,
        ...goblinContracts,
      )

      // console.log('withdrawFee, totalUnderlying, totalSupply, harvestBountyPercentage, platformFeePercentage---', withdrawFee, totalUnderlying, totalSupply, harvestBountyPercentage, platformFeePercentage)

      const rate =
        totalSupply * 1
          ? numberToString(
            cBN(totalUnderlying)
              .div(totalSupply)
              .toNumber(),
          )
          : 1

      setData(prev => {
        return {
          ...prev,
          acrvInfo: {
            totalUnderlying,
            totalSupply,
            rate,
            withdrawFee,
            harvestBountyPercentage,
            platformFeePercentage,
          },
        }
      })
    } catch (error) {
      return {
        withdrawFee: 0,
        totalUnderlying: 0,
        totalSupply: 0,
        rate: 0,
      }
    }
  }

  const fetchUserInfo = async () => {
    try {
      // const c1 = await aCrvContract.methods.balanceOf(currentAccount).call()
      // const c2 = await cvxCrvContract.methods.balanceOf(currentAccount).call()
      // const c3 = await crvContract.methods.balanceOf(currentAccount).call()
      // const c4 = await cvxCrvContract.methods.allowance(currentAccount, convexVaultAcrvAddr).call()
      // const c5 = await crvContract.methods.allowance(currentAccount, convexVaultAcrvAddr).call()
      // const c6 = await convexVaultsContract.methods.pendingRewardAll(currentAccount).call()
      // const c7 = await convexVaultsIFOContract.methods.pendingRewardAll(currentAccount).call()
      // const c8 = await aCrvContract.methods.harvest(currentAccount, 0).call()
      const goblinContracts = [
        aCrvContract.methods.balanceOf(currentAccount),
        cvxCrvContract.methods.balanceOf(currentAccount),
        crvContract.methods.balanceOf(currentAccount),
        cvxCrvContract.methods.allowance(currentAccount, convexVaultAcrvAddr),
        crvContract.methods.allowance(currentAccount, convexVaultAcrvAddr),
        convexVaultsContract.methods.pendingRewardAll(currentAccount),
        convexVaultsIFOContract.methods.pendingRewardAll(currentAccount),
        // aCrvContract.methods.harvest(currentAccount, 0),
      ]
      const [
        userAcrvWalletBalance,
        userCvxCrvBalance,
        userCrvBalance,
        userCvxCrvAllowance,
        userCrvAllowance,
        allPoolRewardaCrv,
        allIFOPoolRewardaCrv,
        // harvestReward,
      ] = await multiCall(web3, currentAccount, ...goblinContracts)
      const harvestReward = await aCrvContract.methods.harvest(currentAccount, 0).call({ from: currentAccount })
      const poolsRewardaCrv = cBN(0)
        .plus(allPoolRewardaCrv)
        .plus(allIFOPoolRewardaCrv)
        .toString(10)

      setData(prev => {
        return {
          ...prev,
          userInfo: {
            userAcrvWalletBalance,
            allPoolRewardaCrv,
            allIFOPoolRewardaCrv,
            poolsRewardaCrv,
            userCvxCrvBalance,
            userCvxCrvAllowance,
            userCrvBalance,
            userCrvAllowance,
            harvestReward,
          },
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  const harvestAcrv = async () => {
    const aCrvContract = ACRV()
    const apiCall = await aCrvContract.methods.harvest(currentAccount, 0)
    const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
    const gas = parseInt(estimatedGas * 1.2, 10) || 0

    await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
      key: 'harvestAcrv',
      action: 'harvest',
    })
    return true
  }

  // const getHarvestEarn = async () => {
  //   const [totalUnderlying, userAcrvWalletBalance, allPoolRewardaCrv,
  //     allIFOPoolRewardaCrv, harvestBountyPercentage, platformFeePercentage, harvestReward, totalSupply] = await multiCall(web3, currentAccount, ...goblinContracts)
  //   // console.log("totalUnderlying,userAcrvWalletBalance, allPoolRewardaCrv, harvestBountyPercentage, platformFeePercentage, harvestReward, totalSupply----", totalUnderlying, userAcrvWalletBalance, allPoolRewardaCrv, harvestBountyPercentage, platformFeePercentage, harvestReward, totalSupply)
  //   const _userBalance = cBN(userAcrvWalletBalance || 0).plus(allPoolRewardaCrv || 0)
  //   const _userBalanceIFO = cBN(userAcrvWalletBalance || 0).plus(allIFOPoolRewardaCrv || 0)
  //   const _fee = cBN(1).minus(cBN(platformFeePercentage).plus(harvestBountyPercentage).div(1e9))
  //   // console.log('_fee', _fee.toString(10))
  //   // console.log('_userBalance--', _userBalance.toNumber(), totalSupply)
  //   const _rewardCvxCrv = cBN(harvestReward).div(1e18).multipliedBy(_fee).multipliedBy(_userBalance).div(totalSupply);
  //   const _rewardCvxCrvIFO = cBN(harvestReward).div(1e18).multipliedBy(_fee).multipliedBy(_userBalanceIFO).div(totalSupply);
  //   // const rate = acrvInfo.totalSupply * 1 ? cBN(acrvInfo.totalUnderlying).div(acrvInfo.totalSupply) : 1;
  //   // console.log('_rewardCvxCrv--', _rewardCvxCrv.toNumber())
  //   const _reward = _rewardCvxCrv ? _rewardCvxCrv : 0;
  //   const _rewardIFO = _rewardCvxCrvIFO ? _rewardCvxCrvIFO : 0;
  //   // console.log('_reward----', _rewardCvxCrv.toString(), rate.toString())
  //   setHarvestEarn(_reward)
  //   setHarvestIFOEarn(_rewardIFO)
  // }

  useEffect(() => {
    // const initData = async () => {
    //   await getHarvestEarn();
    // }
    // if (checkChain == CHAINSTATUS["checkUser"] && aCrvContract) {
    //   initData()
    // }
  }, [getBlockNumber(), checkChain])

  useEffect(() => {
    const initData = async () => {
      await fetchCotractInfo()
    }
    if (checkChain) {
      initData()
    }
  }, [getBlockNumber(), checkChain, refreshTrigger])

  useEffect(() => {
    const initData = async () => {
      await fetchUserInfo()
    }
    if (checkChain == CHAINSTATUS['checkUser']) {
      initData()
    }
  }, [refreshTrigger, getBlockNumber(), checkChain])

  return data
}

export default useACrvNew
