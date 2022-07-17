import React, { useContext } from 'react'
import config from 'config'
import cn from 'classnames'
import { Web3Context } from '../../context/Web3Context'

import styles from './styles.module.scss'

export default function NetworkCheck() {
  const { currentChainId } = useContext(Web3Context)
  return config.CHAIN_ID === currentChainId ? (
    ''
  ) : (
    <div>
      <div className={cn(styles.box, 'visible-pc mr-3')}>
        Please switch your network to {config.CHAIN_MAPPING[config.CHAIN_ID] || 'mainnet-fork'}
      </div>
      <div className={cn(styles.box, 'visible-tablet mr-2 text-sm')}>Wrong Network</div>
    </div>
  )
}
