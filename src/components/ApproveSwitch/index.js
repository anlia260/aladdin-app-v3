import React, { useEffect, useState, useContext } from 'react'
import { Switch, message, Button } from 'antd'
import { FormattedMessage } from 'react-intl'
import notify from 'components/notify'
import { Web3Context } from 'context/Web3Context'
import abi from 'config/abi'

export default function ApproveSwitch(props) {
  // 需要传入{token地址}和{合约地址}
  const [tokenContract, setTokenContract] = useState({})
  const [allowanceTrigger, setAllowanceTrigger] = useState(1)
  const { tokenAddress, contractAddress, allowanceChange, isButton } = props
  const [allowance, setAllowance] = useState(0)
  const [approving, setApproving] = useState(false)
  const { currentAccount, web3 } = useContext(Web3Context)

  useEffect(() => {
    if (web3 && web3.utils.isAddress(tokenAddress)) {
      setTokenContract(new web3.eth.Contract(abi.erc20ABI, tokenAddress))
    }
    return () => {
      setTokenContract({})
    }
  }, [web3])

  useEffect(() => {
    const checkAllowance = async () => {
      if (!web3 || !web3.utils.isAddress(contractAddress)) {
        console.error('Invalid contract address to check allowance')
        return
      }
      tokenContract.methods
        .allowance(currentAccount, contractAddress)
        .call()
        .then(res => {
          setAllowance(res)
          allowanceChange(res)
        })
        .catch(err => {
          console.log('Error', err)
        })
    }
    if (tokenContract.methods && currentAccount) {
      checkAllowance()
    }
  }, [tokenContract, contractAddress, currentAccount, allowanceTrigger, allowanceChange])

  const doApprove = async () => {
    if (!web3) {
      message.error('Not connected to web3')
      return
    }
    if (!currentAccount) {
      message.error('No connected account')
      return
    }
    if (!tokenContract || !contractAddress) {
      message.error('Missing approve contract info')
      return
    }
    const messageKey = 'approve'
    setApproving(true)
    notify.info({
      key: messageKey,
      message: 'Approving',
    })
    try {
      const approved = await tokenContract.methods
        .approve(contractAddress, web3.utils.toWei('10000000000000', 'ether'))
        .send({ from: currentAccount })
        .once('transactionHash', hash => {
          // console.log('hash', hash)
          notify.txnSubmitted({
            key: messageKey,
            message: 'Transaction Submitted',
            txHash: hash,
          })
          setAllowanceTrigger(prev => prev + 1)
        })
        .once('receipt', receipt => {
          notify.success({
            key: messageKey,
            message: 'Successfully Approved',
            txHash: receipt.transactionHash,
          })
          console.log('receipt', receipt)
          setAllowanceTrigger(prev => prev + 1)
          setApproving(false)
        })
        .once('error', error => {
          console.error(error)
          notify.error({
            key: `error_${messageKey}`,
            message: `Unexpected Error`,
            description: error.message ? error.message.toString() : JSON.stringify(error),
          })
          notify.close(messageKey)
          setApproving(false)
        })
      console.log('approved', approved)
      setAllowanceTrigger(prev => prev + 1)
    } catch (err) {
      setApproving(false)
      console.error(err)
      notify.close(messageKey)
    }
  }

  return isButton ? (
    <Button type="submit" onClick={doApprove} className="btn btn-main center-block" disabled={approving}>
      {approving ? <FormattedMessage id="action.approving" /> : <FormattedMessage id="action.approve" />}
    </Button>
  ) : (
    <Switch
      good={allowance}
      disabled={allowance > 0}
      onChange={doApprove}
      checked={allowance > 0}
      checkedChildren="Approved"
      unCheckedChildren={approving ? <FormattedMessage id="action.approving" /> : <FormattedMessage id="action.approve" />}
    />
  )
}
