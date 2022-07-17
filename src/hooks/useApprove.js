import { useState, useCallback, useContext } from 'react'
import { Web3Context } from 'context/Web3Context'
import Button from 'components/Button'
import NoPayableAction, { noPayableErrorAction } from 'utils/noPayableAction'
import { basicCheck } from 'utils'


export const useApprove = ({
  allowance,
  tokenContract,
  approveAddress
}) => {

  const { currentAccount, web3 } = useContext(Web3Context)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [loading, setLoading] = useState(false)

  const allowAction = allowance > 0

  const [button, setButton] = useState({
    loading: false,
    children: 'Approve'
  })

  const handleApprove = useCallback(async (confirmationCall) => {
    if (!basicCheck(web3, currentAccount)) return
    setButton({
      loading: true,
      children: 'Approve'
    })
    try {
      const apiCall = tokenContract.methods.approve(
        approveAddress,
        web3.utils.toWei('1000000000000000000', 'ether'),
      )
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 'earn',
        action: 'approv',
      }, () => {
        confirmationCall && confirmationCall()
      })
      setButton({
        loading: false,
        children: 'Approve'
      })

      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      setButton({
        loading: false,
        children: 'Approve'
      })
      noPayableErrorAction(`error_earn_approve`, error)
    }
  }, [currentAccount, tokenContract, approveAddress])

  const BtnWapper = ({ loading: actionLoading, onClick: confirmationCall, children, ...other }) => {
    return <>
      <Button
        loading={actionLoading || button.loading}
        width="280px"
        theme='lightBlue'
        onClick={() => { !allowAction ? handleApprove(confirmationCall) : confirmationCall() }}
        {...other}
      >
        {
          (button.loading === true || !allowAction) ?
            `${button.children}&${children}` : children
        }
      </Button>
    </>
  }

  return {
    allowAction,
    loading,
    refreshTrigger,
    BtnWapper,
    handleApprove
  }
}

export default useApprove
