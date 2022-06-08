import React, { useContext } from 'react'
import config from 'config'
import { Web3Context } from '../../context/Web3Context'

export default function NetworkCheck() {
  const { currentChainId } = useContext(Web3Context)
  return config.CHAIN_ID === currentChainId ? (
    ''
  ) : (
    <div>
      <div className="visible-pc px-3 py-3 mr-3 text-white bg-red-600">
        Please switch your network to {config.CHAIN_MAPPING[config.CHAIN_ID] || 'mainnet-fork'}
      </div>
      <div className="visible-tablet px-3 py-2 mr-1 text-white bg-red-600 text-sm">Wrong Network</div>
    </div>
  )
}
