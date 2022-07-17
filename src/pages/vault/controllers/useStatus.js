import { useMemo } from "react"
import moment from 'moment'
import { cBN } from 'utils'
import useIFOStatusData from "../hook/useStatusData"

const useIFOStatus = (refreshTrigger) => {
  const { convexVaultsIFOContract, ifoInfo, totalLock } = useIFOStatusData(refreshTrigger)
  // calculate the status of the IFO
  const status = useMemo(() => {
    const { sTime, eTime, timestamp, contReleased, contTotal } = ifoInfo
    const now = moment(timestamp * 1000) || moment()
    if (now.isBefore(moment(sTime * 1000))) {
      return 'ready'
    }
    if (now.isBetween(moment(sTime * 1000), moment(eTime * 1000))) {
      if (cBN(contReleased).isEqualTo(contTotal)) {
        return 'sellout'
      }
      return 'pending'
    } else {
      return 'ended'
    }
  }, [ifoInfo])



  return {
    convexVaultsIFOContract,
    ifoInfo: { ...ifoInfo, status },
    totalLock
  }
}

export default useIFOStatus
