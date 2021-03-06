import React, { useState, useContext, useEffect } from 'react'
import { Web3Context } from 'context/Web3Context'
import Modal from 'components/Modal'
import Input from 'components/Input'
import Button from 'components/Button'
import TokenSelect from 'components/TokenSelect'
import config from 'config'
import { useUserPoolInfo } from 'pages/vault/hook/useConvexVault'
import { useDebounceEffect } from 'ahooks'
import NoPayableAction, { noPayableErrorAction } from 'utils/noPayableAction'
import { cBN, basicCheck, formatBalance } from 'utils'
import { useToken } from 'pages/vault/hook/useTokenInfo'
import styles from './styles.module.scss'
import cryptoIcons from 'assets/crypto-icons-stack.svg'
import ZapInfo from 'components/ZapInfo'
const crvLogo = `${cryptoIcons}#crv`

export default function DepositModal(props) {
  const { currentAccount, web3 } = useContext(Web3Context)
  const { onCancel, info } = props

  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const { vaultContract } = useUserPoolInfo(info, refreshTrigger)
  const [selectToken, setSelectToken] = useState(info.zapTokens[0])

  const [depositAmount, setDepositAmount] = useState()
  const [approving, setApproving] = useState(false)
  const [depositing, setDepositing] = useState(false)
  const [slippage, setSlippage] = useState('0.3')
  const [minAmount, setMinAmount] = useState(0)
  const [minAmountTvl, setMinAmountTvl] = useState(0)

  const selectTokenInfo = useToken(selectToken.address, refreshTrigger)
  const tokenContract = selectTokenInfo.contract
  const userTokenBalance = selectTokenInfo.balance
  const canDeposit = selectTokenInfo.allowance > 0

  const isSelfLp = info.stakeTokenContractAddress === selectToken.address
  const { totalUnderlying, totalShare, lpTokenPrice } = info;
  useDebounceEffect(
    async () => {
      let depositAmountInWei = cBN(depositAmount || 0).toFixed(0)
      if (canDeposit && !cBN(depositAmountInWei).isZero() && !isSelfLp) {
        // console.log('info.id,depositAmountInWei', info.id, selectToken.address, depositAmountInWei)
        const shares = await vaultContract.methods
          .zapAndDeposit(info.id, selectToken.address, depositAmountInWei, 0)
          .call({ from: currentAccount, value: config.zeroAddress == selectToken.address ? depositAmountInWei : 0 })

        let _shares = cBN(totalUnderlying).div(totalShare).times(shares)
        _shares = isNaN(_shares.toFixed(0)) ? cBN(0) : _shares
        let _sharesTvl = _shares.times(lpTokenPrice)
        _sharesTvl = isNaN(_sharesTvl.toFixed(0)) ? cBN(0) : _sharesTvl
        console.log(_sharesTvl.toFixed(0))
        setMinAmountTvl(_sharesTvl.toFixed(0))
        setMinAmount(_shares.toFixed(0))
        // console.log('share', formatBalance(shares, 18))
      } else {
        setMinAmount(0)
        setMinAmountTvl(0)
      }
    },
    [depositAmount, canDeposit, slippage],
    {
      wait: 1000,
    },
  )

  const handleApprove = async () => {
    if (!basicCheck(web3, currentAccount)) return
    setApproving(true)
    try {
      const apiCall = tokenContract.methods.approve(
        config.contracts.convexVault,
        web3.utils.toWei('1000000000000000000', 'ether'),
      )
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 'earn',
        action: 'approv',
      })
      setApproving(false)
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      setApproving(false)
      noPayableErrorAction(`error_earn_approve`, error)
    }
  }

  const handleZapDeposit = async () => {
    if (!basicCheck(web3, currentAccount)) return
    setDepositing(true)
    let depositAmountInWei = cBN(depositAmount || 0).toFixed(0)
    const minOut = (cBN(minAmount) || cBN(0)).multipliedBy(cBN(1).minus(cBN(slippage).dividedBy(100))).toFixed(0)

    try {
      const apiCall = vaultContract.methods.zapAndDeposit(info.id, selectToken.address, depositAmountInWei, minOut)
      const estimatedGas = await apiCall.estimateGas({
        from: currentAccount,
        value: config.zeroAddress == selectToken.address ? depositAmountInWei : 0,
      })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(
        () =>
          apiCall.send({ from: currentAccount, gas, value: config.zeroAddress == selectToken.address ? depositAmountInWei : 0 }),
        {
          key: 'acrv',
          action: 'zapAndDeposit',
        },
      )
      setDepositing(false)
      onCancel()
      setRefreshTrigger(prev => prev + 1)
      props.setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      console.log(error)
      setDepositing(false)
      noPayableErrorAction(`error_zapAndDeposit`, error)
    }
  }

  const handleDeposit = async () => {
    if (!isSelfLp) {
      // console.log('let us try to switch token')
      handleZapDeposit()
      return
    }
    if (!basicCheck(web3, currentAccount)) return
    setDepositing(true)
    const depositAmountInWei = cBN(depositAmount || 0).toFixed(0, 1)

    try {
      const apiCall = vaultContract.methods.deposit(info.id, depositAmountInWei.toString())
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 'acrv',
        action: 'deposit',
      })
      setDepositing(false)
      onCancel()
      setRefreshTrigger(prev => prev + 1)
      props.setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      // console.log(error)
      setDepositing(false)
      noPayableErrorAction(`error_acrv_deposit`, error)
    }
  }

  const handleInputChange = val => setDepositAmount(val)
  const canSubmit = cBN(depositAmount).isGreaterThan(0) && cBN(depositAmount).isLessThanOrEqualTo(userTokenBalance)
  const handleTokenSelect = token => {
    setMinAmount(0)
    setSelectToken(token)
  }
  return (
    <Modal onCancel={onCancel}>
      <div className={styles.info}>
        <div className="color-white">Deposit</div>
        <div className={`color-light-blue ${styles.itemWrap}`}>
          <div className="relative">
            <img src={info.logo} alt={info.name} className="w-8 mr-2" />
            <img src={crvLogo} alt={info.name} className="absolute w-4 h-4 right-1/3 bottom-0" />
          </div>
          {info.stakeTokenSymbol}
        </div>
      </div>

      <TokenSelect
        title="Deposit token"
        onChange={token => handleTokenSelect(token)}
        value={selectToken}
        options={info.zapTokens}
      />

      <Input
        onChange={handleInputChange}
        balance={userTokenBalance}
        decimals={selectToken.decimals}
        token={selectToken.symbol}
        vaultWithdrawFee={`${info.withdrawFeePercentage ? formatBalance(info.withdrawFeePercentage, 7) : '-'}%`}
      />

      {selectToken.needZap && (
        <ZapInfo
          zapTitle="Zap Transaction Info"
          slippage={slippage}
          slippageChange={val => setSlippage(val)}
          minAmount={formatBalance(minAmount, 18, 4)}
          minLpAmountTvl={formatBalance(minAmountTvl, 18, 4)}
          isLpMinAmount={true}
          tokenName={info.stakeTokenSymbol}
          zapType="Deposit"
        />
      )}

      <div className={styles.actions}>
        {canDeposit ? (
          <Button theme="lightBlue" onClick={handleDeposit} loading={depositing} disabled={!canSubmit}>
            Deposit
          </Button>
        ) : (
          <Button theme="lightBlue" onClick={handleApprove} loading={approving}>
            Approve
          </Button>
        )}
      </div>
    </Modal>
  )
}
