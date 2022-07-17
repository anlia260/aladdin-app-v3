import { useEffect, useState } from 'react'
import { cBN } from 'utils'
import config from 'config'
// import abi from 'config/abi'
import useWeb3 from 'hooks/useWeb3'
import { multiCall } from 'utils/contract'
import { LIQUIDITY_LIST_IFO } from 'config/convexVault'
import BALANCERLPGAUGE from 'config/contract/BALANCERLPGAUGE'
import VAULTNEW from 'config/contract/VAULTNEW'
import { getCTRAddress } from 'config/contract/CTR'

// import NoPayableAction, { noPayableErrorAction } from 'utils/noPayableAction'
// let ctime = 0
const useLiquidityMiningData = refreshTrigger => {
  const { web3, currentAccount, checkChain, CHAINSTATUS, web3Alc, getBlockNumber } = useWeb3()
  // const [liquidityListInfo, setLiquidityListInfo] = useState({ listInfo: LIQUIDITY_LIST_IFO })
  const [data, setData] = useState({
    poolList: LIQUIDITY_LIST_IFO,
    liquidityData: {
      totalSupply: 0, userDeposits: 0, liquidityApy: cBN(0)
    }
  })
  // const [totalLock, setTotalLock] = useState(0)
  const CTRAddress = getCTRAddress()
  // const [liquidityData, setLiquidityData] = useState({
  //   totalSupply: 0, userDeposits: 0, liquidityApy: cBN(0)
  // })
  const BALANCERLPGAUGEContract = BALANCERLPGAUGE()
  const VAULTNEWContract = VAULTNEW()


  const fetchLiquidityData = async () => {
    let _web3 = web3;
    if (checkChain === CHAINSTATUS["checkWeb3"]) {
      _web3 = web3Alc
    }
    try {
      await BALANCERLPGAUGEContract.methods.user_checkpoint(currentAccount).call({ from: currentAccount })
      const ctrRewardData = await BALANCERLPGAUGEContract.methods.reward_data(config.contracts.aladdinCTR).call()
      const goblinContracts = [
        BALANCERLPGAUGEContract.methods.totalSupply(),
        // BALANCERLPGAUGEContract.methods.user_checkpoint(currentAccount),
        BALANCERLPGAUGEContract.methods.claimable_reward(currentAccount, CTRAddress),
        BALANCERLPGAUGEContract.methods.balanceOf(currentAccount),
        VAULTNEWContract.methods.ctrMined(),
        // BALANCERLPGAUGEContract.methods.reward_data(config.contracts.aladdinCTR)
      ]
      const [totalSupply, claimable_reward, userDeposits, ctrMined] = await multiCall(
        web3,
        currentAccount,
        ...goblinContracts,
      )
      console.log('totalSupply,claimable_reward, userDeposits, ctrMined, ctrRewardData---', totalSupply, claimable_reward, userDeposits, ctrMined, ctrRewardData)
      const claimable = cBN(0).plus(claimable_reward).toString(10)
      const liquidityData = {
        ...LIQUIDITY_LIST_IFO[0],
        totalSupply,
        claimable,
        userDeposits,
        ctrMined, ctrRewardData
      }
      setData(prev => {
        return {
          ...prev,
          liquidityData
        }
      })
      // setLiquidityData(liquidityData)
      return liquidityData
    } catch (e) {
      // console.log('eeeee-', e)
      return []
    }
  }

  useEffect(async () => {
    if (checkChain) {
      await fetchLiquidityData()
    }
  }, [getBlockNumber(), checkChain, refreshTrigger])
  // console.log('lp------data----', data)
  return {
    ...data
  };
}
export default useLiquidityMiningData
