import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Web3Context } from 'context/Web3Context'
import cn from 'classnames'
import config from 'config'
import NoPayableAction, { noPayableErrorAction } from 'utils/noPayableAction'
import ArrowDown from 'assets/arrow-down.svg'
import ACRVIcon from 'assets/pools/acrv.svg'
import useWeb3 from 'hooks/useWeb3'
import { cBN, checkWalletConnect, getTokenPrice, getConvexInfo, formatBalance, numberToString, fb4 } from 'utils'
import styles from './styles.module.scss'
import Button from 'components/Button'
import Tip from 'components/Tip'
import LiquidityDepositModal from './components/LiquidityDepositModal'
import LiquidityWithdrawModal from './components/LiquidityWithdrawModal'
import useLiquidityMining from 'pages/vault/controllers/useLiquidityMining'
import cryptoIcons from 'assets/crypto-icons-stack.svg'
import BALANCERLPGAUGE, { getBALANCERLPGAUGEAddress } from 'config/contract/BALANCERLPGAUGE'
import GAUGEREWARDDISTRIBUTOR, { getCONCENTRATORGAUGEAddress } from 'config/contract/GAUGEREWARDDISTRIBUTOR'
const crvLogo = `${cryptoIcons}#crv`

export default function LiquidityItem(props) {
  const { currentAccount, connectWallet, getBlockNumber, checkChain, CHAINSTATUS, currentChainId, updateCtrBalance } = useWeb3()
  const { apy, liquidityData, priceObj = {} } = useLiquidityMining();
  const BALANCERLPGAUGEContract = BALANCERLPGAUGE()
  const GAUGEREWARDDISTRIBUTORContract = GAUGEREWARDDISTRIBUTOR();
  const { item, harvestList } = props
  const [active, setActive] = useState(false)
  const [withdrawClaim, setWithdrawClaim] = useState(false)
  const [claiming, setClaiming] = useState(false)

  const [liquidityDepositVisible, setLiquidityDepositVisible] = useState(false)
  const [liquidityWithdrawVisible, setLiquidityWithdrawVisible] = useState(false)

  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const { totalSupply, userDeposits, claimable } = liquidityData;
  const { lpPrice = 1 } = priceObj;

  useEffect(() => {
    props.triggerChange()
  }, [refreshTrigger])


  const tvl = formatBalance(cBN(totalSupply).multipliedBy(lpPrice).toString(10), 18, 2)
  const userDeposit = formatBalance(cBN(userDeposits).multipliedBy(lpPrice).toString(10), 18, 2)
  const earned = formatBalance(claimable, 18, 4)

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

  const handleClaim = async () => {
    if (checkChain !== CHAINSTATUS["checkUser"]) return;
    setClaiming(true)
    try {
      const apiCall = BALANCERLPGAUGEContract.methods.claim_rewards()
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 'earn',
        action: 'Claim',
      })
      updateCtrBalance()
      setClaiming(false)
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      setClaiming(false)
      noPayableErrorAction(`error_claim`, error)
    }
  }

  const handleDonateReward = async () => {
    if (checkChain !== CHAINSTATUS["checkUser"]) return;
    try {
      const apiCall = GAUGEREWARDDISTRIBUTORContract.methods.donate([], [])
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 'donate',
        action: 'Donate',
      })
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      noPayableErrorAction(`error_claim`, error)
    }
  }

  const displayPool = item.isExpired && cBN(userDeposit || 0).isZero()
  return (
    <div className={styles.poolItem} style={{ display: displayPool ? 'none' : 'block' }}>
      <div className={cn(styles.briefLine, active && styles.active)} onClick={() => toggleActive()}>
        <div className={styles.poolName}>
          <img src={item.logo} alt={item.name} className={styles.icon} />
          <div>{item.name} {item.tip && <Tip title={item.tip} style={{ top: '-3px', left: '2px' }} />}</div>
        </div>
        <div>{apy}%</div>
        <div>{!cBN(tvl).isZero() ? `$${tvl}` : '-'}</div>
        {/* <div>{!cBN(userInfo.pendingReward).isZero() ? formatBalance(userInfo.pendingReward, 18, 4) : '-'}</div> */}
        <div>{!cBN(userDeposit || 0).isZero() && userDeposit != '-' ? `$ ${userDeposit}` : '-'}</div>
        <div>{!cBN(earned || 0).isZero() && earned != '-' ? `${earned}` : '-'}</div>
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
              aCRV
            </span>
            <div className={styles.ifoTag}>IFO</div>
          </div>

          <div className={styles.actionHint}>
            Deposit Balancer <span className="text-white font-medium">CTR/aCRV LP</span>
            <br /> During the IFO, the rewards is <span className="text-white font-medium">aCRV</span> (extra $CENT equivalent
            to 4% of vaults yield) After the IFP, the reward is a share of vault performance fee in $aCRV
          </div>
          <div className={styles.aprSection}>
            <span className={styles.aprTag}>APY:</span>
            <span className={styles.aprValue}>{apy}%</span>
          </div>

          {/* <div className={styles.moreInfo}>
            <div>
              Base Vault APR: <span className={styles.moreInfoValue}>{baseApy}</span>
            </div>
          </div> */}

          <div className={styles.actions}>
            <Button theme="lightBlue" disabled={item.closeDeposit} onClick={handleDeposit}>
              Deposit
            </Button>
            <Button theme="deepBlue" onClick={handleWithdraw}>
              Withdraw
            </Button>
            <Button theme="deepBlue" onClick={() => handleWithdraw(true)}>
              Withdraw & Claim
            </Button>
            <Button theme="deepBlue" loading={claiming} onClick={handleClaim}>
              Claim
            </Button>
            {/*
            <Button theme="deepBlue" onClick={handleDonateReward}>
              TestDonateReward
            </Button>
            */}
          </div>
        </div>
      )}
      {liquidityDepositVisible && (
        <LiquidityDepositModal
          info={item}
          setRefreshTrigger={setRefreshTrigger}
          onCancel={() => setLiquidityDepositVisible(false)}
        />
      )}
      {liquidityWithdrawVisible && (
        <LiquidityWithdrawModal
          info={item}
          withdrawClaim={withdrawClaim}
          setRefreshTrigger={setRefreshTrigger}
          onCancel={() => setLiquidityWithdrawVisible(false)}
        />
      )}
    </div>
  )
}
