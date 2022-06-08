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

export default function PoolItemNew(props) {
  const { currentAccount, connectWallet, getBlockNumber, checkChain, CHAINSTATUS, currentChainId } = useWeb3()
  const { item: oldItem, poolItem = {}, harvestList } = props
  const item = poolItem.id ? poolItem : oldItem
  const { totalShare = 0, totalUnderlying = 0, lpTokenPrice = 1 } = poolItem
  const [active, setActive] = useState(false)

  const [depositVisible, setDepositVisible] = useState(false)
  const [withdrawVisible, setWithdrawVisible] = useState(false)
  const [liquidityDepositVisible, setLiquidityDepositVisible] = useState(false)
  const [liquidityWithdrawVisible, setLiquidityWithdrawVisible] = useState(false)
  const [userInfo, setUserInfo] = useState({})

  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const { convexVaultsIFOContract } = useUserPoolInfo(item, refreshTrigger)

  const { totalSupply, userDeposits } = poolItem;

  const getUserInfo = async () => {
    const res = await convexVaultsIFOContract.methods.userInfo(item.id, currentAccount).call()
    return {
      shares: res.shares,
    }
  }

  useEffect(() => {
    props.triggerChange()
  }, [refreshTrigger])

  useEffect(async () => {
    if (checkChain == CHAINSTATUS['checkUser']) {
      const _useInfo = await getUserInfo(item)
      setUserInfo(_useInfo)
    }
  }, [getBlockNumber(), checkChain, refreshTrigger, item])

  const tvlCBN = cBN(totalShare).multipliedBy(lpTokenPrice)
  let tvl = formatBalance(tvlCBN, 18, 2)
  // console.log("lpTokenPrice--", item.id, lpTokenPrice.toString())
  // const earned = fb4((totalUnderlying / totalShare) * userInfo.shares)
  let earned = formatBalance(
    cBN(totalUnderlying)
      .div(cBN(totalShare))
      .multipliedBy(userInfo.shares)
      .multipliedBy(lpTokenPrice)
      .toString(),
    18,
    2,
  )
  const convexApy = getConvexInfo('CRV') ? getConvexInfo('CRV').apy.project : 0
  const convexInfo = getConvexInfo(item.name)
  const baseApy = convexInfo ? convexInfo.apy.current : 0



  const acrvApy = cBN(parseFloat(convexApy))
    .dividedBy(100)
    .dividedBy(52)
    .plus(1)
    .pow(52)
    .minus(1)
    .shiftedBy(2)

  let compoundApy = cBN(0)
  // console.log(item.name, baseApy, parseInt(baseApy), convexApy, acrvApy.toFixed(2), compoundApy.toFixed(2))
  let apy = compoundApy.plus(cBN(parseFloat(baseApy)))



  const toggleActive = () => setActive(prev => !prev)

  const handleDeposit = () => {
    const flag = checkWalletConnect(currentAccount, connectWallet, currentChainId)
    flag && setDepositVisible(true)
  }

  const handleWithdraw = () => {
    const flag = checkWalletConnect(currentAccount, connectWallet, currentChainId)
    flag && setWithdrawVisible(true)
  }

  const displayPool = item.isExpired && cBN(earned || 0).isZero()
  return (
    <div className={styles.poolItemNew} style={{ display: displayPool ? 'none' : 'block' }}>
      <div className={cn(styles.briefLine, active && styles.active)} onClick={() => toggleActive()}>
        <div className={styles.poolName}>
          <img src={item.logo} alt={item.name} className={styles.icon} />
          <div>{item.name}</div>
        </div>
        <div>{apy.toFixed(2)}%</div>
        <div>{!cBN(tvl).isZero() ? `$${tvl}` : '-'}</div>
        {/* <div>{!cBN(userInfo.pendingReward).isZero() ? formatBalance(userInfo.pendingReward, 18, 4) : '-'}</div> */}
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
            Deposit liquidity into{' '}
            <a target="_blank" href={convexInfo?.depositInfo.url} className="font-medium underline">
              {item.nameShow}
            </a>{' '}
            (without staking in the Curve gague), then stake{' '}
            <span className="font-medium text-white">{item.stakeTokenSymbol}</span> here. During the IFO,vaults rewards $aCRV
            will replaced by $CTR wiht 1;1
          </div>

          <div className={styles.aprSection}>
            <span className={styles.aprTag}>APY:</span>
            <span className={styles.aprValue}>{apy.toFixed(2)}%</span>
          </div>

          <div className={styles.actions}>
            <Button theme="lightBlue" disabled={poolItem.closeDeposit} onClick={handleDeposit}>
              Deposit
            </Button>
            <Button theme="deepBlue" onClick={handleWithdraw}>
              Withdraw
            </Button>
          </div>
        </div>
      )}
      {depositVisible && (
        <DepositModal info={poolItem} setRefreshTrigger={setRefreshTrigger} onCancel={() => setDepositVisible(false)} />
      )}
      {withdrawVisible && (
        <WithdrawModal
          info={poolItem}
          harvestList={harvestList}
          userShares={userInfo.shares}
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
          userShares={userInfo.shares}
          setRefreshTrigger={setRefreshTrigger}
          onCancel={() => setLiquidityWithdrawVisible(false)}
        />
      )}
    </div>
  )
}
