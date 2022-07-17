import React, { useState, useContext, useEffect, useCallback } from 'react'
import Modal from 'components/Modal'
import Input, { Info } from 'components/Input'
import { Web3Context } from 'context/Web3Context'
import config from 'config'
import abi from 'config/abi'
import { useContract } from 'hooks/useContracts'
import Button from 'components/Button'
import Tip from 'components/Tip'
import { cBN, basicCheck, formatBalance, numberToString } from 'utils'
import NoPayableAction, { noPayableErrorAction } from 'utils/noPayableAction'
import styles from './styles.module.scss'
import useWeb3 from 'hooks/useWeb3'
import cryptoIcons from 'assets/crypto-icons-stack.svg'
import useLiquidityMining from 'pages/vault/controllers/useLiquidityMining'
import BALANCERLPGAUGE, { getBALANCERLPGAUGEAddress } from 'config/contract/BALANCERLPGAUGE'
const crvLogo = `${cryptoIcons}#crv`

export default function LiquidityWithdrawModal(props) {
  const { liquidityData } = useLiquidityMining();
  const BALANCERLPGAUGEContract = BALANCERLPGAUGE();
  const { getBlockNumber, currentAccount, checkChain, CHAINSTATUS, currentBlock } = useWeb3()
  const { onCancel, info, setRefreshTrigger, withdrawClaim } = props
  const [withdrawAmount, setWithdrawAmount] = useState()
  const [withdrawing, setWithdrawing] = useState(false)
  const { totalShare, totalSupply, userDeposits } = liquidityData

  const handleWithdraw = async (isClaim) => {
    if (checkChain !== CHAINSTATUS["checkUser"]) return;
    setWithdrawing(true)
    const sharesInWei = withdrawAmount.toNumber()
      ? cBN(withdrawAmount)
        .multipliedBy(totalSupply)
        .div(totalSupply)
        .toFixed(0, 1)
      : '0'

    try {
      let apiCall
      if (isClaim) {
        apiCall = BALANCERLPGAUGEContract.methods.withdraw(sharesInWei, true)
      } else {
        apiCall = BALANCERLPGAUGEContract.methods.withdraw(sharesInWei)
      }
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 'earn',
        action: 'Withdraw',
      })
      onCancel()
      setWithdrawing(false)
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      setWithdrawing(false)
      noPayableErrorAction(`error_earn_Withdraw`, error)
    }
  }

  const handleInputChange = val => setWithdrawAmount(val)
  const canSubmit = cBN(withdrawAmount).isGreaterThan(0) && cBN(withdrawAmount).isLessThanOrEqualTo(userDeposits)

  return (
    <Modal onCancel={onCancel}>
      <div className={styles.info}>
        <div className="color-white">Withdraw</div>
        <div className={`color-light-blue ${styles.itemWrap}`}>
          <div className="relative">
            <img src={info.logo} alt={info.name} className="w-8 mr-2" />
            <img src={crvLogo} alt={info.name} className="absolute w-4 h-4 right-1/3 bottom-0" />
          </div>
          {info.stakeTokenSymbol}
        </div>
      </div>
      <Input
        onChange={handleInputChange}
        available={userDeposits}
        token={info.stakeTokenSymbol}
      // vaultWithdrawFee={`${info.withdrawFeePercentage ? formatBalance(info.withdrawFeePercentage, 7) : '-'}%`}
      />
      <div className={styles.actions}>
        {!withdrawClaim ? <Button theme="lightBlue" onClick={handleWithdraw} disabled={!canSubmit} loading={withdrawing}>
          Withdraw
        </Button> :
          <Button theme="lightBlue" onClick={() => handleWithdraw(true)} disabled={!canSubmit} loading={withdrawing}>
            Withdraw & Claim
          </Button>
        }
      </div>
    </Modal>
  )
}
