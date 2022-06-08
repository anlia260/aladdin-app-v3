import React, { useState, useEffect, useContext } from 'react'

import { Web3Context } from 'context/Web3Context'
import ACRVIcon from 'assets/pools/acrv.svg'
import { getConvexInfo, getTokenPrice, checkWalletConnect, fb4, cBN, formatBalance } from 'utils'
import styles from './styles.module.scss'
import DepositModal from './coms/DepositModal'
import WithdrawModal from './coms/WithdrawModal'
import Button from 'components/Button'
import useACrv from '../../hook/useACrv'

export default function ActionBoard(props) {
  const [refreshTrigger, setRefreshTrigger] = useState(1)
  const { userInfo, acrvInfo } = useACrv(refreshTrigger)
  const { currentAccount, connectWallet, currentChainId } = useContext(Web3Context)
  const [depositVisible, setDepositVisible] = useState(false)
  const [withdrawVisible, setWithdrawVisible] = useState(false)

  const [CRVConcentrated, setCRVConcentrated] = useState(0)
  const [myAcrvBalance, setMyAcrvBalance] = useState(0)
  const myBalance = cBN(userInfo.allPoolRewardaCrv).plus(userInfo.userAcrvWalletBalance)
  useEffect(async () => {
    const crvPrice = await getTokenPrice('convex-crv')
    setCRVConcentrated(
      cBN(crvPrice)
        .multipliedBy(acrvInfo.totalUnderlying)
        .multipliedBy(acrvInfo.rate),
    )
    setMyAcrvBalance(
      cBN(crvPrice)
        .multipliedBy(myBalance)
        .multipliedBy(acrvInfo.rate),
    )
  }, [acrvInfo, userInfo.userAcrvWalletBalance, userInfo.userACrvBalance])

  const convexApy = getConvexInfo('CRV')?.apy?.project || 0

  const apy = cBN(parseFloat(convexApy))
    .dividedBy(100)
    .dividedBy(365)
    .plus(1)
    .pow(365)
    .minus(1)
    .shiftedBy(2)

  const handleDeposit = () => {
    const flag = checkWalletConnect(currentAccount, connectWallet, currentChainId)
    flag && setDepositVisible(true)
  }

  const handleWithdraw = () => {
    const flag = checkWalletConnect(currentAccount, connectWallet, currentChainId)
    flag && setWithdrawVisible(true)
  }

  const cvxCrvNum = cBN(myBalance).multipliedBy(acrvInfo.rate)
  const acrvText = cBN(myBalance || 0).isZero() ? '' : `≈ ${fb4(cvxCrvNum)} cvxCRV / ${fb4(myAcrvBalance, true)}`
  return (
    <div className={styles.actionBoard}>
      <div className={styles.metaInfo}>
        <div>
          <div className="flex items-center justify-between">
            <img src={ACRVIcon} className="w-10 mr-2" />
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
        <div>Claimable from vault profit: {fb4(userInfo.allPoolRewardaCrv)} aCRV</div>
      </div>
      <div className={styles.actions}>
        <Button theme="lightBlue" onClick={handleDeposit}>
          Deposit
        </Button>
        <Button theme="lightBlue" onClick={handleWithdraw}>
          Withdraw
        </Button>
      </div>
      {depositVisible && <DepositModal onCancel={() => setDepositVisible(false)} />}
      {withdrawVisible && <WithdrawModal setRefreshTrigger={setRefreshTrigger} onCancel={() => setWithdrawVisible(false)} />}
    </div>
  )
}
