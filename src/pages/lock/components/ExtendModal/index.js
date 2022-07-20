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

const WEEK = 86400 * 7;
const YEARS = 86400 * 365;

export default function ExtendModal({ onCancel, pageData, refreshAction }) {
  const { web3, currentAccount } = useWeb3()
  const [locktime, setLocktime] = useState(moment())
  const [current, setCurrent] = useState()
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

    const timestamp = locktime.unix()

    const unlock_time = Math.floor(timestamp / WEEK) * WEEK;
    const willBe = (unlock_time - moment().utc().unix()) / (4 * YEARS) * lockAmount

    return willBe

  }, [userLocked, locktime])

  useEffect(() => {
    if (userLocked?.end) {
      const date = moment(userLocked?.end * 1000).add(1, 'week')
      setLocktime(moment(userLocked?.end * 1000).add(1, 'week'))
    }
  }, [userLocked])

  // align Thursday
  const calc4 = (m) => {
    let params = m.clone();
    console.log('addtime:current', params.format('lll'), params.weekday())
    // if (params.weekday() < 4) {
    //   params = params.add(4 - params.weekday(), 'day')
    // } else if (params.weekday() > 4) {
    //   params = params.add(7 - params.weekday() + 4, 'day')
    // }
    // console.log('addtime', params.format('lll'), params.weekday(), params.unix(), params.unix() % (86400 * 7))

    const unlock_time = Math.floor(params.unix() / WEEK) * WEEK;
    console.log('addtime', moment(unlock_time * 1000).format('lll'), moment(unlock_time * 1000).weekday(), moment(unlock_time * 1000).unix(), moment(unlock_time * 1000).unix() % (86400 * 7))
    return moment(unlock_time * 1000)
  }


  const addTime = days => {
    const params = moment(moment.unix(userLocked?.end).add(days, 'day'))
    setLocktime(params)
  }


  const disabledDate = current => {
    if (!userLocked?.end) {
      return false
    }
    const calcDate = calc4(current).startOf('day')
    return current && !calcDate.isAfter(moment(userLocked.end * 1000))
  };

  const days = useMemo(() => {
    const params = userLocked?.end ? moment().diff(moment(userLocked?.end * 1000).startOf('day'), 'days', true) : 0
    return Math.abs(params) + 7
  }, [userLocked])

  const shortDate = useMemo(() => {
    return [{
      lable: '4 years',
      disabledDate: days > 1457,
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
      lable: '3 months',
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
  }, [days])

  const handleShortDateClick = (i) => {
    if (!i.disabledDate) {
      addTime(i.value)
      setCurrent(i.value)
    }
  }

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
          {shortDate.map(i =>
            <a key={i.value} className={`${i.disabledDate ? styles.disabled : ''} ${i.value === current ? styles.active : ''}`} onClick={() => handleShortDateClick(i)}>
              {i.lable}
            </a>
          )}
        </div>
      </div>

      <div className="my-8">
        <div>Your starting voting power will be: {fb4(vePower)} veCTR</div>
        <div>Unlocked Time: {locktime ? calc4(locktime).format('YYYY-MM-DD HH:mm:ss UTCZ') : '-'}</div>
      </div>

      <div className={styles.actions}>
        <Button theme="lightBlue" onClick={handleLock} disabled={days > 1457} loading={locking}>
          Extend
        </Button>
      </div>
    </Modal>
  )
}
