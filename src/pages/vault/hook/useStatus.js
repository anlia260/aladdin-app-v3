import { useEffect, useMemo, useState } from 'react'
import { cBN, fb4, getLPTokenPrice, getTokenPrice } from 'utils'
import config from 'config'
import abi from 'config/abi'
import useWeb3 from 'hooks/useWeb3'
import { multiCall } from 'utils/contract'
import { useContract } from 'hooks/useContracts'
import moment from 'moment'
import { VAULT_LIST_IFO } from 'config/convexVault'

// default 150w count
const contTotal = 2500000000000000000000000

const useIFOStatus = refreshTrigger => {
  const { web3, currentAccount, checkChain, getBlockNumber } = useWeb3()
  const convexVaultsIFOContract = useContract(config.contracts.concentratorIFOVault, abi.AladdinConcentratorContVaultABI)
  const tokenCRTContract = useContract(config.contracts.aladdinCTR, abi.AladdinCTRABI)
  const [ifoInfo, setIfoInfo] = useState({})

  const fetchCotractInfo = async () => {
    const { startTime, endTime, ctrMined, pendingCTR } = convexVaultsIFOContract.methods
    const { balanceOf } = tokenCRTContract.methods

    const apis = [startTime(), endTime(), ctrMined(), balanceOf(currentAccount)].concat(VAULT_LIST_IFO.map(i => pendingCTR(i.id, currentAccount)))
    const [sTime, eTime, contReleased, crtBalance, ...pendingRewards] = await multiCall(web3, currentAccount, ...apis)

    console.log('useStatus sTime ->', sTime, pendingRewards)
    console.log('useStatus eTime ->', eTime, new Date(eTime * 1000))
    console.log('useStatus contTotal ->', contTotal, fb4(contTotal))
    console.log('useStatus contReleased ->', contReleased, fb4(contReleased))
    console.log('useStatus pendingRewards ->', pendingRewards)
    console.log('useStatus crtBalance ->', fb4(crtBalance))

    const status = () => {
      if (moment().isBefore(moment(sTime * 1000))) {
        return 'ready'
      }
      if (moment().isBetween(moment(sTime * 1000), moment(eTime * 1000))) {
        if (cBN(contReleased).isEqualTo(contTotal)) {
          return 'sellout'
        }
        return 'pending'
      } else {
        return 'ended'
      }
    }

    setIfoInfo({
      sTime,
      eTime,
      contTotal,
      crtBalance,
      contReleased,
      status: status(),
      userRewards: pendingRewards.reduce((prev, index) => prev.plus(index), cBN(0)),
    })
  }

  useEffect(() => {
    if (checkChain && convexVaultsIFOContract) {
      fetchCotractInfo()
    }
  }, [web3, convexVaultsIFOContract, getBlockNumber(), refreshTrigger, checkChain])

  return {
    convexVaultsIFOContract,
    ifoInfo,
  }
}

export default useIFOStatus
