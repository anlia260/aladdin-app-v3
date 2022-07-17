import React, { useEffect, useState } from 'react'
// import { Web3Context } from 'context/Web3Context'
import cn from 'classnames'
// import config from 'config'
import NoPayableAction, { noPayableErrorAction } from 'utils/noPayableAction'
import ArrowDown from 'assets/arrow-down.svg'
import ACRVIcon from 'assets/pools/acrv.svg'
import useWeb3 from 'hooks/useWeb3'
import { cBN, checkWalletConnect, formatBalance } from 'utils'
import styles from './styles.module.scss'
import Button from 'components/Button'
import Tip from 'components/Tip'
import LiquidityDepositModal from './components/LiquidityDepositModal'
import LiquidityWithdrawModal from './components/LiquidityWithdrawModal'
import useLiquidityMining from 'pages/vault/controllers/useLiquidityMining'
// import cryptoIcons from 'assets/crypto-icons-stack.svg'
import BALANCERLPGAUGE from 'config/contract/BALANCERLPGAUGE'
import GAUGEREWARDDISTRIBUTOR from 'config/contract/GAUGEREWARDDISTRIBUTOR'
// const crvLogo = `${cryptoIcons}#crv`

export default function LiquidityItem(props) {
  const { currentAccount, connectWallet, checkChain, CHAINSTATUS, currentChainId, updateCtrBalance } = useWeb3()
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const { apy, liquidityData, priceObj = {}, currentApy, totalLock } = useLiquidityMining(refreshTrigger);
  const BALANCERLPGAUGEContract = BALANCERLPGAUGE()
  const GAUGEREWARDDISTRIBUTORContract = GAUGEREWARDDISTRIBUTOR();
  const { item, harvestList } = props
  const [active, setActive] = useState(false)
  const [withdrawClaim, setWithdrawClaim] = useState(false)
  const [claiming, setClaiming] = useState(false)

  const [liquidityDepositVisible, setLiquidityDepositVisible] = useState(false)
  const [liquidityWithdrawVisible, setLiquidityWithdrawVisible] = useState(false)

  const { totalSupply, userDeposits, claimable } = liquidityData;
  const { lpPrice = 1, ctr: ctrPirce } = priceObj;
  // console.log('totalLock----11',totalLock.lptotalLock.toString(10))

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
      // await saveClaimable({
      //   lpCA: 0,
      //   addr: currentAccount,
      // })
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
    <div className={cn(styles.poolItemNew, styles.liquidityItem)} style={{ display: displayPool ? 'none' : 'block' }}>
      <div className={cn(styles.briefLine, active && styles.active)} onClick={() => toggleActive()}>
        <div className={styles.poolName}>
          <img src={item.logo} alt={item.name} className={styles.icon} />
          <div>{item.name} {item.tip && <Tip title={item.tip} style={{ top: '-3px', left: '2px' }} />}</div>
        </div>
        <div>{isNaN(apy) ? '-' : apy}%</div>
        <div>{!cBN(tvl).isZero() ? `$${tvl}` : '-'}</div>
        {/* <div>{!cBN(userInfo.pendingReward).isZero() ? formatBalance(userInfo.pendingReward, 18, 4) : '-'}</div> */}
        <div>{!cBN(userDeposit || 0).isZero() && userDeposit != '-' ? `$ ${userDeposit}` : '-'}</div>
        <div>{!cBN(earned || 0).isZero() && earned != '-' ? `${earned}` : '-'}</div>
        <div className="flex items-center gap-4">
          <span className="hidden 2xl:block color-blue">More</span>
          <img src={ArrowDown} alt="arrow-down" className={cn('w-8 h-8', active && 'transform rotate-180')} />
        </div>
      </div>
      {active && (
        <div className={styles.detail}>
          <div className="flex items-start flex-col gap-4 md:flex-row md:items-center md:gap-0">
            <span className={styles.actionTag}>DEPOSIT</span>
            <span className={styles.actionToken}>
              <div className="relative">
                <img src={item.logo} alt={item.name} className="w-8 mr-2" />
                {/* <img src={crvLogo} alt={item.name} className="absolute w-4 h-4 right-1/3 bottom-0" /> */}
              </div>
              {item.name}
            </span>
            <span className={styles.actionTag}>EARN</span>
            <span className={styles.actionToken}>
              <img src={ACRVIcon} alt="acrv-icon" className="w-8 mr-2" />
              CTR
              <div className={styles.ifoTag}>IFO</div>
            </span >
          </div >

          <div className='flex items-start flex-col md:flex-row md:items-center gap-4 mt-8 mb-6 md:8'>
            <div className={styles.actionHint}>
              Deposit Balancer <a href="https://app.balancer.fi/#/pool/0x80a8ea2f9ebfc2db9a093bd46e01471267914e490002000000000000000002a2" target="_blank" className="text-white font-medium underline">CTR/aCRV LP 2/98 LP</a><br />
            </div>
            <div>CTR Price: <span className="text-white"> ${ctrPirce.toFixed(2)}</span></div>
          </div>

          <div className={styles.aprSection}>
            <span className={styles.aprTag}>APY:</span>
            <span className={styles.aprValue}>
              {isNaN(apy) ? '-' : apy}%&nbsp;
              <Tip style={{ position: 'relative', top: -4 }} title={`Current APY : ${currentApy}`} />
            </span>

          </div>

          {/*<div className={styles.moreInfo}>
            <div>
              Claimable: <span>{!cBN(earned || 0).isZero() && earned != '-' ? `${earned}` : '-'}</span>
            </div>
             <div>
              Locked: <span>{fb4(totalLock.lptotalLock.toString(10) ?? 0)}</span> <Tip title="50% of the rewards will be unlocked linearly within 1 year." />
            </div>
          </div>*/}

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
            {/* <Button theme="deepBlue" onClick={() => handleWithdraw(true)}>
              Withdraw & Claim
            </Button>
            <Button theme="deepBlue" loading={claiming} onClick={handleClaim}>
              Claim
            </Button>
            {/* <Button theme="deepBlue" onClick={handleDonateReward}>
              TestDonateReward
            </Button> */}
          </div>
        </div>
      )
      }
      {
        liquidityDepositVisible && (
          <LiquidityDepositModal
            info={item}
            setRefreshTrigger={setRefreshTrigger}
            onCancel={() => setLiquidityDepositVisible(false)}
          />
        )
      }
      {
        liquidityWithdrawVisible && (
          <LiquidityWithdrawModal
            info={item}
            withdrawClaim={withdrawClaim}
            setRefreshTrigger={setRefreshTrigger}
            onCancel={() => setLiquidityWithdrawVisible(false)}
          />
        )
      }
    </div >
  )
}
