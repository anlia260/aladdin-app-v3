import React, { useState, useEffect, useContext } from 'react'

import { Web3Context } from 'context/Web3Context'
import ACRVIcon from 'assets/pools/acrv.svg'
import { getConvexInfo, getTokenPrice, checkWalletConnect, fb4, cBN, formatBalance } from 'utils'
import styles from './styles.module.scss'
import DepositModal from './coms/DepositModal'
import WithdrawModal from './coms/WithdrawModal'
import Button from 'components/Button'
import useActionBoard from '../../controllers/useActionBoard'

export default function ActionBoard(props) {
  const { vaultType } = props
  const [refreshTrigger, setRefreshTrigger] = useState(1)
  const {
    userInfo, acrvInfo,
    myBalance,
    cvxCrvNum,
    poolsRewardaCrv,
    acrvText,
    apy, convexApy, convexInfo, CRVConcentrated } = useActionBoard({ vaultType, refreshTrigger })

  const { currentAccount, connectWallet, currentChainId } = useContext(Web3Context)
  const [depositVisible, setDepositVisible] = useState(false)
  const [withdrawVisible, setWithdrawVisible] = useState(false)


  const _claimableTitle = vaultType == 'new' ? 'Claimable from IFO vault profit' : 'Claimable from vault profit'
  
  const handleDeposit = () => {
    const flag = checkWalletConnect(currentAccount, connectWallet, currentChainId)
    flag && setDepositVisible(true)
  }

  const handleWithdraw = () => {
    const flag = checkWalletConnect(currentAccount, connectWallet, currentChainId)
    flag && setWithdrawVisible(true)
  }

  return (
    <div className={styles.actionBoard}>
      <div className={styles.metaInfo}>
        <div>
          <div className="flex items-center justify-between">
            <img src={ACRVIcon} className="w-10 mr-2" alt="acrv" />
            <div>
              <div className="color-white">Concentrator</div>
              <div className="color-light-blue">aCRV</div>
            </div>
          </div>
        </div>
        <div>
          <div className="color-light-blue">APY</div>
          <div className="color-white">{apy.toFixed(2)}%</div>
        </div>
      </div>
      <div>
        {/* <div className={cn('color-light-blue', styles.chartTitle)}>aCRV Net Value</div> */}
        {/* <div className={styles.chart} /> */}
        <div className={styles.chartInfo}>
          <div>
            <span className="color-light-blue">Current AUM: </span>
            <span className="color-white">{fb4(CRVConcentrated, true)}</span>
          </div>
          <div>
            <span className="color-light-blue">Current Index: </span>
            <span className="color-white">{acrvInfo.rate}</span>
            {/* <span className={cn(styles.trend, styles.up)}>+12.5%</span> */}
          </div>
        </div>
      </div>
      <div className={styles.balanceWrapper}>
        <div className="color-light-blue">My Balance</div>
        <div>
          <div className="color-light-blue">{fb4(myBalance)} aCRV</div>
          <div className="color-white">{acrvText}</div>
        </div>
      </div>
      <div className={styles.actionMoreInfo}>
        <div>Wallet Balance: {fb4(userInfo.userAcrvWalletBalance)} aCRV</div>
        {poolsRewardaCrv > 0 && <div>{_claimableTitle}: {fb4(poolsRewardaCrv)} aCRV</div>}
      </div>
      <div className={styles.actions}>
        <Button theme="lightBlue" onClick={handleDeposit}>
          Deposit
        </Button>
        <Button theme="lightBlue" onClick={handleWithdraw}>
          Withdraw
        </Button>
      </div>
      {depositVisible && <DepositModal vaultType={vaultType} onCancel={() => setDepositVisible(false)} />}
      {withdrawVisible && <WithdrawModal vaultType={vaultType} setRefreshTrigger={setRefreshTrigger} onCancel={() => setWithdrawVisible(false)} />}
    </div>
  )
}
