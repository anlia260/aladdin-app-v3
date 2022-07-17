import React, { useEffect, useMemo, useState } from 'react'
import { DatePicker } from 'antd'
import Modal from 'components/Modal'
import moment from 'moment'
import Tip from 'components/Tip'
import useWeb3 from 'hooks/useWeb3'
import useVeCTR from 'config/contract/veCTR'
import NoPayableAction, { noPayableErrorAction } from 'utils/noPayableAction'
import { basicCheck, cBN, fb4 } from 'utils'
import Button from 'components/Button'
import styles from './styles.module.scss'

export default function ExtendModal({ onCancel, pageData, refreshAction }) {
  const { web3, currentAccount } = useWeb3()
  const [locktime, setLocktime] = useState(moment())
  const [locking, setLocking] = useState(false)
  const { userLocked } = pageData.contractInfo
  const veCTR = useVeCTR()


  const handleLock = async () => {
    if (!basicCheck(web3, currentAccount)) return
    setLocking(true)
    try {
      const apiCall = veCTR.methods.increase_unlock_time(locktime.unix())
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 'ctr',
        action: 'lock',
      })
      onCancel()
      refreshAction(prev => prev + 1)
      setLocking(false)
    } catch (error) {
      setLocking(false)
      noPayableErrorAction(`error_ctr_lock`, error)
    }
  }


  const vePower = useMemo(() => {
    if (!locktime) {
      return 0
    }

    const lockAmount = userLocked?.amount ?? 0

    if (!lockAmount || cBN(userLocked?.amount ?? 0).isLessThan(0)) {
      return 0
    }

    const timestamp = locktime.utc().unix()
    const WEEK = 86400 * 7;
    const YEARS = 86400 * 365;

    const unlock_time = Math.floor(timestamp / WEEK) * WEEK;
    const willBe = (unlock_time - moment().utc().unix()) / (4 * YEARS) * lockAmount

    return willBe

  }, [userLocked, locktime])

  useEffect(() => {
    if (userLocked?.end) {
      setLocktime(moment(userLocked?.end * 1000).add(1, 'day'))
    }
  }, [userLocked])


  const addTime = days => setLocktime(moment(moment().add(days, 'day')))


  const disabledDate = current => {
    if (!userLocked?.end) {
      return false
    }
    return current && current < moment(userLocked.end * 1000).endOf('day');
  };

  const shortDate = useMemo(() => {

    const days = userLocked?.end ? Math.abs(moment().diff(moment(userLocked?.end * 1000), 'days')) : 0

    return [{
      lable: '4 years',
      disabledDate: days > 1460,
      value: 1460
    }, {
      lable: '1 years',
      disabledDate: days > 365,
      value: 365
    }, {
      lable: '6 months',
      disabledDate: days > 180,
      value: 180
    }, {
      lable: '6 months',
      disabledDate: days > 90,
      value: 90
    }, {
      lable: '1 months',
      disabledDate: days > 30,
      value: 30
    }, {
      lable: '1 week',
      disabledDate: days > 7,
      value: 7
    }]
  }, [userLocked])

  return (
    <Modal onCancel={onCancel}>
      <div className={styles.info}>
        <div className="color-white">Extend</div>
      </div>

      <div>
        <div className="mb-1 flex items-center gap-1">
          When do you want to lock to?{' '}
          <Tip
            title={`Lock CTR will receive veCTR. The longer the lock time, the more veCTR received.<br/>
              1 CTR locked for 4 years = 1 veCTR<br/>
              1 CTR locked for 3 years = 0.75 veCTR<br/>
              1 CTR locked for 2 years = 0.5 veCTR<br/>
              1 CTR locked for 1 years = 0.25 veCTR`}
            style={{ width: '300px' }}
          />
        </div>
        <DatePicker
          value={locktime}
          onChange={setLocktime}
          disabledDate={disabledDate}
          className={styles.datePicker}
          showTime={false}
          dropdownClassName={styles.datePickerDropdown}
        />
        <div className={styles.months}>
          {shortDate.map(i => <a className={i.disabledDate ? styles.disabled : ''} onClick={() => {
            if (!i.disabledDate) {
              addTime(i.value)
            }

          }}>{i.lable}</a>)}
        </div>
      </div>

      <div className="my-8">
        <div>Your starting voting power will be: {fb4(vePower)} veCTR</div>
        <div>Unlocked Time: {locktime ? locktime.format('lll') : '-'}</div>
      </div>

      <div className={styles.actions}>
        <Button theme="lightBlue" onClick={handleLock} loading={locking}>
          Extend
        </Button>
      </div>
    </Modal>
  )
}
