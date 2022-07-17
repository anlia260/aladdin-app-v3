import { useEffect, useState } from 'react'
import { cBN, fb4, formatBalance } from 'utils'
import useCtrPrice from 'pages/vault/controllers/useCtrPrice'
import useLiquidityMiningData from '../hook/useLiquidityMiningData'
import useVaultList from './useVaultList'

const useLiquidityMining = (refreshTrigger) => {
  const { poolList, liquidityData, totalLock } = useLiquidityMiningData(refreshTrigger)
  const { avApy, convexVaultIFOTvl, priceObj, updateCtrCrvBalancer } = useVaultList()
  const [data, setData] = useState({ poolList, liquidityData, totalLock, updateCtrCrvBalancer, priceObj: {} })
  const { ctrPrice } = useCtrPrice()
  const getPoolListData = async () => {
    let _apy = '-'
    const { totalSupply, ctrRewardData } = liquidityData

    const yearsRewardsValue = cBN(ctrRewardData?.rate ?? 0).multipliedBy(86400).multipliedBy(365).multipliedBy(ctrPrice)
    const tvl = cBN(totalSupply).multipliedBy(priceObj.lpPrice)
    const currentApy = yearsRewardsValue.div(tvl).multipliedBy(100).toFixed(2)
    console.log('currentApy', fb4(yearsRewardsValue, true), ctrPrice, fb4(tvl, true), `${currentApy}%`, currentApy)

    if (totalSupply) {
      // vault平均收益率*（vault总tvl/LP tvl）*（6/100）
      _apy = totalSupply * 1 ?
        cBN(avApy)
          .div(cBN(totalSupply).multipliedBy(priceObj.lpPrice))
          .multipliedBy(6 / 100)
          .multipliedBy(100)
          .toFixed(2) * 1 :
        '-'
    }
    setData(prev => {
      return {
        ...prev,
        poolList,
        liquidityData,
        apy: isNaN(_apy) ? '-' : _apy,
        currentApy: isNaN(currentApy) ? '—' : `${currentApy}%`,
        priceObj,
        totalLock
      }
    })
  }

  useEffect(async () => {
    await getPoolListData()
  }, [avApy, convexVaultIFOTvl, liquidityData])
  return data
}

export default useLiquidityMining
