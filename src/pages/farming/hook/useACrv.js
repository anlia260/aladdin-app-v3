import { useEffect, useState, useContext } from 'react'
import { Web3Context } from 'context/Web3Context'
import { useContract } from 'hooks/useContracts'
import useWeb3 from 'hooks/useWeb3'
import { multiCall } from 'utils/contract'
import abis from 'config/abi'
import config from 'config'
import { cBN, formatBalance, numberToString, getLPTokenPrice } from 'utils'
import NoPayableAction, { noPayableErrorAction } from 'utils/noPayableAction'

const { convexVault: convexVaultAddr, convexVaultAcrv: convexVaultAcrvAddr } = config.contracts
const { cvxcrv: cvxcrvToeknAddress, crv: crvTokenAddress } = config.tokens

const useInfo = refreshTrigger => {
  const { currentAccount, web3, web3Alc, currentChainId } = useContext(Web3Context)
  const { getBlockNumber, checkChain, CHAINSTATUS, currentBlock } = useWeb3()
  const [harvestEarn, setHarvestEarn] = useState(0);
  const [userInfo, setUserInfo] = useState({
    userCvxCrvAllowance: 0,
  })
  const [acrvInfo, setAcrvInfo] = useState({
    totalUnderlying: 0,
    totalSupply: 0,
    rate: 1,
  })

  const aCrvContract = useContract(convexVaultAcrvAddr, abis.AladdinCRVABI)
  const cvxCrvContract = useContract(cvxcrvToeknAddress, abis.erc20ABI)
  const crvContract = useContract(crvTokenAddress, abis.erc20ABI)
  const convexVaultContract = useContract(convexVaultAddr, abis.AladdinConvexVaultABI)

  const fetchUserInfo = async () => {
    try {

      const goblinContracts = [
        aCrvContract.methods.balanceOf(currentAccount),
        cvxCrvContract.methods.balanceOf(currentAccount),
        crvContract.methods.balanceOf(currentAccount),
        cvxCrvContract.methods.allowance(currentAccount, convexVaultAcrvAddr),
        crvContract.methods.allowance(currentAccount, convexVaultAcrvAddr),
        convexVaultContract.methods.pendingRewardAll(currentAccount)
      ]
      const [userAcrvWalletBalance, userCvxCrvBalance, userCrvBalance, userCvxCrvAllowance, userCrvAllowance, allPoolRewardaCrv] = await multiCall(web3, currentAccount, ...goblinContracts)

      setUserInfo({
        userAcrvWalletBalance,
        allPoolRewardaCrv,
        userCvxCrvBalance,
        userCvxCrvAllowance,
        userCrvBalance,
        userCrvAllowance,
      })
    } catch (error) {
      // console.log(error)
    }
  }

  const fetchCotractInfo = async () => {
    try {
      let _web3 = web3;
      if (checkChain === CHAINSTATUS["checkWeb3"]) {
        _web3 = web3Alc
      }
      // const withdrawFee = await aCrvContract.methods.withdrawFeePercentage().call()
      // const totalUnderlying = await aCrvContract.methods.totalUnderlying().call()
      // const totalSupply = await aCrvContract.methods.totalSupply().call()
      const goblinContracts = [
        aCrvContract.methods.withdrawFeePercentage(),
        aCrvContract.methods.totalUnderlying(),
        aCrvContract.methods.totalSupply(),
      ]
      const [withdrawFee, totalUnderlying, totalSupply] = await multiCall(_web3, currentAccount, ...goblinContracts)


      const rate = totalSupply * 1 ? numberToString(cBN(totalUnderlying).div(totalSupply).toNumber()) : 1
      // console.log('[useACrv]: totalSupply', totalSupply)
      // console.log('[useACrv]: totalUnderlying', totalUnderlying)
      // console.log('[useACrv]: rate', rate, cBN(totalUnderlying).div(totalSupply).toNumber())

      setAcrvInfo({
        totalUnderlying,
        totalSupply,
        rate,
        withdrawFee
      })
      return {
        withdrawFee, totalUnderlying, totalSupply
      }
    } catch (error) {
      // console.log(error)
      return {
        withdrawFee: 0, totalUnderlying: 0, totalSupply: 0
      }
    }
  }


  const harvestAcrv = async () => {
    const apiCall = await aCrvContract.methods.harvest(currentAccount, 0)
    const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
    const gas = parseInt(estimatedGas * 1.2, 10) || 0

    await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
      key: 'harvestAcrv',
      action: 'harvest',
    })
    return true;
  }

  const getHarvestEarn = async () => {

    const goblinContracts = [
      aCrvContract.methods.totalUnderlying(),
      aCrvContract.methods.balanceOf(currentAccount),
      convexVaultContract.methods.pendingRewardAll(currentAccount),
      aCrvContract.methods.harvestBountyPercentage(),
      aCrvContract.methods.platformFeePercentage(),
      aCrvContract.methods.harvest(currentAccount, 0),
      aCrvContract.methods.totalSupply(),
    ];
    // 是harvestReward * 95%*（wallet balance+Claimable from vault profit）/totalSupply

    const [totalUnderlying, userAcrvWalletBalance, allPoolRewardaCrv, harvestBountyPercentage, platformFeePercentage, harvestReward, totalSupply] = await multiCall(web3, currentAccount, ...goblinContracts)
    // console.log("totalUnderlying,userAcrvWalletBalance, allPoolRewardaCrv, harvestBountyPercentage, platformFeePercentage, harvestReward, totalSupply----", totalUnderlying, userAcrvWalletBalance, allPoolRewardaCrv, harvestBountyPercentage, platformFeePercentage, harvestReward, totalSupply)
    const _userBalance = cBN(userAcrvWalletBalance || 0).plus(allPoolRewardaCrv || 0)
    const _fee = cBN(1).minus(cBN(platformFeePercentage).plus(harvestBountyPercentage).div(1e9))
    // console.log('_fee', _fee.toString(10))
    // console.log('_userBalance--', _userBalance.toNumber(), totalSupply)
    const _rewardCvxCrv = cBN(harvestReward).div(1e18).multipliedBy(_fee).multipliedBy(_userBalance).div(totalSupply);
    // const rate = acrvInfo.totalSupply * 1 ? cBN(acrvInfo.totalUnderlying).div(acrvInfo.totalSupply) : 1;
    // console.log('_rewardCvxCrv--', _rewardCvxCrv.toNumber())
    const _reward = _rewardCvxCrv ? _rewardCvxCrv : 0;
    // console.log('_reward----', _rewardCvxCrv.toString(), rate.toString())
    setHarvestEarn(_reward)
  }

  useEffect(async () => {
    if (checkChain == CHAINSTATUS["checkUser"] && aCrvContract) {
      await getHarvestEarn();
    }
  }, [getBlockNumber(), checkChain])

  useEffect(() => {
    if (checkChain && aCrvContract) {
      fetchCotractInfo()
    }
  }, [web3, aCrvContract, getBlockNumber(), checkChain])

  useEffect(() => {
    if (checkChain == CHAINSTATUS["checkUser"] && aCrvContract) {
      fetchUserInfo()
    }
  }, [web3, aCrvContract, refreshTrigger, getBlockNumber(), checkChain])

  return {
    aCrvContract,
    cvxCrvContract,
    crvContract,
    cvxcrvToeknAddress,
    convexVaultContract,
    userInfo,
    acrvInfo,
    harvestEarn,
    harvestAcrv,
    fetchCotractInfo
  }
}

export default useInfo
