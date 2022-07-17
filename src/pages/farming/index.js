import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons'
import AppHeader from 'components/AppHeader'
import AppFooter from 'components/AppFooter'
import cn from 'classnames'
import { cBN, formatBalance } from 'utils'
import axios from 'axios'
import PoolItem from './components/PoolItem'
import Banner from 'components/Banner'

import styles from './styles.module.scss'
import useACrv from './hook/useACrv'
import useWeb3 from 'hooks/useWeb3'
import LiquidityItem from './components/PoolItem/index'
import useLiquidityMining from '../vault/controllers/useLiquidityMining'
import useTvl from 'pages/vault/controllers/useTvl'

let ctime = 0
const FarmingPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [sortDesc, setSortDesc] = useState(false)
  const { getBlockNumber } = useWeb3()

  const { poolList: liquidityPools, liquidityData } = useLiquidityMining(refreshTrigger)
  const { farmingTvl } = useTvl()


  return (
    <div className={styles.vaultPage}>
      <Helmet>
        <title>Concentrator | Curve, Convex | High performance - Farming</title>
        <meta
          name="description"
          content={`Aladdin concentrator is a platform that boosts rewards for Curve & Convex stakers and liquidity providers alike, all in a simple and easy to use interface.`}
        />
      </Helmet>

      <AppHeader />
      <div className="container">
        <Banner title="Farming" subtitle="Deposit assets to earn ACT and multiple rewards" />
        <div className={styles.vaultsInfos}>
          <div className={cn(styles.vaultsInfo, styles.crv)}>
            <div className={styles.vaultsInfoTitle}>Total Locked</div>
            <div className={styles.vaultsInfoValue}>${formatBalance(farmingTvl, 18, 2)}</div>
          </div>
        </div>

        <div>
          <div className={styles.liquidityListHeader}>
            <div>Liquidity Mining</div>
            <div>APR</div>
            <div>TVL</div>
            <div>Deposits</div>
            <div>Earned</div>
            <div />
          </div>
          {liquidityPools.map((item, index) => (
            <LiquidityItem
              item={item}
              triggerChange={() => setRefreshTrigger(prev => prev + 1)}
              key={index}
            />
          ))}
        </div>
      </div>
      <AppFooter />
    </div>
  )
}

export default FarmingPage
