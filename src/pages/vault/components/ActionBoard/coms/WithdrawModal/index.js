import React, { useState, useContext, useEffect } from 'react'
import Modal from 'components/Modal'
import Input, { Info } from 'components/Input'
import Select from 'components/Select'
import Tip from 'components/Tip'
import { Web3Context } from 'context/Web3Context'
import useACrv from 'pages/vault/hook/useACrv'
import { cBN, basicCheck, formatBalance, numberToString } from 'utils'
import NoPayableAction, { noPayableErrorAction } from 'utils/noPayableAction'
import Button from 'components/Button'
import styles from './styles.module.scss'
import ZapInfo from 'components/ZapInfo'

const _initData = {
  availableHint: 'aCRV Wallet Balance + aCRV Claimable',
}

export default function WithdrawModal(props) {
  const { onCancel, setRefreshTrigger: setRefreshTrigger0 } = props
  const { currentAccount, web3 } = useContext(Web3Context)
  const [slippage, setSlippage] = useState('0.3')
  const [refreshTrigger, setRefreshTrigger] = useState(1)
  const { userInfo, acrvInfo, aCrvContract, convexVaultContract, harvestEarn, harvestAcrv } = useACrv(refreshTrigger)
  const [withdrawAmount, setWithdrawAmount] = useState()
  const [percent, setPercent] = useState(0)
  const { userAcrvWalletBalance, allPoolRewardaCrv } = userInfo
  const [withdrawing, setWithdrawing] = useState(false)
  const [harvesting, setHarvesting] = useState(false)
  const [selectValue, setSelectValue] = useState(0)
  const [selectToken, setSelectToken] = useState('cvxCRV')
  const [selectClaimValue, setSelectClaimValue] = useState(1)
  const [isClaim, setIsClaim] = useState(false)
  const selectOption = ['cvxCRV', 'aCRV', 'CRV', 'CVX', 'ETH']
  const [withdrawBtnType, setWithdrawBtnType] = useState(1)
  const [checkoutAssets, setCheckoutAssets] = useState(0)
  const [availableHint, setAvailableHint] = useState(_initData.availableHint)
  const [withdrawBalance, setWithdrawBalance] = useState(0)
  const handleHarvest = async () => {
    setHarvesting(true)
    await harvestAcrv()
    setHarvesting(false)
  }

  const handleWithdraw = async () => {
    if (!basicCheck(web3, currentAccount)) return
    setWithdrawing(true)
    if (!withdrawAmount) {
      return
    }
    const sharesInWei = cBN(withdrawAmount ?? 0).toFixed(0, 1)
    const userAcrvWalletBalanceInWei = cBN(userAcrvWalletBalance ?? 0).toFixed(0, 1)
    // console.log("_________0", [userAcrvWalletBalanceInWei]);
    try {
      const _option = selectValue
      const [_vaultMinout, _claimMinout] = await handleCheckOutAssets()
      if (isClaim) {
        const vaultClaimall = convexVaultContract.methods.claimAll(_claimMinout, 1)
        const estimatedGas = await vaultClaimall.estimateGas({ from: currentAccount })
        const gas = parseInt(estimatedGas * 1.2, 10) || 0
        await NoPayableAction(() => vaultClaimall.send({ from: currentAccount, gas }), {
          key: 'earn',
          action: 'Claim',
        })
        setWithdrawing(false)
        setRefreshTrigger(prev => prev + 1)
        setRefreshTrigger0(prev => prev + 1)
        onCancel && onCancel()
      } else if (withdrawBtnType == 1) {
        let apiCall
        if (percent && percent == 100) {
          apiCall = aCrvContract.methods.withdrawAll(currentAccount, _vaultMinout.toString(10), _option)
        } else {
          apiCall = aCrvContract.methods.withdraw(currentAccount, sharesInWei.toString(), _vaultMinout.toString(10), _option)
        }
        const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
        const gas = parseInt(estimatedGas * 1.2, 10) || 0
        await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
          key: 'earn',
          action: 'Withdraw',
        })
        setWithdrawing(false)
        setRefreshTrigger(prev => prev + 1)
        setRefreshTrigger0(prev => prev + 1)
        onCancel && onCancel()
      } else {
        const vaultClaimall = convexVaultContract.methods.claimAll(0, 1)
        const estimatedGas = await vaultClaimall.estimateGas({ from: currentAccount })
        const gas = parseInt(estimatedGas * 1.2, 10) || 0
        await NoPayableAction(
          () => vaultClaimall.send({ from: currentAccount, gas }),
          {
            key: 'earn',
            action: 'Withdraw',
          },
          async result => {
            let _newWalletBalance = userAcrvWalletBalanceInWei
            // console.log("_________1", [_newWalletBalance, userAcrvWalletBalanceInWei]);
            async function checkNum(resolve, reject) {
              window.confirmClaimSt = setInterval(async () => {
                _newWalletBalance = await aCrvContract.methods.balanceOf(currentAccount).call({ from: currentAccount })
                // console.log("_________2", [_newWalletBalance, userAcrvWalletBalanceInWei])
                if (_newWalletBalance * 1 > userAcrvWalletBalanceInWei * 1) {
                  clearInterval(window.confirmClaimSt)
                  resolve()
                }
              }, 1000)
            }
            await new Promise((r, j) => {
              return checkNum(r, j)
            })
            let apiCall
            if (percent && percent == 100) {
              apiCall = aCrvContract.methods.withdrawAll(currentAccount, _vaultMinout.toString(10), _option)
            } else {
              apiCall = aCrvContract.methods.withdraw(currentAccount, sharesInWei.toString(), _vaultMinout.toString(10), _option)
            }
            await NoPayableAction(() => apiCall.send({ from: currentAccount }), {
              key: 'earn',
              action: 'withdrawAll',
            })
            setWithdrawing(false)
            setRefreshTrigger(prev => prev + 1)
            setRefreshTrigger0(prev => prev + 1)
            onCancel && onCancel()
          },
        )
      }
    } catch (error) {
      setWithdrawing(false)
      noPayableErrorAction(`error_earn_deposit`, error)
    }
  }

  const handleCheckOutAssets = async () => {
    if (!withdrawAmount) {
      return
    }
    let _num = 0
    let _numWei = 0
    let _claimMinNumWei = 0
    const sharesInWei = cBN(withdrawAmount ?? 0).toFixed(0, 1)
    const userAcrvWalletBalanceInWei = cBN(userAcrvWalletBalance ?? 0).toFixed(0, 1)
    const _option = selectValue
    if (isClaim) {
      const vaultMinout1 = await convexVaultContract.methods.claimAll(0, 1).call({
        from: currentAccount,
      })
      const _vaultMinout1 = cBN(vaultMinout1)
        .multipliedBy(cBN(1).minus(cBN(slippage).dividedBy(100)))
        .toFixed(0)
      _num = formatBalance(_vaultMinout1, 18, 4)
      _claimMinNumWei = _vaultMinout1
    } else if (withdrawBtnType == 1) {
      const vaultMinout0 = cBN(userAcrvWalletBalanceInWei).isGreaterThan(0) ? await aCrvContract.methods.withdraw(currentAccount, sharesInWei, 0, _option).call({
        from: currentAccount,
      }) : 0
      const _vaultMinout0 = cBN(vaultMinout0)
        .multipliedBy(cBN(1).minus(cBN(slippage).dividedBy(100)))
        .toFixed(0)
      _numWei = _vaultMinout0
      _num = formatBalance(_vaultMinout0, 18, 4)
    } else {
      let rate = 1;
      if (cBN(withdrawAmount).isGreaterThan(cBN(userAcrvWalletBalance))) {
        rate = cBN(withdrawAmount).div(withdrawBalance).toFixed(2)
      }
      const vaultMinout1 = await convexVaultContract.methods.claimAll(0, selectClaimValue).call({
        from: currentAccount,
      })
      const _vaultMinout1 = cBN(vaultMinout1).multipliedBy(rate)
        .multipliedBy(cBN(1).minus(cBN(slippage).dividedBy(100)))
        .toFixed(0)
      _claimMinNumWei = _vaultMinout1
      const _userAcrvWalletBalanceInWeiRate = cBN(userAcrvWalletBalanceInWei).multipliedBy(rate).toFixed(0)
      const vaultMinout2 = cBN(userAcrvWalletBalanceInWei).isGreaterThan(0) ? await aCrvContract.methods.withdraw(currentAccount, _userAcrvWalletBalanceInWeiRate, 0, _option).call({
        from: currentAccount,
      }) : 0
      const _vaultMinout2 = cBN(vaultMinout2)
        .multipliedBy(cBN(1).minus(cBN(slippage).dividedBy(100)))
        .toFixed(0)
      _numWei = cBN(_vaultMinout1).plus(_vaultMinout2)
      _num = formatBalance(_numWei, 18, 4)
    }
    setCheckoutAssets(_num)
    return [_numWei, _claimMinNumWei]
  }

  useEffect(() => {
    handleCheckOutAssets()
  }, [withdrawAmount, slippage])

  useEffect(() => {
    if (isClaim) {
      setAvailableHint('aCRV Claimable')
      setWithdrawBalance(allPoolRewardaCrv)
    } else {
      const _withdrawBalance = cBN(allPoolRewardaCrv).plus(userAcrvWalletBalance)
      setWithdrawBalance(_withdrawBalance)
      setAvailableHint(_initData.availableHint)
    }
  }, [isClaim, allPoolRewardaCrv, userAcrvWalletBalance])

  const handleInputChange = (val, percent) => {
    setWithdrawBtnType(cBN(val).isGreaterThan(userAcrvWalletBalance) ? 2 : 1)
    setWithdrawAmount(val)
    setPercent(percent)
  }
  const [inputReseter, setInputReseter] = useState(0)

  const initData = () => {
    setWithdrawAmount(0)
    setCheckoutAssets(0)
    setSelectValue(0)
  }
  const handleChangeSelect = val => {
    initData()
    setInputReseter(prev => prev + 1)
    let _index = 0
    let _claimIndex = 1
    let _isClaim = false
    if (val == 'aCRV') {
      _index = -1
      _claimIndex = 1
      _isClaim = true
    }
    if (val == 'cvxCRV') {
      _index = 0
      _claimIndex = 2
    }
    if (val == 'CRV') {
      _index = 2
      _claimIndex = 3
    }
    if (val == 'CVX') {
      _index = 3
      _claimIndex = 4
    }
    if (val == 'ETH') {
      _index = 4
      _claimIndex = 5
    }
    setIsClaim(_isClaim)
    setRefreshTrigger(prev => prev + 1)
    setSelectToken(val)
    setSelectValue(_index)
    setSelectClaimValue(_claimIndex)
  }

  const canSubmit = cBN(withdrawAmount).isGreaterThan(0) && cBN(withdrawAmount).isLessThanOrEqualTo(withdrawBalance)
  const _harvestEarn = harvestEarn * 1 ? harvestEarn : 0
  // console.log('_harvestEarn---11', _harvestEarn);
  return (
    <Modal onCancel={onCancel} overflowVisible={true}>
      <div className={styles.info}>
        <div className="color-white">Withdraw</div>
        <div className="color-light-blue">aCRV</div>
      </div>

      <Input
        reset={inputReseter}
        onChange={handleInputChange}
        available={withdrawBalance}
        availableHint={availableHint}
        token="aCRV"
        fixPercent={isClaim ? 100 : false}
      />

      <div className="mt-6" />

      <Select
        onChange={handleChangeSelect}
        title="Withdraw acrv as"
        value={selectToken}
        options={selectOption}
        hint={
          <span>
            When you change the ‘Withdraw acrv as’ asset,we will redeem your aCRV for the chosen asset{' '}
            <span className="underline font-bold text-purple-200">{checkoutAssets ?? '-'}</span>
          </span>
        }
      />

      {!isClaim && (
        <ZapInfo
          slippage={slippage}
          slippageChange={val => setSlippage(val)}
          minAmount="0"
          isShowMinAmount={false}
          zapType="Withdraw"
        />
      )}

      <Info name="Withdraw Fee" value={`${acrvInfo.withdrawFee ? formatBalance(acrvInfo.withdrawFee, 7) : '-'}%`} />

      <div className="mt-8 flex items-center gap-1">
        <span className={styles.harvestHint}>Harvest</span>
        <Tip
          placement="top"
          color="#5ad0ff"
          title="Harvesting happens periodically without user intervention so normally manual harvest is not necessary.  Triggering a harvest before withdrawal ensures you get the maximum amount, including whatever harvest bounty has accrued, but costs gas and may not be worth it."
        />
        <Info name="before withdraw will get" value={`${numberToString(_harvestEarn, 6)} cvxCRV`} />
      </div>

      <div className={styles.actions}>
        <Button theme="lightBlue" loading={harvesting} disabled={!(_harvestEarn * 1)} onClick={handleHarvest}>
          Harvest
        </Button>
        <Button theme="lightBlue" onClick={handleWithdraw} loading={withdrawing} disabled={!canSubmit}>
          {withdrawBtnType == 2 ? 'Claim and Withdraw' : 'Withdraw'}
        </Button>
      </div>
    </Modal>
  )
}
