import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import AppHeader from 'components/AppHeader'
import AppFooter from 'components/AppFooter'
import LockModal from './components/LockModal'
import LockMoreModal from './components/LockMoreModal'
import ExtendModal from './components/ExtendModal'
import cn from 'classnames'
import Button from 'components/Button'
import Banner from 'components/Banner'

import useInfo from "./controllers/useInfo"

import styles from './styles.module.scss'
import { cBN } from 'utils'


const LockPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [lockModalVisible, setLockModalVisible] = useState(false)
  const [lockMoreModalVisible, setLockMoreModalVisible] = useState(false)
  const [extendModalVisible, setExtendModalVisible] = useState(false)

  const InfoItem = ({ title, value }) => (
    <div className={styles.infoItem}>
      {title}: {value}
    </div>
  )

  const pageData = useInfo(refreshTrigger)

  return (
    <div className={styles.vaultPage}>
      <Helmet>
        <title>Concentrator | Curve, Convex | High performance - Lock CTR</title>
        <meta
          name="description"
          content={`Aladdin concentrator is a platform that boosts rewards for Curve & Convex stakers and liquidity providers alike, all in a simple and easy to use interface.`}
        />
      </Helmet>

      <AppHeader />
      <div className="container">
        <Banner title="Lock CRT" subtitle="lock CTR to earn platform fee in aCRV" />

        <div className="flex gap-6">
          <div className={cn(styles.actionBoard, ' p-16 flex-1')}>
            <div className={cn(styles.boardTitle, 'text-lg font-semibold')}>Overview</div>
            <div className={styles.vaultsInfos}>
              {pageData.overview.map((item, index) => (
                <div key={index} className="p-4 w-1/2">
                  <div className={cn(styles.vaultsInfo)}>
                    <div className={styles.vaultsInfoTitle}>{item.title}</div>
                    <div className={styles.vaultsInfoValue}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={cn(styles.actionBoard, 'p-16 flex-1')}>
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className={cn(styles.boardTitle, 'text-lg font-semibold')}>Lock CTR</div>
                {pageData.userData.map(i => <InfoItem title={i.title} value={i.value} />)}
              </div>
              <div className="flex gap-3 justify-end">
                {cBN(pageData.contractInfo.userVeRewards).isGreaterThan(0) &&
                  <Button theme="deepBlue">Claim Rewards</Button>
                }
                {pageData.status === 'no-lock' && <Button theme="lightBlue" onClick={() => setLockModalVisible(true)}>
                  Create Lock
                </Button>}

                {pageData.status === 'ing' && <Button theme="deepBlue" onClick={() => setLockMoreModalVisible(true)}>
                  Lock More
                </Button>}

                {pageData.status === 'ing' && <Button theme="deepBlue" onClick={() => setExtendModalVisible(true)}>
                  Extend
                </Button>}

                {/* Visible when lock end */}
                {/* <Button theme="deepBlue">Claim CTR</Button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AppFooter />

      {lockModalVisible && <LockModal onCancel={() => setLockModalVisible(false)} refreshAction={setRefreshTrigger} />}
      {lockMoreModalVisible && <LockMoreModal pageData={pageData} onCancel={() => setLockMoreModalVisible(false)} refreshAction={setRefreshTrigger} />}
      {extendModalVisible && <ExtendModal pageData={pageData} onCancel={() => setExtendModalVisible(false)} refreshAction={setRefreshTrigger} />}
    </div>
  )
}

export default LockPage
