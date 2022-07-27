import { useEffect, useState } from 'react'
import { useUpdateEffect } from 'ahooks'
import { cBN, fb4, formatBalance, getConvexInfo } from 'utils'
import { VAULT_LIST, VAULT_LIST_IFO } from 'config/convexVault'
import useActionBoard from './useActionBoard'
import useInit from 'hooks/useInit'
import useCtrPrice from 'pages/vault/controllers/useCtrPrice'

const getApy = item => {
  if (!item) {
    return {
      baseApy: 0,
      apy: 0,
      compoundApy: 0,
      ethApy: 0,
      convexInfo: {},
    }
  }
  const convexApy = getConvexInfo('CRV') ? getConvexInfo('CRV').apy.project : 0
  const convexInfo = getConvexInfo(item.name)
  const baseApy = convexInfo ? parseFloat(convexInfo.apy.project || 0) : 0
  const baseCurrentApy = convexInfo ? parseFloat(convexInfo.apy.current || 0) : 0

  // just for original vault
  const acrvApy = cBN(parseFloat(convexApy))
    .dividedBy(100)
    .dividedBy(52)
    .plus(1)
    .pow(52)
    .minus(1)
    .shiftedBy(2)

  let compoundApy = acrvApy.multipliedBy(parseFloat(baseApy) - (convexInfo?.curveApys?.baseApy ?? 0)).dividedBy(100)
  let compoundCurrentApy = acrvApy.multipliedBy(parseFloat(baseCurrentApy) - (convexInfo?.curveApys?.baseApy ?? 0)).dividedBy(100)
  compoundApy = compoundApy > 0 ? compoundApy : cBN(0)
  compoundCurrentApy = compoundCurrentApy > 0 ? compoundCurrentApy : cBN(0)
  // just for original vault
  let apy = compoundApy.plus(cBN(parseFloat(baseApy)))
  let currentApy = compoundCurrentApy.plus(cBN(parseFloat(baseCurrentApy)))
  if (item.isIfo) {
    compoundApy = cBN(0)
  }

  let ethApy = cBN(1)
    .plus(cBN(parseFloat(baseApy)).div(100))
    .plus(cBN(compoundApy).div(100))
    .times(cBN(0.045 * 0.85))
    .times(100)
  let ethCurrentApy = cBN(1)
    .plus(cBN(parseFloat(baseCurrentApy)).div(100))
    .plus(cBN(compoundApy).div(100))
    .times(cBN(0.045 * 0.85))
    .times(100)
  if (item.isShowEthApy) {
    // console.log("ethApy---", compoundApy.toString(10), parseFloat(baseApy).toString(10), ethApy.toString(10))
    apy = apy.plus(cBN(ethApy))
    currentApy = currentApy.plus(cBN(ethCurrentApy))
  }
  return { baseApy, baseCurrentApy, apy, currentApy, compoundApy, compoundCurrentApy, ethApy, ethCurrentApy, convexInfo }
}

const useVaultList = refreshTrigger => {
  const [data, setData] = useState({
    VAULT_LIST_DATA: VAULT_LIST,
    VAULT_NEW_LIST_DATA: VAULT_LIST_IFO,
    avApy: 0,
    convexVaultIFOTvl: 0,
  })
  const { AllPool: basicInfo, AllPoolUserInfo: userInfo, updateAllPoolData, updateAllPoolUserData, updateCtrCrvBalancer } = useInit()
  const priceObj = useCtrPrice()

  const getListData = async () => {
    const { ctr: ctrPrice, acrv: acrvPrice } = priceObj
    console.log('getListData', basicInfo, userInfo)
    try {
      const data = basicInfo.map((item, index) => {
        const { baseApy, baseCurrentApy, apy, currentApy, compoundApy, compoundCurrentApy, ethApy, ethCurrentApy, convexInfo } = getApy(item)
        const { totalUnderlying, totalShare, lpTokenPrice } = item
        const { shares } = userInfo[index] ?? { shares: 1 }

        const earnedNum = cBN(totalUnderlying)
          .div(cBN(totalShare))
          .multipliedBy(shares)
          .multipliedBy(lpTokenPrice)
          .toString()
        const earned = formatBalance(
          earnedNum,
          18,
          2,
        )

        // CTR的APR计算：（convex的apr-convex的base curve vapr）*CTR价格/aCRV价格
        //  (vault.basicAPR - vault.baseCurveVAPR) * ctrPrice / acrvPrice
        const ctrApy = cBN(parseFloat(baseApy))
          .minus(convexInfo?.curveApys?.baseApy ?? 0)
          .multipliedBy(ctrPrice ?? 1)
          .div(acrvPrice ?? 1)
          .toFixed(3)

        const ctrCurrentApy = cBN(parseFloat(baseCurrentApy))
          .minus(convexInfo?.curveApys?.baseApy ?? 0)
          .multipliedBy(ctrPrice ?? 1)
          .div(acrvPrice ?? 1)
          .toFixed(2)

        const tvlCBN = totalUnderlying ? cBN(totalUnderlying).multipliedBy(lpTokenPrice) : cBN(0)
        const tvlInwei = cBN(tvlCBN).isZero() ? cBN(0) : tvlCBN
        const tvl = cBN(tvlCBN).isZero() ? '-' : fb4(tvlCBN, true, 18)

        return {
          ...item,
          ...(userInfo[index] ?? {}),
          ctrApy,
          ctrCurrentApy,
          earned,
          earnedNum,
          tvlInwei,
          tvl,
          baseApy,
          baseCurrentApy,
          apy,
          currentApy,
          compoundApy,
          compoundCurrentApy,
          ethApy,
          ethCurrentApy,
          convexInfo,
        }
      })
      return data
    } catch (error) {
      console.log(error)
      return []
    }
  }

  const getPoolInfo = async item => {
    const listData = await getListData()
    const data = listData.filter(i => i.isIfo == item.isIfo && i.id == item.id)
    return data[0]
  }

  useUpdateEffect(async () => {
    const listData = await getListData()
    const _new_list_data = listData.filter(i => i.isIfo)
    const totalTvl = _new_list_data.reduce(
      (tvlAccum, item) => cBN(tvlAccum).plus(cBN(item.totalUnderlying).multipliedBy(item.lpTokenPrice)),
      cBN(0),
    )
    const totalApyTvl = _new_list_data.reduce(
      (tvlAccum, item) =>
        cBN(tvlAccum).plus(
          cBN(item.totalUnderlying)
            .multipliedBy(item.lpTokenPrice)
            .multipliedBy(item.ctrApy)
            .div(100),
        ),
      cBN(0),
    )
    // vault平均收益率：求和（池子tvl*池子apy）/总的tvl
    const avApy = totalApyTvl // totalApyTvl.div(totalTvl)
    console.log('avApy-----', avApy.toString(10))
    setData(prev => {
      return {
        ...prev,
        VAULT_LIST_DATA: listData.filter(i => !i.isIfo),
        VAULT_NEW_LIST_DATA: listData.filter(i => i.isIfo),
        avApy,
        convexVaultIFOTvl: totalTvl,
      }
    })
  }, [userInfo, basicInfo])

  useUpdateEffect(async () => {
    updateAllPoolData(refreshTrigger)
    updateAllPoolUserData(refreshTrigger)
  }, [refreshTrigger])

  return {
    ...data,
    getPoolInfo,
    priceObj,
    updateCtrCrvBalancer
  }
}

export default useVaultList
