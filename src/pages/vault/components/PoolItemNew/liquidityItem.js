import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Web3Context } from 'context/Web3Context'
import cn from 'classnames'
import ArrowDown from 'assets/arrow-down.svg'
import ACRVIcon from 'assets/pools/acrv.svg'
import { useUserPoolInfo } from 'pages/vault/hook/useConvexVaultIFO'
import useWeb3 from 'hooks/useWeb3'
import { cBN, checkWalletConnect, getTokenPrice, getConvexInfo, formatBalance, numberToString, fb4 } from 'utils'
import styles from './styles.module.scss'
import Button from 'components/Button'
import Tip from 'components/Tip'
import DepositModal from './components/DepositModal'
import WithdrawModal from './components/WithdrawModal'
import LiquidityDepositModal from './components/LiquidityDepositModal'
import LiquidityWithdrawModal from './components/LiquidityWithdrawModal'
import cryptoIcons from 'assets/crypto-icons-stack.svg'
const crvLogo = `${cryptoIcons}#crv`

export default function LiquidityItem(props) {
  const { currentAccount, connectWallet, getBlockNumber, checkChain, CHAINSTATUS, currentChainId } = useWeb3()
  const { item: oldItem, poolItem = {}, harvestList } = props
  const item = poolItem.id ? poolItem : oldItem
  const { totalShare = 0, totalUnderlying = 0, lpTokenPrice = 1 } = poolItem
  const [active, setActive] = useState(false)
  const [withdrawClaim, setWithdrawClaim] = useState(false)

  const [liquidityDepositVisible, setLiquidityDepositVisible] = useState(false)
  const [liquidityWithdrawVisible, setLiquidityWithdrawVisible] = useState(false)

  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const { totalSupply, userDeposits, claimable, liquidityApy } = poolItem;

  useEffect(() => {
    props.triggerChange()
  }, [refreshTrigger])


  const tvl = formatBalance(totalSupply, 18, 2)
  const userDeposit = formatBalance(userDeposits, 18, 2)
  const earned = formatBalance(claimable, 18, 2)

  const toggleActive = () => setActive(prev => !prev)

  const handleDeposit = () => {
    const flag = checkWalletConnect(currentAccount, connectWallet, currentChainId)
    flag && setLiquidityDepositVisible(true)
  }

  const handleWithdraw = (isClaim) => {
    const flag = checkWalletConnect(currentAccount, connectWallet, currentChainId)
    if (isClaim) {
      setWithdrawClaim(true)
    } else {
      setWithdrawClaim(false)
    }
    flag && setLiquidityWithdrawVisible(true)

  }

  const displayPool = item.isExpired && cBN(userDeposit || 0).isZero()
  return (
    <div className={cn(styles.poolItemNew, styles.liquidityItem)} style={{ display: displayPool ? 'none' : 'block' }}>
      <div className={cn(styles.briefLine, active && styles.active)} onClick={() => toggleActive()}>
        <div className={styles.poolName}>
          <img src={item.logo} alt={item.name} className={styles.icon} />
          <div>{item.name}</div>
        </div>
        <div>{liquidityApy.toFixed(2)}%</div>
        <div>{!cBN(tvl).isZero() ? `$${tvl}` : '-'}</div>
        {/* <div>{!cBN(userInfo.pendingReward).isZero() ? formatBalance(userInfo.pendingReward, 18, 4) : '-'}</div> */}
        <div>{!cBN(userDeposit || 0).isZero() && userDeposit != '-' ? `$ ${userDeposit}` : '-'}</div>
        <div>{!cBN(earned || 0).isZero() && earned != '-' ? `$ ${earned}` : '-'}</div>
        <div className="flex items-center gap-4">
          <span className="hidden 2xl:block color-blue">More</span>
          <img src={ArrowDown} className={cn('w-8 h-8', active && 'transform rotate-180')} />
        </div>
      </div>
      {active && (
        <div className={styles.detail}>
          <div className="flex items-center">
            <span className={styles.actionTag}>DEPOSIT</span>
            <span className={styles.actionToken}>
              <div className="relative">
                <img src={item.logo} alt={item.name} className="w-8 mr-2" />
                <img src={crvLogo} alt={item.name} className="absolute w-4 h-4 right-1/3 bottom-0" />
              </div>
              {item.name}
            </span>
            <span className={styles.actionTag}>EARN</span>
            <span className={styles.actionToken}>
              <img src={ACRVIcon} className="w-8 mr-2" />
              CTR
            </span>
            <div className={styles.ifoTag}>IFO</div>
          </div>

          <div className={styles.actionHint}>
            Deposit Balancer <span className="text-white font-medium">CTR/aCRV LP</span>
            <br /> During the IFO, the rewards is <span className="text-white font-medium">CTR</span> (extra $CENT equivalent
            to 4% of vaults yield) After the IFP, the reward is a share of vault performance fee in $aCRV
          </div>
          <div className={styles.aprSection}>
            <span className={styles.aprTag}>APY:</span>
            <span className={styles.aprValue}>{liquidityApy.toFixed(2)}%</span>
          </div>

          {/* <div className={styles.moreInfo}>
            <div>
              Base Vault APR: <span className={styles.moreInfoValue}>{baseApy}</span>
            </div>
          </div> */}

          <div className={styles.actions}>
            <Button theme="lightBlue" disabled={poolItem.closeDeposit} onClick={handleDeposit}>
              Deposit
            </Button>
            <Button theme="deepBlue" onClick={handleWithdraw}>
              Withdraw
            </Button>
            <Button theme="deepBlue" onClick={() => handleWithdraw(true)}>
              Claim
            </Button>
          </div>
        </div>
      )}
      {liquidityDepositVisible && (
        <LiquidityDepositModal
          info={poolItem}
          setRefreshTrigger={setRefreshTrigger}
          onCancel={() => setLiquidityDepositVisible(false)}
        />
      )}
      {liquidityWithdrawVisible && (
        <LiquidityWithdrawModal
          info={poolItem}
          withdrawClaim={withdrawClaim}
          setRefreshTrigger={setRefreshTrigger}
          onCancel={() => setLiquidityWithdrawVisible(false)}
        />
      )}
    </div>
  )
}
