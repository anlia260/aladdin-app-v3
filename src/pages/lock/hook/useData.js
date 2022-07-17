import { useEffect, useState } from 'react'
import useWeb3 from 'hooks/useWeb3'
import { multiCall } from 'utils/contract'
import useVeCTR, { veCTRAddress } from "config/contract/veCTR"
import useCTR from "config/contract/CTR"
import useVeCTRFee from "config/contract/veCTRFee"
const useData = (refreshTrigger) => {
  const { web3, currentAccount, checkChain, getBlockNumber } = useWeb3()
  const veCTR = useVeCTR()
  const CTR = useCTR()
  const veCTRFee = useVeCTRFee()

  const [contractInfo, seTContractInfo] = useState({
    veTotalSupply: 0, veLockedCTR: 0, userLocked: {}, userVeShare: 0, userVeRewards: 0
  })


  const fetchCotractInfo = async () => {
    const { totalSupply, balanceOf: veCTRBalanceOf } = veCTR.methods
    const { balanceOf } = CTR.methods
    const abiCalls = [totalSupply(), balanceOf(veCTRAddress), veCTRBalanceOf(currentAccount)]
    const { amount, end } = await veCTR.methods.locked(currentAccount).call()

    // const userVeRewards = await veCTRFee.methods.claim().call()
    const [veTotalSupply, veLockedCTR, userVeShare] = await multiCall(web3, currentAccount, ...abiCalls)

    seTContractInfo({
      veTotalSupply, veLockedCTR, userVeShare, userVeRewards: 0, userLocked: { amount, end }
    })
  }

  useEffect(() => {
    if (checkChain && currentAccount) {
      fetchCotractInfo()
    }

  }, [web3, currentAccount, getBlockNumber(), refreshTrigger, checkChain])


  return {
    info: contractInfo,
    contract: {
      veCTR, CTR, veCTRFee
    }
  }

}

export default useData
