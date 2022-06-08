import React, { useState } from 'react'
import cn from 'classnames'
import Button from 'components/Button'
import { useCountDown } from 'ahooks'
import useWeb3 from 'hooks/useWeb3'
import useStatus from '../../hook/useStatus'
import styles from './styles.module.scss'
import { fb4, basicCheck, cBN } from 'utils'
import NoPayableAction, { noPayableErrorAction } from 'utils/noPayableAction'

const formatCountDown = formattedRes => {
  const { days, hours, minutes, seconds } = formattedRes
  if (days) {
    return `${days}d ${hours}h:${minutes}m:${seconds}s`
  }
  if (hours) {
    return `${hours}h:${minutes}m:${seconds}s`
  }
  if (minutes) {
    return `${minutes}m:${seconds}s`
  }
  if (seconds) {
    return `${seconds}s`
  }
}

const StatusBoard = () => {
  const { web3, currentAccount } = useWeb3()
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const { convexVaultsIFOContract, ifoInfo } = useStatus(refreshTrigger)
  const [claiming, setClaiming] = useState(false)

  const targetDate = () => {
    if (ifoInfo.status === 'ready') {
      return (ifoInfo.sTime ?? 0) * 1000
    }
    if (ifoInfo.status === 'pending') {
      return (ifoInfo.eTime ?? 0) * 1000
    }

    return null
  }

  const [countdown, formattedRes] = useCountDown({
    targetDate: targetDate(),
  })

  const statusText = {
    pending: `Closing at : ${formatCountDown(formattedRes)}`,
    ready: `Opening at : ${formatCountDown(formattedRes)}`,
    sellout: `Completed !`,
  }

  const handleClaim = async () => {
    if (!basicCheck(web3, currentAccount)) return
    setClaiming(true)
    try {
      const apiCall = convexVaultsIFOContract.methods.claimAllCONT(currentAccount)
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 'ifo_info',
        action: 'claim',
      })
      setClaiming(false)
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      setClaiming(false)
      noPayableErrorAction(`error_ifo_info_claim`, error)
    }
  }

  const canClaim = !cBN(ifoInfo.userRewards ?? 0).isZero()

  return (
    <div className={styles.statusBoard}>
      <span className={ifoInfo.status === 'ended' ? 'hidden' : ''}>
        <div className="color-white mb-5 font-medium">Initial Farming Offering</div>
        <div className="mb-9">{statusText[ifoInfo.status] ?? 'ing'}</div>
        <div className="mb-3">Released/Total</div>
        <div className="text-2xl mb-2 color-white font-medium">
          {fb4(ifoInfo.contReleased ?? 0)}/{fb4(ifoInfo.contTotal ?? 0)}
        </div>
        <div className="mb-10">$CTR</div>
        <div className="mb-3">Total $aCRV raised</div>
        <div className="text-2xl color-white font-medium">{fb4(ifoInfo.contReleased ?? 0)} $aCRV</div>
        <div className={cn(styles.divider, 'my-10 w-full')} />
      </span>
      <div className="mb-3">Claimable IFO Share</div>
      <div className="text-2xl color-white font-medium mb-8">
        {fb4(ifoInfo.userRewards ?? 0)} <span className={styles.unit}>$CTR</span>
      </div>

      <div className="text-right">
        <Button theme="lightBlue" disabled={!canClaim} loading={claiming} onClick={handleClaim}>
          Claim
        </Button>
      </div>
    </div>
  )
}

export default StatusBoard
