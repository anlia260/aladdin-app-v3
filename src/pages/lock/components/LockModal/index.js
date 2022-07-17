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

export default function LockModal({ onCancel, refreshAction }) {
  const { web3, currentAccount, checkChain, getBlockNumber } = useWeb3()
  const [lockAmount, setLockAmount] = useState()
  const [locktime, setLocktime] = useState(moment().add(1, 'day'))
  const [locking, setLocking] = useState(false)
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

  useEffect(() => {
    setRefreshTrigger(prev => prev + 1)
  }, [approveTrigger])

  useEffect(() => {
    refreshAction(prev => prev + 1)
  }, [refreshTrigger])


  const handleLock = async () => {
    if (!basicCheck(web3, currentAccount)) return
    const lockAmountInWei = cBN(lockAmount || 0).shiftedBy(18).toFixed(0, 1)

    try {
      const apiCall = veCTR.methods.create_lock(lockAmountInWei.toString(), locktime.unix())
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 'ctr',
        action: 'lock',
      })
      onCancel()
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      noPayableErrorAction(`error_ctr_lock`, error)
    }
  }

  const addTime = days => setLocktime(moment(moment().add(days, 'day')))

  const vePower = useMemo(() => {

    if (cBN(lockAmount).isLessThan(0) || !lockAmount) {
      return 0
    }

    const timestamp = locktime.utc().unix()
    const WEEK = 86400 * 7;
    const YEARS = 86400 * 365;

    const unlock_time = Math.floor(timestamp / WEEK) * WEEK;
    const willBe = (unlock_time - moment().utc().unix()) / (4 * YEARS) * lockAmount

    return willBe

  }, [lockAmount, locktime])

  const setMax = () => {
    setLockAmount(fb4(ctrInfo.balance, false))
  }

  return (
    <Modal onCancel={onCancel}>
      <div className={styles.info}>
        <div className="color-white">Lock CTR</div>
      </div>

      <div className="mb-8">
        <div className="mb-1">How much do you want to lock?</div>
        <div className="relative">
          <input type="text" className={styles.input} value={lockAmount} onChange={e => setLockAmount(e.target.value)} />
          <a className={styles.max} onClick={setMax}>
            MAX
          </a>
        </div>
        <div className="mt-1">Available: {fb4(ctrInfo.balance)} CTR</div>
      </div>

      <div>
        <div className="mb-1 flex items-center gap-1">
          When do you want to lock to?
          <Tip
            title={`Lock CTR will receive veCTR. The longer the lock time, the more veCTR received.<br/>
                    1 CTR locked for 4 years = 1 veCTR<br/>
                    1 CTR locked for 3 years = 0.75 veCTR<br/>
                    1 CTR locked for 2 years = 0.5 veCTR<br/>
                    1 CTR locked for 1 years = 0.25 veCTR`
            }
            style={{ width: '300px' }}
          />
        </div>
        <DatePicker
          value={locktime}
          onChange={setLocktime}
          className={styles.datePicker}
          showTime={true}
          dropdownClassName={styles.datePickerDropdown}
        />
        <div className={styles.months}>
          <a onClick={() => addTime(1460)}>4 years</a>
          <a onClick={() => addTime(365)}>1 years</a>
          <a onClick={() => addTime(180)}>6 months</a>
          <a onClick={() => addTime(90)}>3 months</a>
          <a onClick={() => addTime(30)}>1 months</a>
          <a onClick={() => addTime(7)}>1 week</a>
        </div>
      </div>

      <div className="my-8">
        <div>Your starting voting power will be: {vePower} veCTR</div>
        <div>Unlocked Time: {locktime.format('lll')}</div>
      </div>

      <div className={styles.actions}>
        <BtnWapper onClick={handleLock} loading={locking}>
          Lock
        </BtnWapper>
      </div>
    </Modal>
  )
}
