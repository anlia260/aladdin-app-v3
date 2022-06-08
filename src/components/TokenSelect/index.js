import React, { useState } from 'react'
import cn from 'classnames'
import ArrowDown from 'assets/arrow-down.svg'
import cryptoIcons from 'assets/crypto-icons-stack.svg'
import styles from './styles.module.scss'

import useTokens from 'pages/vault/hook/useTokenInfo'
import { formatBalance } from 'utils'
const crvLogo = `${cryptoIcons}#crv`

export default function TokenSelect(props) {
  const { hint, title, options, onChange, value } = props
  const [optionVisible, setOptionVisible] = useState(false)
  const { tokenBalance } = useTokens(
    options.map(i => i.address),
    options,
  )

  const Info = ({ name, value, nocolon }) => {
    return (
      <div>
        <span className="color-light-blue">
          {name}
          {nocolon ?? ':'}
        </span>
        {value && <span>{value}</span>}
      </div>
    )
  }

  const handleSelectChange = token => {
    if (onChange) {
      onChange(token)
      setOptionVisible(false)
    }
  }

  const renderIcon = (isLp, icon) => {
    const imgSrc = (icon.includes('static/media/') || icon.includes('data:')) ? icon : `${cryptoIcons}#${icon}`
    if (isLp) {
      return (
        <div className="relative">
          <img src={imgSrc} className="w-6 mr-2" />
          <img src={crvLogo} className="absolute w-3 h-3 right-1/3 bottom-0" />
        </div>
      )
    }

    return <img src={imgSrc} className="w-6 mr-2" />
  }

  return (
    <div className={styles.selectWrapper}>
      <div className={styles.selectTop}>{title && <Info name={title} />}</div>
      <div className={styles.selectBox}>
        <div className={cn(styles.select, 'flex justify-between items-center')} onClick={() => setOptionVisible(prev => !prev)}>
          <div className="flex items-center">
            {renderIcon(value.isLp, value?.icon)}
            {value?.symbol}
          </div>
          <img src={ArrowDown} className="w-6" />
        </div>
        <div className={cn(styles.options, optionVisible && styles.visible)}>
          {options
            .filter(item => item.address)
            .map((option, index) => (
              <div
                key={option.address}
                onClick={() => handleSelectChange(option)}
                className={cn(
                  'flex items-center justify-between',
                  styles.option,
                  option.address === value.address && styles.active,
                )}
              >
                <div className="flex items-center">
                  {renderIcon(option.isLp, option?.icon)}
                  {option?.symbol}
                </div>
                <div className="text-align-right">
                  <div>{tokenBalance[index] ? formatBalance(tokenBalance[index], option.decimals ?? 18, 4) : 0}</div>
                  {/* <div className="text-xs">~$300,000</div> */}
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className={styles.selectBottom}>{hint && <Info nocolon name={hint} />}</div>
    </div>
  )
}
