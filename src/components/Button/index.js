import React, { useContext } from 'react'
import IOSLoadingIcon from '../IOSLoadingIcon'
import config from 'config'
import { notification } from 'antd'
import styles from './styles.module.scss'
import { Web3Context } from '../../context/Web3Context'

export default function Button({
  onClick,
  loading,
  theme,
  children,
  disabled,
  // pure means this button doesn't have web3 related actions
  pure,
}) {
  const { currentChainId } = useContext(Web3Context)

  const handClick = () => {
    if (!pure && config.CHAIN_ID !== currentChainId) {
      notification.error({
        key: `check_wallet_connect`,
        message: `wrong network connect`,
        description: `Please switch your network to Ethereum ${config.CHAIN_MAPPING[config.CHAIN_ID] || 'mainnet-fork'}`,
      })
      return
    }
    if (!loading && !disabled && onClick) {
      onClick()
    }
  }
  return (
    <button className={styles[theme]} onClick={handClick} disabled={disabled}>
      {children} <IOSLoadingIcon show={loading} />
    </button>
  )
}
