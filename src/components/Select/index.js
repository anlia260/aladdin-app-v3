import React, { useState } from 'react'
import cn from 'classnames'
import ArrowDown from 'assets/arrow-down.svg'
import styles from './styles.module.scss'

export default function Select(props) {
  const { hint, title, options, onChange, value } = props
  const [optionVisible, setOptionVisible] = useState(false)

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

  const handleSelectChange = value => {
    if (onChange) {
      onChange(value)
      setOptionVisible(false)
    }
  }

  return (
    <div className={styles.selectWrapper}>
      <div className={styles.selectTop}>{title && <Info name={title} />}</div>
      <div className={styles.selectBox}>
        <div className={cn(styles.select, 'flex justify-between items-center')} onClick={() => setOptionVisible(prev => !prev)}>
          <div>{value}</div>
          <img src={ArrowDown} className="w-6" />
        </div>
        {/* {optionVisible && ( */}
        <div className={cn(styles.options, optionVisible && styles.visible)}>
          {options.map(option => (
            <div
              key={option}
              onClick={() => handleSelectChange(option)}
              className={cn(styles.option, option === value && styles.active)}
            >
              {option}
            </div>
          ))}
        </div>
        {/* )} */}

        {/* <select onChange={handleSelectChange}>
          {options.map(option => (
            <option key={option} value={option} className={styles.option}>
              {option}
            </option>
          ))}
        </select> */}
      </div>

      <div className={styles.selectBottom}>{hint && <Info nocolon name={hint} />}</div>
    </div>
  )
}
