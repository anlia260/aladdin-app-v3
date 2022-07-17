
import { useEffect, useState } from 'react'
import { cBN, fb4 } from 'utils'
import useWeb3 from 'hooks/useWeb3'
import { multiCall } from 'utils/contract'
import CTRContract from 'config/contract/CTR'
import VAULTNEWContract from 'config/contract/VAULTNEW'
import { VAULT_LIST_IFO } from 'config/convexVault'

// default 250w count
const contTotal = 2500000000000000000000000

const useIFOStatusData = refreshTrigger => {
  const { web3, currentAccount, checkChain, getBlockNumber } = useWeb3()
  const convexVaultsIFOContract = VAULTNEWContract()
  const tokenCRTContract = CTRContract()
  const [ifoInfo, setIfoInfo] = useState({})
  // const [totalLock, setTotalLock] = useState(0)

  const fetchCotractInfo = async () => {
    const { startTime, endTime, ctrMined, pendingCTR } = convexVaultsIFOContract.methods
    const { balanceOf } = tokenCRTContract.methods

    const apis = [startTime(), endTime(), ctrMined(), balanceOf(currentAccount)].concat(VAULT_LIST_IFO.map(i => pendingCTR(i.id, currentAccount)))
    const [sTime, eTime, contReleased, crtBalance, ...pendingRewards] = await multiCall(web3, currentAccount, ...apis)

    // console.log('useStatus sTime ->', sTime, pendingRewards)
    // console.log('useStatus eTime ->', eTime, new Date(eTime * 1000))
    // console.log('useStatus contTotal ->', contTotal, fb4(contTotal))
    // console.log('useStatus contReleased ->', contReleased, fb4(contReleased))
    // console.log('useStatus pendingRewards ->', pendingRewards)
    // console.log('useStatus crtBalance ->', fb4(crtBalance))
    const { timestamp } = await web3.eth.getBlock('latest')
    const _userRewards = pendingRewards.reduce((prev, index) => prev.plus(index), cBN(0))
    setIfoInfo({
      sTime,
      eTime,
      timestamp,
      contTotal,
      crtBalance,
      contReleased,
      userRewards: _userRewards,
    })
    // checkUpdateClaimAble(_userRewards.toString(10),'ifo')
  }

  useEffect(() => {
    if (checkChain && currentAccount && convexVaultsIFOContract) {
      fetchCotractInfo()
    }
  }, [web3, convexVaultsIFOContract, getBlockNumber(), currentAccount, refreshTrigger, checkChain])

  return {
    convexVaultsIFOContract,
    ifoInfo
  }
}

export default useIFOStatusData
