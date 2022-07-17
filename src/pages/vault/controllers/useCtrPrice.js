import { useEffect, useState } from 'react'
import { getTokenPrice, cBN } from 'utils'
import { getCTRAddress } from 'config/contract/CTR'
import CTRACRVLP from 'config/contract/CTRACRVLP'
import useActionBoard from './useActionBoard'
import useInit from 'hooks/useInit'

const useCtrPrice = () => {
  const { ctrCrvBalancer } = useInit()
  const { acrvInfo } = useActionBoard({})
  const [data, setData] = useState({
    ctr: 1,
    acrv: 1,
    lpPrice: 1
  })
  const getCtrPrice = async () => {

    const crvPrice = await getTokenPrice('convex-crv')
    console.log('crvPrice---', crvPrice, acrvInfo.rate)
    const acrvPrice = cBN(crvPrice).multipliedBy(acrvInfo.rate).toString(10) || cBN(1)

    const ctrCRV = ctrCrvBalancer
    const ctrToken = getCTRAddress()
    const CTRACRVLPContract = CTRACRVLP()

    const ctrTokenIndex = ctrCRV.tokens[0] == ctrToken ? 0 : 1;
    const acrvTokenIndex = ctrCRV.tokens[0] == ctrToken ? 1 : 0;

    const ctrPrice = (ctrCRV.balances[acrvTokenIndex] * 2) / (ctrCRV.balances[ctrTokenIndex] * 98) * acrvPrice

    const lpTotalSupply = await CTRACRVLPContract.methods.totalSupply().call()
    const lpPrice = cBN(ctrCRV.balances[acrvTokenIndex]).div(1e18).multipliedBy(acrvPrice).div(0.98).div(cBN(lpTotalSupply).div(1e18)).toFixed(4)
    // console.log('acrvPrice--lpTotalSupply--lpPrice--ctrPrice--', acrvPrice, lpTotalSupply, lpPrice, ctrPrice)
    setData({
      ctrPrice, lpPrice, ctr: ctrPrice,
      acrv: acrvPrice,
    })
    return {
      ctrPrice, lpPrice, ctr: ctrPrice,
      acrv: acrvPrice,
    }
  }

  useEffect(() => {
    if (ctrCrvBalancer) {
      getCtrPrice()
    }

  }, [ctrCrvBalancer, acrvInfo.rate])

  return data
}

export default useCtrPrice
