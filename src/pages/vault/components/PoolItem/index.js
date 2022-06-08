import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import NoPayableAction, { noPayableErrorAction } from 'utils/noPayableAction'
import cn from 'classnames'
import ArrowDown from 'assets/arrow-down.svg'
import ACRVIcon from 'assets/pools/acrv.svg'
import { useUserPoolInfo } from 'pages/vault/hook/useConvexVault'
import useWeb3 from 'hooks/useWeb3'
import { cBN, basicCheck, checkWalletConnect, getTokenPrice, getConvexInfo, formatBalance, numberToString, fb4 } from 'utils'
import styles from './styles.module.scss'
import Button from 'components/Button'
import Tip from 'components/Tip'
import DepositModal from './components/DepositModal'
import WithdrawModal from './components/WithdrawModal'
import cryptoIcons from 'assets/crypto-icons-stack.svg'
const crvLogo = `${cryptoIcons}#crv`

export default function PoolItem(props) {
  const { currentAccount, connectWallet, getBlockNumber, checkChain, CHAINSTATUS, currentChainId, web3 } = useWeb3()
  const { item: oldItem, poolItem = {}, harvestList } = props
  const item = poolItem.id ? poolItem : oldItem
  const { totalShare = 0, totalUnderlying = 0, lpTokenPrice = 1 } = poolItem
  const [migrating, setMigrating] = useState(false)
  const [active, setActive] = useState(false)
  const [depositVisible, setDepositVisible] = useState(false)
  const [withdrawVisible, setWithdrawVisible] = useState(false)
  const [userInfo, setUserInfo] = useState({})

  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const { vaultContract, convexVaultsIFOContract } = useUserPoolInfo(item, refreshTrigger)
  const getUserInfo = async () => {
    const res = await vaultContract.methods.userInfo(item.id, currentAccount).call()
    return {
      shares: res.shares,
    }
  }

  useEffect(() => {
    props.triggerChange()
  }, [refreshTrigger])

  useEffect(async () => {
    if (checkChain == CHAINSTATUS["checkUser"]) {
      const _useInfo = await getUserInfo(item)
      setUserInfo(_useInfo)
    }
  }, [getBlockNumber(), checkChain, refreshTrigger, item])

  const tvlCBN = cBN(totalShare).multipliedBy(lpTokenPrice)
  const tvl = formatBalance(tvlCBN, 18, 2)
  // console.log("lpTokenPrice--", item.id, lpTokenPrice.toString())
  // const earned = fb4((totalUnderlying / totalShare) * userInfo.shares)
  const earned = formatBalance(
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
  const baseApy = convexInfo ? Math.max(parseFloat(convexInfo.apy.current || 0), parseFloat(convexInfo.apy.project || 0)) : 0

  const acrvApy = cBN(parseFloat(convexApy))
    .dividedBy(100)
    .dividedBy(52)
    .plus(1)
    .pow(52)
    .minus(1)
    .shiftedBy(2)

  let compoundApy = acrvApy.multipliedBy(parseFloat(baseApy) - (convexInfo?.curveApys?.baseApy ?? 0)).dividedBy(100)
  compoundApy = compoundApy > 0 ? compoundApy : cBN(0);
  // console.log(item.name, baseApy, parseInt(baseApy), convexApy, acrvApy.toFixed(2), compoundApy.toFixed(2))
  let apy = compoundApy.plus(cBN(parseFloat(baseApy)))

  let ethApy = cBN(1)
    .plus(cBN(parseFloat(baseApy)).div(100))
    .plus(cBN(compoundApy).div(100))
    .times(cBN(0.045 * 0.85))
    .times(100)
  if (item.isShowEthApy) {
    // console.log("ethApy---", compoundApy.toString(10), parseFloat(baseApy).toString(10), ethApy.toString(10))
    apy = apy.plus(cBN(ethApy))
  }

  const toggleActive = () => setActive(prev => !prev)

  const handleDeposit = () => {
    const flag = checkWalletConnect(currentAccount, connectWallet, currentChainId)
    flag && setDepositVisible(true)
  }

  const handleWithdraw = () => {
    const flag = checkWalletConnect(currentAccount, connectWallet, currentChainId)
    flag && setWithdrawVisible(true)
  }

  const handleMigrate = async (info) => {
    if (!basicCheck(web3, currentAccount)) return
    setMigrating(true)
    try {
      const apiCall = convexVaultsIFOContract.methods.migrate(
        info.id,
        currentAccount,
        info.id,
      )
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 'old_vault',
        action: 'migrat',
      })
      setMigrating(false)
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      setMigrating(false)
      noPayableErrorAction(`error_old_vault_migrate`, error)
    }

  }

  const displayPool = item.isExpired && cBN(earned || 0).isZero()
  return (
    <div className={styles.poolItem} style={{ display: displayPool ? 'none' : 'block' }} >
      <div className={cn(styles.briefLine, active && styles.active)} onClick={() => toggleActive()}>
        <div className={styles.poolName}>
          <img src={item.logo} alt={item.name} className={styles.icon} />
          <div>{item.name}</div>
        </div>
        <div>{apy.toFixed(2)}%</div>
        <div>{!cBN(tvl).isZero() ? `$${tvl}` : '-'}</div>
        {/* <div>{!cBN(userInfo.pendingReward).isZero() ? formatBalance(userInfo.pendingReward, 18, 4) : '-'}</div> */}
        <div>{!cBN(earned || 0).isZero() && earned != '-' ? `$ ${earned}` : '-'}</div>
        <div className='flex items-center gap-4'>
          <span className='hidden 2xl:block color-blue'>More</span>
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
              aCRV
            </span>
          </div>
          <div className={styles.actionHint}>
            Deposit liquidity into
            <a target="_blank" href={convexInfo?.depositInfo.url} className="font-bold mx-1 underline">
              {item.nameShow}
            </a>
            (without staking in the Curve gauge), then stake
            <span className="font-bold mx-1 text-white">{item.stakeTokenSymbol}</span> here. Rewards will be swapped to cvxCRV and
            deposited in the Concentrator auto-compounding pool. Your aCRV balance represents your share of that pool.
          </div>
          <div className={styles.aprSection}>
            <span className={styles.aprTag}>APY:</span>
            <span className={styles.aprValue}>{apy.toFixed(2)}%</span>
          </div>
          <div className={styles.moreInfo}>
            <div>
              Base Convex Vault APR: <span className={styles.moreInfoValue}>{baseApy}%</span>
            </div>
            <div className="flex items-center gap-2">
              <div>
                Boost from Concentrator vault: <span className={styles.moreInfoValue}>{compoundApy.toFixed(2)}%</span>
              </div>
              <Tip
                title={`Concentrator boost represents the projected earnings of your base rewards once they are deposited in the Concentrator vault <br/> Boost = (Base Vault yield -Base Curve vAPR)* Concentrator aCRV Yield`}
              />
            </div>
            {item.isShowEthApy && (
              <div>
                ETH2.0 APR: <span className={styles.moreInfoValue}>{ethApy.toFixed(2)}%</span>
              </div>
            )}
          </div>
          <div className={styles.actions}>
            <Button theme="lightBlue" disabled={true} onClick={handleDeposit}>
              Deposit
            </Button>
            <Button theme="deepBlue" onClick={handleWithdraw}>
              Withdraw
            </Button>
            <Button theme="plain" onClick={() => handleMigrate(item)} loading={migrating}>
              Migrate
            </Button>
            <div className={styles.hint}>
              0 Fees</div>

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
    </div>
  )
}
