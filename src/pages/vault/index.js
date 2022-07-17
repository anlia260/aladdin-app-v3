import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { Parallax } from 'react-scroll-parallax'
import Button from 'components/Button'
import cn from 'classnames'
import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons'
import AppHeader from 'components/AppHeader'
import AppFooter from 'components/AppFooter'
// import ArrowDown from 'assets/arrow-down.svg'
import ChartSvg from 'assets/chart.svg'
import BannerSvg from 'assets/banner.svg'
import { formatBalance } from 'utils'
import FaqModal from 'components/FaqModal'
import PoolItem from './components/PoolItem'
import PoolItemNew from './components/PoolItemNew'
import LiquidityItem from './components/PoolItemNew/liquidityItem'
import ActionBoard from './components/ActionBoard'
import StatusBoard from './components/StatusBoard'

import styles from './styles.module.scss'
import useLiquidityMining from './controllers/useLiquidityMining'
import useVaultList from './controllers/useVaultList'
import useTvl from './controllers/useTvl'
import useActionBoard from './controllers/useActionBoard'

const Banner = () => {
  const width = document.documentElement.clientWidth

  const mr = -235 - (width - 1440) / 9.6

  return (
    <div className="flex justify-center p-8">
      <Parallax
        scale={[1, -0.2]}
        translateY={[0, 34.5]}
        translateX={[0, -22]}
        opacity={[1, 0]}
        speed={5}
        className="w-2/5 "
        style={{ marginRight: mr }}
        startScroll={0}
        endScroll={500}
      >
        <img src={ChartSvg} alt="chart" />
      </Parallax>
      <Parallax
        translateY={[-5, 130]}
        translateX={[0, -30]}
        scale={[1, 1.4]}
        speed={1}
        className="w-2/5 my-auto"
        startScroll={0}
        endScroll={500}
      >
        <img src={BannerSvg} alt="banner" />
      </Parallax>
    </div>
  )
}

const VaultPage = () => {
  // new or old
  const [vaultType, setVaultType] = useState('new')
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [refreshStatusTrigger, setRefreshStatusTrigger] = useState(0)
  const [faqModalVisible, setFaqModalVisible] = useState(false)
  const [sortDesc, setSortDesc] = useState(false)
  const { acrvInfo, userInfo } = useActionBoard({ refreshTrigger })
  const { poolList: liquidityPools, liquidityData } = useLiquidityMining(refreshTrigger)
  const { ConvexVaultTvl, convexVaultIFOTvl } = useTvl()
  const { VAULT_LIST_DATA, VAULT_NEW_LIST_DATA } = useVaultList(refreshTrigger)

  const sortPoolsByDeposit = () => {
    // let _newPoolList = poolList
    // if (sortDesc) {
    //   _newPoolList = ConvexVaultInfo.listInfo.sort((a, b) => {
    //     return cBN(b.totalShare * b.lpTokenPrice).toNumber() - cBN(a.totalShare * a.lpTokenPrice).toNumber()
    //   })
    // } else {
    //   _newPoolList = ConvexVaultInfo.listInfo.sort((a, b) => {
    //     return cBN(a.totalShare * a.lpTokenPrice).toNumber() - cBN(b.totalShare * b.lpTokenPrice).toNumber()
    //   })
    // }
    // setNewPoolList(_newPoolList)
    // setSortDesc(per => !per)
  }

  return (
    <div className={styles.vaultPage}>
      <Helmet>
        <title>Concentrator | Curve, Convex | High performance - Vaults</title>
        <meta
          name="description"
          content={`Aladdin concentrator is a platform that boosts rewards for Curve & Convex stakers and liquidity providers alike, all in a simple and easy to use interface.`}
        />
      </Helmet>

      <AppHeader />
      <div className="container">
        <Banner />
        {/* <div className={styles.slogan}>Boost your Convex yields by ~50%</div> */}
        <div className={styles.vaultsInfos}>
          <div className={styles.vaultsInfo}>
            <div className={styles.vaultsInfoTitle}>TVL</div>
            <div className={styles.vaultsInfoValue}>
              ${formatBalance(vaultType === 'new' ? convexVaultIFOTvl : ConvexVaultTvl, 18, 2)}
            </div>
          </div>
          <div className={cn(styles.vaultsInfo, styles.crv)}>
            <div className={styles.vaultsInfoTitle}>cvxCRV In Concentrator</div>
            <div className={styles.vaultsInfoValue}>{formatBalance(acrvInfo.totalUnderlying, 18, 2)}</div>
          </div>
        </div>

        <div className={styles.scrollOut}>
          <div className={styles.scrollIn}>
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

        <div className="mb-16">
          <div className="flex items-center justify-center gap-4 mb-8">
            <Button pure={true} onClick={() => setVaultType('new')} theme={vaultType === 'new' ? 'lightBlue' : 'transBlue'}>
              IFO Vaults
            </Button>
            <Button pure={true} onClick={() => setVaultType('old')} theme={vaultType === 'old' ? 'lightBlue' : 'transBlue'}>
              Original Vaults
            </Button>
          </div>

          <div className={styles.vaultDesc}>
            Deposit directly in IFO vaults or migrate from original vaults to participate.  During the IFO you earn <span className="color-white">$CTR</span>, and after you continue earning in <span className="color-white">$aCRV</span>.
            {/* Migrate your assets to the new IFO vaults to participate in the IFO! Zero withdrawal fees to migrate. During the IFO, the reward is{' '}
            <span className="color-white">$CTR</span>. <br/>After the IFO, the vault becomes a standard Concentrator type, with reward in {' '}
            <span className="color-white">$aCRV</span> */}
          </div>
        </div>

        {vaultType === 'new' && (
          <div className={styles.poolsWrapper}>
            <div className={styles.poolsList}>
              <div className={styles.scrollOut}>
                <div className={styles.scrollIn}>
                  <div className={styles.poolsListHeader}>
                    <div>Pool Name</div>
                    <div>APR</div>
                    <div>TVL</div>
                    <div>Deposits</div>
                    <div />
                  </div>
                  {VAULT_NEW_LIST_DATA.map((item, index) => (
                    <PoolItemNew
                      item={item}
                      // harvestList={harvestList}
                      triggerChange={str => {
                        setRefreshStatusTrigger(prev => prev + 1)
                        setRefreshTrigger(`${Math.random()}_${str}`)
                      }}
                      // poolItem={ConvexVaultIFOInfo.listInfo[index]}
                      key={index}
                    />
                  ))}
                  {/* <div
                  className={cn('flex items-center justify-center gap-4 py-8 color-blue', styles.toggleAllPools)}
                  onClick={() => setAllConvexPoolVisible(prev => !prev)}
                >
                  Show {allConvexPoolVisible ? 'Less' : 'All'} Convex Pool
                  <img src={ArrowDown} className={cn('w-8 h-8', allConvexPoolVisible && 'transform rotate-180')} />
                </div> */}
                </div>
              </div>
            </div>

            <div className={styles.right}>
              <StatusBoard refreshTrigger={refreshStatusTrigger} />
              <ActionBoard vaultType={vaultType} />
            </div>
          </div>
        )}

        {vaultType === 'old' && (
          <div className={styles.poolsWrapper}>
            <div className={styles.poolsList}>
              <div className={styles.poolsListHeader}>
                <div>Pool Name</div>
                <div>APY</div>
                <div className="cursor-pointer" onClick={sortPoolsByDeposit}>
                  <div className="flex items-center justify-center">
                    <span className="align-middle">TVL</span> {sortDesc ? <CaretDownFilled /> : <CaretUpFilled />}
                  </div>
                </div>
                <div>Deposits</div>
                <div />
              </div>
              {VAULT_LIST_DATA.map((item, index) => (
                <PoolItem item={item} triggerChange={str => setRefreshTrigger(`${Math.random()}_${str}`)} key={index} />
              ))}
            </div>
            <div className={styles.right}>
              <ActionBoard vaultType={vaultType} />
            </div>
          </div>
        )}
      </div>
      <AppFooter />
      {faqModalVisible && <FaqModal onCancel={() => setFaqModalVisible(false)} />}
    </div>
  )
}

export default VaultPage
