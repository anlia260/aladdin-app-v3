import { useEffect, useMemo, useState } from 'react'
import { cBN, fb4, getLPTokenPrice, getTokenPrice } from 'utils'
import moment from 'moment'
import useData from "../hook/useData"

const useInfo = (refreshTrigger) => {
  const { info, contract } = useData(refreshTrigger)

  const [pageData, setPageData] = useState({
    overview: [
      {
        title: 'APY',
        value: '20.3%',
      },
      {
        title: 'Total veCTR',
        value: '300,000',
      },
      {
        title: 'Total Locked CRT',
        value: '300,000',
      },
      {
        title: 'AVG Time',
        value: '300,000',
      },
    ],
    status: 'no-lock',
    userData: [
      {
        title: 'Your Locked',
        value: '0',
      }, {
        title: 'Your Share',
        value: '0',
      }, {
        title: 'Locked to',
        value: '0',
      }, {
        title: 'Rewards',
        value: '0',
      }
    ],
    contract,
    contractInfo: info
  })

  useEffect(() => {
    const { veTotalSupply, veLockedCTR, userLocked, userVeShare, userVeRewards } = info
    const avgTime = () => {
      const years = cBN(veLockedCTR).isZero() ? 0 : cBN(4).multipliedBy(veTotalSupply).div(veLockedCTR)
      if (!years) {
        return '-'
      }

      if (years.isGreaterThan(1)) {
        return `${years.toFixed(2)} years`
      } else if (years.isGreaterThan(cBN(1).div(12))) {
        return `${years.multipliedBy(12).toFixed(2)} months`
      }

      return `${years.multipliedBy(365).toFixed(2)} days`
    }
    const { amount, end } = userLocked
    let status = 'no-lock'
    if (end != 0 && end != undefined) {
      status = 'ing'
      if (moment(end * 1000).isBefore(moment())) {
        status = 'expired'
      }
    }


    setPageData(prev => ({
      ...prev, overview: [
        {
          title: 'APY',
          value: '0',
        },
        {
          title: 'Total veCTR',
          value: fb4(veTotalSupply),
        },
        {
          title: 'Total Locked CRT',
          value: fb4(veLockedCTR),
        },
        {
          title: 'AVG Time',
          value: avgTime(),
        },
      ],
      status,
      contractInfo: info,
      userData: [
        {
          title: 'Your Locked',
          value: `${fb4(amount)} CTR`,
        }, {
          title: 'Your Share',
          value: `${fb4(userVeShare)} veCTR`,
        }, {
          title: 'Locked to',
          value: end != 0 && end != undefined ? moment(end * 1000).format('lll') : '-',
        }, {
          title: 'Rewards',
          value: `${fb4(userVeRewards)} aCRV`,
        }
      ],
    }))

  }, [info])

  return pageData

}

export default useInfo
