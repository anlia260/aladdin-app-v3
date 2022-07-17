import { useEffect, useState } from 'react'
import { cBN } from 'utils'
// import config from 'config'
// import abi from 'config/abi'
// import useWeb3 from 'hooks/useWeb3'
import useVaultList from './useVaultList'
import useLiquidityMining from './useLiquidityMining'
import useActionBoard from './useActionBoard'
// import NoPayableAction, { noPayableErrorAction } from 'utils/noPayableAction'

const useTvl = refreshTrigger => {
  let { VAULT_LIST_DATA, VAULT_NEW_LIST_DATA } = useVaultList()
  const { liquidityData, priceObj } = useLiquidityMining()
  const { CRVConcentrated = cBN(0) } = useActionBoard({})
  const [data, setData] = useState({
    tvl: 0
  })

  const getTvl = async () => {
    const { totalSupply } = liquidityData
    const { lpPrice = 1 } = priceObj;
    let totalTvl = VAULT_LIST_DATA.reduce(
      (tvlAccum, item) => cBN(tvlAccum).plus(cBN(item.tvlInwei)),
      cBN(0),
    )
    totalTvl = totalTvl.plus(CRVConcentrated)
    let totalNewVaultTvl = VAULT_NEW_LIST_DATA.reduce(
      (tvlAccum, item) => cBN(tvlAccum).plus(cBN(item.tvlInwei)),
      cBN(0),
    )
    totalNewVaultTvl = totalNewVaultTvl.plus(cBN(totalSupply).multipliedBy(lpPrice))
    totalNewVaultTvl = totalNewVaultTvl.plus(CRVConcentrated)
    setData({ ConvexVaultTvl: totalTvl, convexVaultIFOTvl: totalNewVaultTvl })
  }

  useEffect(async () => {
    await getTvl()
  }, [VAULT_LIST_DATA, VAULT_NEW_LIST_DATA, liquidityData, priceObj, CRVConcentrated])

  return data
}

export default useTvl
