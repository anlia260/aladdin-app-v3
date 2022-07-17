import { useEffect, useState } from 'react'
import { cBN, fb4, getLock, saveLock, saveClaimable } from 'utils'
import useWeb3 from 'hooks/useWeb3'

let lpLoading = false;
let ifoLoading = false;
const useClaimLock = refreshTrigger => {
  const { web3, currentAccount, checkChain, CHAINSTATUS, web3Alc, getBlockNumber } = useWeb3()
  const [claimAbleInfo, setClaimAbleInfo] = useState({
    lpCA: -1,
    ifoCA: -1,
    lockInfo: []
  })
  const [totalLock, setTotalLock] = useState({
    ifototalLock: 0,
    lptotalLock: 0
  })
  const [claimableLoading, setClaimableLoading] = useState(false)

  const getClaimLock = async () => {
    const lock = await getLock(currentAccount)
    console.log('lock---', lock)
    if (lock.code == 100) {
      const _lockInfo = lock.data ? lock.data.lockInfo : []
      const ifototalLock = _lockInfo.reduce(
        (lockNum, item) => item.type == "ifo" ? cBN(lockNum).plus(cBN(item.la)) : cBN(lockNum).plus(cBN(0)),
        cBN(0),
      )
      const lptotalLock = _lockInfo.reduce(
        (lockNum, item) => item.type == "lp" ? cBN(lockNum).plus(cBN(item.la)) : cBN(lockNum).plus(cBN(0)),
        cBN(0),
      )

      setTotalLock({
        ifototalLock,
        lptotalLock
      });
      if (lock.data) {
        const { claimableInfo = {}, lockInfo = [] } = lock.data
        const { lpCA = 0, ifoCA = 0 } = claimableInfo
        setClaimAbleInfo({
          lpCA,
          ifoCA,
          lockInfo
        })
      }
      console.log('totalLock----', totalLock)
    }
  }

  const updateLockCTR = async (claimable, type) => {
    const { lpCA, ifoCA } = claimAbleInfo
    let addLockNum = 0;
    if (claimableLoading) {
      return;
    }
    setClaimableLoading(true)

    switch (type) {
      case 'lp':
        console.log('claimable--lpCA---', claimable, lpCA)
        if (lpCA > -1 && cBN(lpCA).lt(cBN(claimable))) {
          addLockNum = cBN(claimable).minus(cBN(lpCA)).toString(10)
          await saveClaimable({
            lpCA: claimable,
            addr: currentAccount
          })
          await saveLock({
            addr: currentAccount,
            lockedAmount: addLockNum,
            type: type,
            remark: claimable
          })
        }
        break;
      case 'ifo':
        console.log('claimable--ifoCA---', claimable, ifoCA)
        if (ifoCA > -1 && cBN(ifoCA).lt(cBN(claimable))) {
          addLockNum = cBN(claimable).minus(cBN(ifoCA)).toString(10)
          await saveClaimable({
            ifoCA: claimable,
            addr: currentAccount
          })
          await saveLock({
            addr: currentAccount,
            lockedAmount: addLockNum,
            type: type,
            remark: claimable
          })
        }
        break;
    }

    await getClaimLock()
    setClaimableLoading(false)
    return true
  }

  const checkUpdateClaimAble = async (claimable, type) => {
    const { lpCA, ifoCA, lockInfo } = claimAbleInfo;
    const _locked = lockInfo.filter(item => item.remark == claimable && item.type == type)
    switch (type) {
      case 'lp':
        if (lpCA > -1 && claimable != lpCA && cBN(lpCA).lt(cBN(claimable)) && !_locked.length) {
          if (lpLoading) { return }
          lpLoading = true
          await updateLockCTR(claimable, type)
          lpLoading = false
        }
        break;
      case 'ifo':
        if (ifoCA > -1 && claimable != ifoCA && cBN(ifoCA).lt(cBN(claimable)) && !_locked.length) {
          if (ifoLoading) { return }
          ifoLoading = true
          await updateLockCTR(claimable, type)
          ifoLoading = false
        }
        break;
    }
  }


  useEffect(() => {
    if (checkChain == CHAINSTATUS["checkUser"]) {
      getClaimLock()
    }
  }, [checkChain])

  return {
    totalLock,
    checkUpdateClaimAble
  };
}
export default useClaimLock
