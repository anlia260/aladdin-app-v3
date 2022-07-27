import React, { useState, useContext, useEffect, useCallback } from 'react'
import Modal from 'components/Modal'
import Input, { Info } from 'components/Input'
// import { Web3Context } from 'context/Web3Context'
// import config from 'config'
// import abi from 'config/abi'
// import { useContract } from 'hooks/useContracts'
import Button from 'components/Button'
import Tip from 'components/Tip'
import { cBN, formatBalance } from 'utils'
import NoPayableAction, { noPayableErrorAction } from 'utils/noPayableAction'
import styles from './styles.module.scss'
import useWeb3 from 'hooks/useWeb3'
import cryptoIcons from 'assets/crypto-icons-stack.svg'
import VAULTNEW from 'config/contract/VAULTNEW'
import useActionBoard from 'pages/vault/controllers/useActionBoard'
const crvLogo = `${cryptoIcons}#crv`

export default function WithdrawModal(props) {
  const vaultIFOContract = VAULTNEW()
  const { getBlockNumber, currentAccount, checkChain, CHAINSTATUS, currentBlock } = useWeb3()
  const { onCancel, info, setRefreshTrigger: setPropsRefreshTrigger, harvestList } = props
  const [withdrawAmount, setWithdrawAmount] = useState()
  const [withdrawing, setWithdrawing] = useState(false)
  const [harvesting, setHarvesting] = useState(false)

  const [userInfo, setUserInfo] = useState({
    shares: 0,
  })
  const [rewarcAcrv, setRewarcAcrv] = useState(0)
  const { totalUnderlying, totalShare } = info
  const [refreshTrigger, setRefreshTrigger] = useState(1)
  const { acrvInfo } = useActionBoard({ refreshTrigger })
  const earned = cBN(totalUnderlying)
    .div(totalShare)
    .multipliedBy(userInfo.shares)
    .toNumber()

  const getPidInfo = useCallback(async () => {
    const { rewardPerSharePaid, rewards, shares } = await vaultIFOContract.methods.userInfo(info.id, currentAccount).call()
    setUserInfo({
      rewardPerSharePaid,
      rewards,
      shares,
    })
    try {
      const harvestData = await vaultIFOContract.methods.harvest(info.id, currentAccount, 0).call()
      // const acrvInfo = await fetchCotractInfo();
      const { totalUnderlying: acrvTotalUnderlying, totalSupply: acrvTotalSupply } = acrvInfo
      const _fee = cBN(1)
        .minus(0.005)
        .minus(0.005)
      const rewarCvxCrv = harvestData
        ? cBN(shares)
          .div(totalShare)
          .multipliedBy(harvestData)
          .multipliedBy(_fee)
        : 0
      const rate = acrvTotalSupply * 1 ? cBN(acrvTotalUnderlying).div(acrvTotalSupply) : 1
      // console.log('index---',rate.toString(10))
      const rewarcAcrv = rewarCvxCrv ? rewarCvxCrv.div(rate) : 0
      setRewarcAcrv(rewarcAcrv)
    } catch (e) {
      // console.log('e---', e)
      setRewarcAcrv(0)
    }
  }, [info.id])

  useEffect(async () => {
    if (checkChain !== CHAINSTATUS['checkUser']) return
    if (vaultIFOContract && info && info.name) {
      await getPidInfo()
    }
  }, [getBlockNumber(), checkChain])

  const handleHarvest = async () => {
    setHarvesting(true)
    const reward = await vaultIFOContract.methods.harvest(info.id, currentAccount, 0).call({ from: currentAccount, gas: 5000000 })
    if (reward * 1) {
      const _reward = cBN(reward)
        .multipliedBy(9)
        .div(10)
        .toFixed(0)
      const apiCall = await vaultIFOContract.methods.harvest(info.id, currentAccount, _reward)
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 'harvestVault',
        action: 'harvest',
      })
      setPropsRefreshTrigger(prev => prev + 1)
    }

    setHarvesting(false)
    await getPidInfo()
  }

  const handleWithdraw = async () => {
    if (checkChain !== CHAINSTATUS['checkUser']) return
    setWithdrawing(true)
    const sharesInWei = withdrawAmount.toNumber()
      ? cBN(withdrawAmount)
        .multipliedBy(totalShare)
        .div(totalUnderlying)
        .toFixed(0, 1)
      : '0'

    try {
      let apiCall
      if (cBN(userInfo.shares).isLessThanOrEqualTo(sharesInWei)) {
        apiCall = vaultIFOContract.methods.withdrawAllAndClaim(info.id, 0, 0)
      } else {
        apiCall = vaultIFOContract.methods.withdrawAndClaim(info.id, sharesInWei.toString(), 0, 0)
      }
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 'earn',
        action: 'Withdraw',
      })
      onCancel()
      setWithdrawing(false)
      setPropsRefreshTrigger(prev => prev + 1)
    } catch (error) {
      // console.log(error)
      setWithdrawing(false)
      noPayableErrorAction(`error_earn_deposit`, error)
    }
  }

  const handleInputChange = val => setWithdrawAmount(val)
  const canSubmit = cBN(withdrawAmount).isGreaterThan(0) && cBN(withdrawAmount).isLessThanOrEqualTo(earned)

  return (
    <Modal onCancel={onCancel}>
      <div className={styles.info}>
        <div className="color-white">Withdraw</div>
        <div className={`color-light-blue ${styles.itemWrap}`}>
          <div className="relative">
            <img src={Array.isArray(info.logo) ? info.logo[0] : info.logo} alt={info.name} className="w-8 mr-2" />
            <img src={crvLogo} alt={info.name} className="absolute w-4 h-4 right-1/3 bottom-0" />
          </div>
          {info.stakeTokenSymbol}
        </div>
      </div>
      <Input
        onChange={handleInputChange}
        available={earned}
        token={info.stakeTokenSymbol}
        vaultWithdrawFee={`${info.withdrawFeePercentage ? formatBalance(info.withdrawFeePercentage, 7) : '-'}%`}
      />
      <div className='-mt-2'>
        Fee may be lower after IFO. See <a href="https://docs.aladdin.club/concentrator/ifo-vaults" target="_blank" className='color-white underline'>gitbook</a> for details.
      </div>
      <div className="mt-20 flex items-center gap-1">
        <span className={styles.harvestHint}>Harvest</span>
        <Tip
          placement="top"
          color="#5ad0ff"
          title="Harvesting happens periodically without user intervention so normally manual harvest is not necessary.  Triggering a harvest before withdrawal ensures you get the maximum amount, but costs gas and may not be worth it."
        />
        <Info name="before withdraw will get" value={`${formatBalance(rewarcAcrv, 18, 6)} CTR`} />
      </div>
      <div className={styles.actions}>
        <Button theme="lightBlue" loading={harvesting} onClick={handleHarvest} disabled={!rewarcAcrv * 1}>
          Harvest
        </Button>
        <Button theme="lightBlue" onClick={handleWithdraw} disabled={!canSubmit} loading={withdrawing}>
          Withdraw
        </Button>
      </div>
    </Modal>
  )
}
