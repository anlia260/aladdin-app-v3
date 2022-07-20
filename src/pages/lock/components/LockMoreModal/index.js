import React, { useEffect, useMemo, useState } from 'react'
import Modal from 'components/Modal'
import moment from 'moment'
import config from 'config'
import Tip from 'components/Tip'
import useApprove from 'hooks/useApprove'
import useErc20Token from 'hooks/useErc20Token'
import useVeCTR from 'config/contract/veCTR'
import NoPayableAction, { noPayableErrorAction } from 'utils/noPayableAction'
import useWeb3 from 'hooks/useWeb3'
import styles from './styles.module.scss'
import { basicCheck, calc4, cBN, fb4 } from 'utils'
import { YEARS, lockTimeTipText } from "../../util"

export default function LockMoreModal({ onCancel, pageData, refreshAction }) {
  const { web3, currentAccount } = useWeb3()
  const [lockAmount, setLockAmount] = useState()
  const [locking, setLocking] = useState(false)
  const [isMax, setIsMax] = useState(false)
  const { userLocked } = pageData.contractInfo
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
    setLocking(true)
    try {
      const apiCall = veCTR.methods.increase_amount(lockAmountInWei.toString())
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 'ctr',
        action: 'lock',
      })
      onCancel()
      setRefreshTrigger(prev => prev + 1)
      setLocking(false)
    } catch (error) {
      setLocking(false)
      noPayableErrorAction(`error_ctr_lock`, error)
    }
  }


  const vePower = useMemo(() => {
    const locktime = userLocked?.end ?? 0
    if (!lockAmount || cBN(lockAmount).isLessThan(0)) {
      return 0
    }

    const willBe = (locktime - moment().utc().unix()) / (4 * YEARS) * lockAmount

    return willBe

  }, [userLocked, lockAmount])


  const setMax = () => {
    setIsMax(true)
    setLockAmount(fb4(ctrInfo.balance, false))
  }

  const amount = isMax ? cBN(ctrInfo.balance) : cBN(lockAmount).shiftedBy(18)
  const canLock = cBN(ctrInfo.balance).isGreaterThan(0) && amount.isGreaterThan(0) && amount.isLessThanOrEqualTo(ctrInfo.balance)

  return (
    <Modal onCancel={onCancel}>
      <div className={styles.info}>
        <div className="color-white">Lock More</div>
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

      <div className="my-8">
        <div>Your starting voting power will be: {vePower} veCTR</div>
        <div className='mb-1 flex items-center gap-1'>
          Unlocked Time<Tip title={lockTimeTipText} />
          :{userLocked.end ? moment(userLocked.end * 1000).format('YYYY-MM-DD HH:mm:ss UTCZ') : '-'}
        </div>
      </div>

      <div className={styles.actions}>
        <BtnWapper theme="lightBlue" onClick={handleLock} disabled={!canLock} loading={locking}>
          Lock
        </BtnWapper>
      </div>
    </Modal>
  )
}
