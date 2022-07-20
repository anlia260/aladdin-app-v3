import React, { useEffect, useMemo, useState } from 'react'
import { DatePicker } from 'antd'
import Modal from 'components/Modal'
import moment from 'moment'
import config from 'config'
import useApprove from 'hooks/useApprove'
import useErc20Token from 'hooks/useErc20Token'
import useVeCTR from 'config/contract/veCTR'
import NoPayableAction, { noPayableErrorAction } from 'utils/noPayableAction'
import Tip from 'components/Tip'
import useWeb3 from 'hooks/useWeb3'
import styles from './styles.module.scss'
import { basicCheck, cBN, fb4 } from 'utils'
import { WEEK, YEARS, calc4, tipText, shortDate, lockTimeTipText } from "../../util"


export default function LockModal({ onCancel, refreshAction }) {
  const { web3, currentAccount, getBlockNumber } = useWeb3()
  const [lockAmount, setLockAmount] = useState()
  const [locktime, setLocktime] = useState(moment().add(1, 'day'))
  const [locking, setLocking] = useState(false)
  const [isMax, setIsMax] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const veCTR = useVeCTR()

  const { tokenContract: ctrContract, tokenInfo: ctrInfo } = useErc20Token(
    refreshTrigger,
    config.contracts.aladdinCTR,
    config.contracts.veCtr,
  )

  const { refreshTrigger: approveTrigger, BtnWapper } = useApprove({
    allowance: ctrInfo.allowance,
    tokenContract: ctrContract,
    approveAddress: config.contracts.veCtr,
  })

  const amount = ctrInfo.balance ? isMax ? cBN(ctrInfo.balance) : cBN(lockAmount).shiftedBy(18) : cBN(0)

  useEffect(() => {
    setRefreshTrigger(prev => prev + 1)
  }, [approveTrigger])

  useEffect(() => {
    refreshAction(prev => prev + 1)
  }, [refreshTrigger])


  const handleLock = async () => {
    if (!basicCheck(web3, currentAccount)) return
    const lockAmountInWei = amount.toFixed(0, 1)
    setLocking(true)
    try {
      const apiCall = veCTR.methods.create_lock(lockAmountInWei.toString(), locktime.unix())
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 'ctr',
        action: 'lock',
      })
      onCancel()
      setLocking(false)
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      setLocking(false)
      noPayableErrorAction(`error_ctr_lock`, error)
    }
  }

  const addTime = days => {
    setLocktime(moment(moment().add(days, 'day')))
  }

  const vePower = useMemo(() => {

    if (cBN(lockAmount).isLessThan(0) || !lockAmount) {
      return 0
    }

    const timestamp = locktime.utc().unix()

    const unlock_time = Math.floor(timestamp / WEEK) * WEEK;
    const willBe = (unlock_time - moment().utc().unix()) / (4 * YEARS) * lockAmount

    return isNaN(willBe) ? '-' : cBN(willBe).isLessThan(0) ? 0 : cBN(willBe).toFixed(12)

  }, [lockAmount, locktime])

  const setMax = () => {
    setLockAmount(fb4(ctrInfo.balance, false))
    setIsMax(true)
  }

  const disabledDate = current => {
    return current && current.isSameOrBefore(moment())
  };


  const canLock = cBN(ctrInfo.balance).isGreaterThan(0) && amount.isGreaterThan(0) && amount.isLessThanOrEqualTo(ctrInfo.balance)

  const ExtraFooter = () => {
    return <div className="flex justify-between flex-wrap">
      {shortDate.map(i => (
        <div
          key={i.value}
          onClick={() => addTime(i.value)}
          className="text-center w-2/6 underline text-blue-900 cursor-pointer">
          {i.lable}
        </div>
      ))}
    </div>
  }

  return (
    <Modal onCancel={onCancel}>
      <div className={styles.info}>
        <div className="color-white">Lock CTR</div>
      </div>

      <div className="mb-8">
        <div className="mb-1">How much do you want to lock?</div>
        <div className="relative">
          <input type="text" className={styles.input} value={lockAmount} onChange={e => {
            setLockAmount(e.target.value)
            setIsMax(e.target.value === fb4(ctrInfo.balance))
          }} />
          <a className={styles.max} onClick={setMax}>
            MAX
          </a>
        </div>
        <div className="mt-1">Available: {fb4(ctrInfo.balance)} CTR</div>
      </div>

      <div>
        <div className="mb-1 flex items-center gap-1" id="trigger">
          When do you want to lock to?
          <Tip title={tipText} style={{ width: '300px' }} />
        </div>
        <DatePicker
          value={locktime}
          onChange={setLocktime}
          disabledDate={disabledDate}
          className={styles.datePicker}
          getPopupContainer={() => document.getElementById('trigger')}
          showTime={false}
          showToday={false}
          renderExtraFooter={ExtraFooter}
          dropdownClassName={styles.datePickerDropdown}
        />
      </div>

      <div className="my-8">
        <div>Your starting voting power will be: {vePower} veCTR</div>
        <div className='mb-1 flex items-center gap-1'>
          Unlocked Time<Tip title={lockTimeTipText} />
          :{locktime ? calc4(locktime).format('YYYY-MM-DD HH:mm:ss UTCZ') : '-'}
        </div>
      </div>

      <div className={styles.actions}>
        <BtnWapper onClick={handleLock} disabled={!canLock} loading={locking}>
          Lock
        </BtnWapper>
      </div>
    </Modal>
  )
}
