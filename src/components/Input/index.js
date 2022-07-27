import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import Tip from 'components/Tip'
import styles from './styles.module.scss'
import { fb4, cBN, formatBalance } from 'utils'

export const Info = ({ name, value, hint }) => {
  return (
    <div>
      <span className="color-light-blue">{name}: </span>
      <span className="inline-flex items-center gap-1">
        {value} {hint && <Tip title={hint} />}
      </span>
    </div>
  )
}

export default function Input(props) {
  const {
    balance,
    token,
    vaultWithdrawFee,
    feeName,
    available,
    availableHint,
    disabled,
    fixPercent,
    depositFor,
    withdrawFee,
    onChange,
    reset,
    decimals,
  } = props

  const [percent, setPercent] = useState(0)
  const [value, setValue] = useState('')

  const percents = [25, 50, 75, 100]

  useEffect(() => {
    if (fixPercent) {
      setPercent(fixPercent)
      changeInputVal(fixPercent)
    }
  }, [fixPercent, available])

  useEffect(() => {
    if (reset > 0) {
      setPercent(0)
      setValue('')
      onChange && onChange(0)
    }
  }, [reset])

  useState(() => {
    if (!fixPercent) {
      setPercent(0)
    }
  }, [value])

  const changeInputVal = percent => {
    if (balance && !cBN(balance).isZero() && !cBN(balance).isNaN()) {
      const value = cBN(balance)
        .times(percent)
        .div(100)
      setValue(formatBalance(value, decimals ?? 18, 4))
      onChange && onChange(value, percent)
    }

    if (available && !cBN(available).isZero() && !cBN(available).isNaN()) {
      const val = cBN(available)
        .times(percent)
        .div(100)
      setValue(formatBalance(val, decimals ?? 18, 4))
      onChange && onChange(val, percent)
    }
  }

  const percentChange = percent => {
    if (fixPercent) {
      return
    }
    setPercent(percent)
    changeInputVal(percent)
  }

  useEffect(() => {
    if (typeof balance !== 'undefined') {
      changeInputVal(cBN(balance).isZero() ? 0 : percent)
      if (cBN(balance).isZero()) {
        setValue('')
        setPercent(0)
      }
    }
  }, [balance])

  const handleInputChange = e => {
    if (!fixPercent) {
      setPercent(0)
    }
    let _value = e.target.value;
    const valString = new RegExp(/,/g);
    if (valString.test(_value)) {
      _value = _value.replace(/,/g, '');
    }

    if(value === '0' && _value.indexOf('.') === -1){
      _value = _value.slice(1)
    }

    setValue(_value)
    onChange && onChange(cBN(_value || 0).shiftedBy(decimals ?? 18), percent)
  }

  return (
    <div className={styles.inputWrapper}>
      <div className={styles.inputTop}>
        {!cBN(balance).isNaN() && <Info name="Balance" value={`${fb4(balance, false, decimals)} ${token}`} />}
        {!cBN(available).isNaN() && <Info name="Available" value={`${fb4(available)} ${token}`} hint={availableHint} />}
        {(!cBN(balance).isNaN() || !cBN(available).isNaN()) && (
          <div className={styles.percents}>
            {percents.map(item => (
              <div
                key={item}
                className={cn(styles.percent, item === percent && styles.active)}
                onClick={() => percentChange(item)}
              >
                {item}%
              </div>
            ))}
          </div>
        )}
      </div>
      <input onChange={handleInputChange} value={value} disabled={disabled} />
      <div className={styles.inputBottom}>
        {vaultWithdrawFee && <Info name={`${feeName || 'Vault Withdraw'} Fee`} value={vaultWithdrawFee || '-'} />}
        {withdrawFee && <Info name={`${feeName || 'Withdraw'} Fee`} value={withdrawFee || '-'} />}
        {depositFor && <Info name="Deposit for" value={depositFor || '-'} />}
      </div>
    </div>
  )
}
