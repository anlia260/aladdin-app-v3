import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Parallax } from 'react-scroll-parallax'
import Button from 'components/Button'
import cn from 'classnames'
import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons'
import AppHeader from 'components/AppHeader'
import AppFooter from 'components/AppFooter'
import ArrowDown from 'assets/arrow-down.svg'
import ChartSvg from 'assets/chart.svg'
import BannerSvg from 'assets/banner.svg'
import { cBN, formatBalance } from 'utils'
import FaqModal from 'components/FaqModal'
import axios from 'axios'
import PoolItem from './components/PoolItem'
import PoolItemNew from './components/PoolItemNew'
import LiquidityItem from './components/PoolItemNew/liquidityItem'
import ActionBoard from './components/ActionBoard'
import StatusBoard from './components/StatusBoard'

import styles from './styles.module.scss'
import useConvexVault from './hook/useConvexVault'
import useConvexVaultIFO from './hook/useConvexVaultIFO'
import useLiquidityMining from './hook/useLiquidityMining'
import useACrv from './hook/useACrv'
import useWeb3 from 'hooks/useWeb3'

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
        <img src={ChartSvg} />
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
        <img src={BannerSvg} />
      </Parallax>
    </div>
  )
}
let ctime = 0
const VaultPage = () => {
  // new or old
  const [vaultType, setVaultType] = useState('new')
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [refreshIFOTrigger, setRefreshIFOTrigger] = useState(0)
  const { poolList, ConvexVaultInfo, ConvexVaultTvl, harvestList } = useConvexVault(refreshTrigger)
  const { poolList: poolIFOList, ConvexVaultIFOInfo, convexVaultIFOTvl } = useConvexVaultIFO(refreshIFOTrigger)
  const [faqModalVisible, setFaqModalVisible] = useState(false)
  const [allConvexPoolVisible, setAllConvexPoolVisible] = useState(false)
  const [sortDesc, setSortDesc] = useState(false)
  const { getBlockNumber } = useWeb3()
  const { acrvInfo, userInfo } = useACrv()
  const [newPoolList, setNewPoolList] = useState(poolList)
  const { poolList: liquidityPools, liquidityData } = useLiquidityMining(refreshTrigger)

  const setApy = async () => {
    const json = await axios.get('https://concentrator-api.aladdin.club/apy/', { timeout: 2000 })
    localStorage.setItem('app.settings.apy', JSON.stringify(json.data))
  }

  // const checkFaq = () => {
  //   const totalShare = ConvexVaultInfo.listInfo.reduce((a, b) => +a + +b.totalShare, 0)
  //   if (!totalShare && !userInfo.allPoolRewardaCrv && !userInfo.userAcrvWalletBalance) {
  //     setFaqModalVisible(true)
  //   }
  // }

  const sortPoolsByDeposit = () => {
    let _newPoolList = poolList
    if (sortDesc) {
      _newPoolList = ConvexVaultInfo.listInfo.sort((a, b) => {
        return cBN(b.totalShare * b.lpTokenPrice).toNumber() - cBN(a.totalShare * a.lpTokenPrice).toNumber()
      })
    } else {
      _newPoolList = ConvexVaultInfo.listInfo.sort((a, b) => {
        return cBN(a.totalShare * a.lpTokenPrice).toNumber() - cBN(b.totalShare * b.lpTokenPrice).toNumber()
      })
    }
    setNewPoolList(_newPoolList)
    setSortDesc(per => !per)
  }

  useEffect(() => {
    const _currTime = +new Date()
    if (_currTime - ctime > 1000 * 60 * 2) {
      ctime = _currTime
      setApy()
    }
  }, [getBlockNumber()])

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
            <div className={styles.vaultsInfoValue}>${formatBalance(vaultType == 'new' ? convexVaultIFOTvl : ConvexVaultTvl, 18, 2)}</div>
          </div>
          <div className={cn(styles.vaultsInfo, styles.crv)}>
            <div className={styles.vaultsInfoTitle}>cvxCRV In Concentrator</div>
            <div className={styles.vaultsInfoValue}>{formatBalance(acrvInfo.totalUnderlying, 18, 2)}</div>
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
              isLP={true}
              item={item}
              harvestList={harvestList}
              triggerChange={() => setRefreshTrigger(prev => prev + 1)}
              poolItem={liquidityData}
              key={index}
            />
          ))}
        </div>

        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <Button pure={true} onClick={() => setVaultType('new')} theme={vaultType === 'new' ? 'lightBlue' : 'deepBlue'}>
              New Vault
            </Button>
            <Button pure={true} onClick={() => setVaultType('old')} theme={vaultType === 'old' ? 'lightBlue' : 'deepBlue'}>
              Old Vault
            </Button>
          </div>

          <div className={styles.vaultDesc}>
          Migrate your assets to the new vault to participate in the IFO.<br/>
          
           During the IFO, vaults rewards <span className="color-white">$aCRV</span> will be replaced by <span className="color-white">$CTR</span> with 1:1. <br/>
           
           After the IFO, vaults rewards will revert to <span className="color-white">$aCRV</span> and auto-compounding.

          </div>
        </div>

        {vaultType === 'new' && (
          <div className={styles.poolsWrapper}>
            <div className={styles.poolsList}>
              <div className="mb-12">
                <div className={styles.poolsListHeader}>
                  <div />
                  <div>APR</div>
                  <div>TVL</div>
                  <div>Deposits</div>
                  <div />
                </div>
                {poolIFOList.map((item, index) => (
                  <PoolItemNew
                    item={item}
                    harvestList={harvestList}
                    triggerChange={() => setRefreshTrigger(prev => prev + 1)}
                    poolItem={ConvexVaultIFOInfo.listInfo[index]}
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

            <div className={styles.right}>
              <StatusBoard />
              <ActionBoard />
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
              {newPoolList.map((item, index) => (
                <PoolItem
                  item={item}
                  harvestList={harvestList}
                  triggerChange={() => setRefreshTrigger(prev => prev + 1)}
                  poolItem={ConvexVaultInfo.listInfo[index]}
                  key={index}
                />
              ))}
            </div>
            <div className={styles.right}>
              <ActionBoard />
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
