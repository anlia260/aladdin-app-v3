import React, { useState, useContext, useMemo } from 'react'
import { Web3Context } from 'context/Web3Context'
import Modal from 'components/Modal'
import Input from 'components/Input'
import Select from 'components/Select'
import config from 'config'
import { basicCheck, formatBalance, cBN, numberToString } from 'utils'
import NoPayableAction, { noPayableErrorAction } from 'utils/noPayableAction'
import Button from 'components/Button'
import useActionBoard from 'pages/vault/controllers/useActionBoard'
import ACRV from 'config/contract/ACRV'
import CVXCRV from 'config/contract/CVXCRV'
import CRV from 'config/contract/CRV'
import styles from './styles.module.scss'

const DepositModal = props => {
  const { onCancel } = props
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [selectValue, setSelectValue] = useState(1)
  const [selectToken, setSelectToken] = useState('cvxCRV')
  const selectOption = ['cvxCRV', 'CRV']
  const { currentAccount, web3 } = useContext(Web3Context)
  const aCrvContract = ACRV()
  const cvxCrvContract = CVXCRV()
  const crvContract = CRV()

  const { userInfo, acrvInfo } = useActionBoard({ refreshTrigger })

  const { userCvxCrvBalance, userCvxCrvAllowance, userCrvBalance, userCrvAllowance } = userInfo
  const [depositAmount, setDepositAmount] = useState()
  const [depositNum, setDepositNum] = useState(0)

  // const depositNum = cBN(acrvInfo.totalSupply || 1)
  //   .dividedBy(acrvInfo.totalUnderlying || 1)
  //   .multipliedBy(depositAmount || 0)
  //   .shiftedBy(-18)
  const [approving, setApproving] = useState(false)
  const [depositing, setDepositing] = useState(false)

  const canDeposit = selectValue == 1 ? userCvxCrvAllowance > 0 : userCrvAllowance > 0

  const handleApprove = async () => {
    if (!basicCheck(web3, currentAccount)) return
    setApproving(true)
    try {
      let apiCall
      if (selectValue == 2) {
        apiCall = crvContract.methods.approve(config.contracts.convexVaultAcrv, web3.utils.toWei('1000000000000000000', 'ether'))
      } else {
        apiCall = cvxCrvContract.methods.approve(
          config.contracts.convexVaultAcrv,
          web3.utils.toWei('1000000000000000000', 'ether'),
        )
      }

      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 'earn',
        action: 'approv',
      })
      setApproving(false)
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      setApproving(false)
      noPayableErrorAction(`error_earn_approve`, error)
    }
  }

  const handleDeposit = async () => {
    if (!basicCheck(web3, currentAccount)) return
    setDepositing(true)
    const depositAmountInWei = cBN(depositAmount || 0)
      .toFixed(0, 1)
      .toString()
    const depositMethod = selectValue == 2 ? 'depositWithCRV' : 'deposit'

    try {
      const apiCall = aCrvContract.methods[depositMethod](currentAccount, depositAmountInWei)
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 'acrv',
        action: 'deposit',
      })
      setDepositing(false)
      setRefreshTrigger(prev => prev + 1)
      onCancel()
    } catch (error) {
      setDepositing(false)
      noPayableErrorAction(`error_acrv_deposit`, error)
    }
  }

  const [inputReseter, setInputReseter] = useState(0)

  const handleChangeSelect = val => {
    setInputReseter(prev => prev + 1)
    let _index = 0
    if (val == 'cvxCRV') {
      _index = 1
    }
    if (val == 'CRV') {
      _index = 2
    }
    setSelectToken(val)
    setSelectValue(_index)
    setDepositAmount(0)
  }

  useMemo(async () => {
    const depositAmountInWei = cBN(depositAmount || 0)
      .toFixed(0, 1)
      .toString()
    let depositNum = cBN(0)
    if (selectValue == 2) {
      try {
        const apiCall = await aCrvContract.methods.depositWithCRV(currentAccount, depositAmountInWei).call({ from: currentAccount })
        depositNum = cBN(apiCall)
          .shiftedBy(-18)
      } catch (e) {

      }
    } else {
      depositNum = cBN(acrvInfo.totalSupply || 1)
        .dividedBy(acrvInfo.totalUnderlying || 1)
        .multipliedBy(depositAmount || 0)
        .shiftedBy(-18)
    }
    setDepositNum(depositNum)
  }, [depositAmount])

  const handleInputChange = val => setDepositAmount(val)
  const balance = selectToken == 'cvxCRV' ? userCvxCrvBalance : userCrvBalance

  const canSubmit = cBN(depositAmount).isGreaterThan(0) && cBN(depositAmount).isLessThanOrEqualTo(balance)

  return (
    <Modal onCancel={onCancel}>
      <div className={styles.info}>
        <div className="color-white">Deposit</div>
        <div className="color-light-blue">{selectToken} for aCRV</div>
      </div>
      <Select onChange={handleChangeSelect} title="Deposit token" value={selectToken} options={selectOption} />
      <Input
        balance={balance}
        onChange={handleInputChange}
        reset={inputReseter}
        token={selectToken}
        depositFor={`${cBN(depositNum).isZero() ? '-' : numberToString(depositNum.toString())} aCRV`}
        withdrawFee={`${acrvInfo.withdrawFee ? formatBalance(acrvInfo.withdrawFee, 7) : '-'}%`}
      />
      <div className={styles.actions}>
        {canDeposit ? (
          <Button theme="lightBlue" onClick={handleDeposit} disabled={!canSubmit} loading={depositing}>
            Deposit
          </Button>
        ) : (
          <Button theme="lightBlue" onClick={handleApprove} loading={approving}>
            Approve
          </Button>
        )}
      </div>
    </Modal>
  )
}

export default DepositModal
