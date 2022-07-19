import React, { useState } from 'react'
import cn from 'classnames'
import { useUpdateEffect } from 'ahooks'
import ArrowDown from 'assets/arrow-down.svg'
import ACRVIcon from 'assets/pools/acrv.svg'
import useWeb3 from 'hooks/useWeb3'
import { cBN, checkWalletConnect } from 'utils'
import styles from './styles.module.scss'
import Button from 'components/Button'
import { VAULT_LIST, VAULT_LIST_IFO } from 'config/convexVault'
import DepositModal from './components/DepositModal'
import WithdrawModal from './components/WithdrawModal'
import LiquidityDepositModal from './components/LiquidityDepositModal'
import LiquidityWithdrawModal from './components/LiquidityWithdrawModal'
import cryptoIcons from 'assets/crypto-icons-stack.svg'
import Tip from 'components/Tip'
const crvLogo = `${cryptoIcons}#crv`

export default function PoolItemNew(props) {
  const { currentAccount, connectWallet, currentChainId } = useWeb3()
  const { item, poolItem = {}, harvestList } = props
  const { earned, tvl, ctrApy, ctrCurrentApy, userInfo, convexInfo } = item
  const [active, setActive] = useState(false)

  const [depositVisible, setDepositVisible] = useState(false)
  const [withdrawVisible, setWithdrawVisible] = useState(false)
  const [liquidityDepositVisible, setLiquidityDepositVisible] = useState(false)
  const [liquidityWithdrawVisible, setLiquidityWithdrawVisible] = useState(false)

  const [refreshTrigger, setRefreshTrigger] = useState(null)

  useUpdateEffect(() => {
    const refreshItmeIndex =
      VAULT_LIST.filter(i => !i.isExpired).length + VAULT_LIST_IFO.filter(i => !i.isExpired).findIndex(i => i.id === item.id)
    props.triggerChange(refreshItmeIndex)
  }, [refreshTrigger])

  const toggleActive = () => setActive(prev => !prev)

  const handleDeposit = () => {
    const flag = checkWalletConnect(currentAccount, connectWallet, currentChainId)
    flag && setDepositVisible(true)
  }

  const handleWithdraw = () => {
    const flag = checkWalletConnect(currentAccount, connectWallet, currentChainId)
    flag && setWithdrawVisible(true)
  }

  const showApy = cBN(convexInfo?.curveApys?.baseApy ?? 0)
    .plus(ctrApy ?? 0)
    .toFixed(2)
  const showCurrentApy = cBN(convexInfo?.curveApys?.baseApy ?? 0)
    .plus(ctrCurrentApy ?? 0)
    .toFixed(2)
  const displayPool = item.isExpired && cBN(earned || 0).isZero()
  return (
    <div className={styles.poolItemNew} style={{ display: displayPool ? 'none' : 'block' }}>
      <div className={cn(styles.briefLine, active && styles.active)} onClick={() => toggleActive()}>
        <div className={styles.poolName}>
          <img src={item.logo} alt={item.name} className={styles.icon} />
          <div>{item.name}</div>
        </div>
        <div>{isNaN(showApy) ? '-' : showApy}%</div>
        <div>{(!cBN(tvl).isZero() && tvl != undefined) ? `${tvl}` : '-'}</div>
        {/* <div>{!cBN(userInfo.pendingReward).isZero() ? formatBalance(userInfo.pendingReward, 18, 4) : '-'}</div> */}
        <div>{!cBN(earned || 0).isZero() && earned != '-' ? `$ ${earned}` : '-'}</div>
        <div className="flex items-center gap-4">
          <span className="hidden 2xl:block color-blue">More</span>
          <img alt="arrow-down" src={ArrowDown} className={cn('w-8 h-8', active && 'transform rotate-180')} />
        </div>
      </div>
      {active && (
        <div className={styles.detail}>
          <div className="flex items-start flex-col gap-2 md:flex-row md:items-center md:gap-0">
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
              <img src={ACRVIcon} alt="acrv-icon" className="w-8 mr-2" />
              CTR
              <div className={styles.ifoTag}>IFO</div>
            </span>

          </div>
          <div className={styles.actionHint}>
            Deposit liquidity into{' '}
            <a target="_blank" href={convexInfo?.depositInfo.url} className="font-medium underline">
              {item.nameShow}
            </a>{' '}
            (without staking in the Curve gauge), then stake{' '}
            <span className="font-medium text-white">{item.stakeTokenSymbol}</span> here.<br />
            During the IFO, vault rewards $aCRV will be replaced by <span className="text-white font-medium">$CTR</span> 1:1
          </div>

          <div className={styles.aprSection}>
            <span className={styles.aprTag}>APY:</span>
            <span className={styles.aprValue}>{isNaN(showApy) ? '-' : showApy}%</span> <Tip
              title={`Current Apy : ${isNaN(showCurrentApy) ? '-' : showCurrentApy}% <br/> Base Curve vAPR: ${(convexInfo?.curveApys?.baseApy ?? 0).toFixed(2)}% <br/> CTR APR: ${isNaN(ctrCurrentApy) ? '-' : ctrCurrentApy || 0}%`}
            />
          </div>

          <div className={styles.moreInfo}>
            <div>
              Base Curve vAPR: <span className={styles.moreInfoValue}>{(convexInfo?.curveApys?.baseApy ?? 0).toFixed(2)}%</span>
            </div>
            <div>
              CTR APR: <span className={styles.moreInfoValue}>{isNaN(ctrApy) ? '-' : ctrApy || 0}%</span>
            </div>
          </div>

          <div className={styles.actions}>
            <Button theme="lightBlue" disabled={item.closeDeposit} onClick={handleDeposit}>
              Deposit
            </Button>
            <Button theme="deepBlue" onClick={handleWithdraw}>
              Withdraw
            </Button>
          </div>
        </div>
      )}
      {depositVisible && (
        <DepositModal info={item} setRefreshTrigger={setRefreshTrigger} onCancel={() => setDepositVisible(false)} />
      )}
      {withdrawVisible && (
        <WithdrawModal
          info={item}
          harvestList={harvestList}
          userShares={userInfo?.shares}
          setRefreshTrigger={setRefreshTrigger}
          onCancel={() => setWithdrawVisible(false)}
        />
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
          harvestList={harvestList}
          userShares={userInfo?.shares}
          setRefreshTrigger={setRefreshTrigger}
          onCancel={() => setLiquidityWithdrawVisible(false)}
        />
      )}
    </div>
  )
}
