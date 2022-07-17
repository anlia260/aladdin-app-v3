import React, { useState } from 'react'
import NoPayableAction, { noPayableErrorAction } from 'utils/noPayableAction'
import cn from 'classnames'
import ArrowDown from 'assets/arrow-down.svg'
import ACRVIcon from 'assets/pools/acrv.svg'
import useWeb3 from 'hooks/useWeb3'
import { cBN, basicCheck, checkWalletConnect } from 'utils'
import styles from './styles.module.scss'
import Button from 'components/Button'
import Tip from 'components/Tip'
import { useUpdateEffect } from 'ahooks'
import DepositModal from './components/DepositModal'
import WithdrawModal from './components/WithdrawModal'
import cryptoIcons from 'assets/crypto-icons-stack.svg'
import { AllVaults } from 'config/convexVault'
import VAULT from 'config/contract/VAULT'
const crvLogo = `${cryptoIcons}#crv`

export default function PoolItem(props) {
  const { currentAccount, connectWallet, currentChainId, web3 } = useWeb3()
  const { item, harvestList } = props
  const { earned, earnedNum, tvl, baseApy, baseCurrentApy, apy, currentApy, ethApy, ethCurrentApy, compoundApy, compoundCurrentApy, convexInfo, userInfo, isMigrate = true } = item
  console.log('convexInfo---', convexInfo);

  const [migrating, setMigrating] = useState(false)
  const [active, setActive] = useState(false)
  const [depositVisible, setDepositVisible] = useState(false)
  const [withdrawVisible, setWithdrawVisible] = useState(false)

  const [refreshTrigger, setRefreshTrigger] = useState(null)
  const vaultContract = VAULT()

  useUpdateEffect(() => {
    const refreshItmeIndex = AllVaults.findIndex(i => i.id === item.id)
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

  const handleMigrate = async info => {
    if (!basicCheck(web3, currentAccount)) return
    setMigrating(true)
    try {
      const apiCall = vaultContract.methods.migrate(info.id, currentAccount, info.id)
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.4, 10) || 0
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
  const canMigrate = cBN(earnedNum || 0).isGreaterThan(0)

  const showApyFn = (apy) => {
    if (apy) {
      return apy.toFixed(2)
    }
    return '-'
  }
  return (
    <div className={styles.poolItem} style={{ display: displayPool ? 'none' : 'block' }}>
      <div className={cn(styles.briefLine, active && styles.active)} onClick={() => toggleActive()}>
        <div className={styles.poolName}>
          <img src={item.logo} alt={item.name} className={styles.icon} />
          <div>{item.name}</div>
        </div>
        <div>{apy.toFixed(2)}%</div>
        <div>{(!cBN(tvl).isZero() && tvl != undefined) ? `${tvl}` : '-'}</div>
        <div>{!cBN(earned || 0).isZero() && earned != '-' ? `$ ${earned}` : '-'}</div>
        <div className="flex items-center gap-4">
          <span className="hidden 2xl:block color-blue">More</span>
          <img src={ArrowDown} alt="arrow-down" className={cn('w-8 h-8', active && 'transform rotate-180')} />
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
              <img src={ACRVIcon} alt="acrv-icon" className="w-8 mr-2" />
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
            <span className={styles.aprValue}>{showApyFn(apy)}%</span><Tip
              title={`Current Apy : ${showApyFn(currentApy)}% <br/> Base Convex Vault APR: ${baseCurrentApy}% <br/> Boost from Concentrator vault: ${showApyFn(compoundCurrentApy)}% <br/>${item.isShowEthApy ? `ETH2.0 APR:${showApyFn(ethCurrentApy)}%` : ''}`}
            />
          </div>
          <div className={styles.moreInfo}>
            <div>
              Base Convex Vault APR: <span className={styles.moreInfoValue}>{showApyFn(baseApy)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <div>
                Boost from Concentrator vault: <span className={styles.moreInfoValue}>{showApyFn(compoundApy)}%</span>
              </div>
              <Tip
                title={`Concentrator boost represents the projected earnings of your base rewards once they are deposited in the Concentrator vault <br/> Boost = (Base Vault yield -Base Curve vAPR)* Concentrator aCRV Yield`}
              />
            </div>
            {item.isShowEthApy && (
              <div>
                ETH2.0 APR: <span className={styles.moreInfoValue}>{showApyFn(ethApy)}%</span>
              </div>
            )}
          </div>
          <div className={styles.actions}>
            <Button theme="lightBlue" onClick={handleDeposit}>
              Deposit
            </Button>
            <Button theme="deepBlue" onClick={handleWithdraw}>
              Withdraw
            </Button>
            {
              !!isMigrate ? <Button theme="plain" disabled={!canMigrate} onClick={() => handleMigrate(item)} loading={migrating}>
                Migrate to IFO
              </Button> : ''
            }
            {
              !!isMigrate ?
                <div className={styles.hint}>0 Fees</div>
                : ''
            }
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
          userShares={userInfo.shares}
          setRefreshTrigger={setRefreshTrigger}
          onCancel={() => setWithdrawVisible(false)}
        />
      )}
    </div>
  )
}
