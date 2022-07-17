import React, { useContext, useState } from 'react'
import cn from 'classnames'
import { Link, NavLink } from 'react-router-dom'
import Button from 'components/Button'
import LogoIcon from 'assets/logo.svg'
import NetworkCheck from 'components/NetworkCheck'
import FaqModal from 'components/FaqModal'
import IfoFaqModal from 'components/IfoFaqModal'
import { fb4 } from 'utils'
import { Drawer } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import { Web3Context } from '../../context/Web3Context'

import styles from './styles.module.scss'
import config from 'config'

export default function AppHeader(props) {
  const { currentAccount, connectWallet, resetAccount, ctrBalance } = useContext(Web3Context)
  const [faqModalVisible, setFaqModalVisible] = useState(false)
  const [ifoFaqModalVisible, setIfoFaqModalVisible] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false);


  const Nav = () => {
    return <>
        <div
    className={cn(styles.btn, styles.faq, 'mr-3 text-white cursor-pointer')}
    onClick={() => setFaqModalVisible(true)}
  >
    FAQ
  </div>
  <div
    className={cn(styles.btn, styles.faq, 'mr-3 text-white  cursor-pointer')}
    onClick={() => setIfoFaqModalVisible(true)}
  >
    IFO FAQ
  </div>
  <Button theme="deepBlue" className="mr-3" style={{ padding: '6px 16px', fontSize: '14px' }}>
    {fb4(ctrBalance)} CTR
  </Button>
  <NetworkCheck />
    
    </>

  }

  return (
    <header className={cn(styles.appHeader, 'py-4')}>
      <div className="container">
        <div className="flex justify-between">
          <ul className="flex items-center">
            <li>
              <Link to="/vault">
                <img src={LogoIcon} className={styles.logo} alt="logo" />
              </Link>
            </li>
            <li>
              <NavLink className={styles.link} activeClassName={styles.active} to="/vault">
                Vault
              </NavLink>
            </li>
            <li>
              <NavLink className={styles.link} activeClassName={styles.active} to="/farming">
                Farming
              </NavLink>
            </li>
            <li>
              <NavLink className={styles.link} activeClassName={styles.active} to="/lock">
                Lock
              </NavLink>
            </li>
          </ul>
          <div className="flex items-center flex-wrap">
            <MenuOutlined className={styles.mobileMenu} onClick={()=>setDrawerVisible(true)} />
            <div className={styles.pcNav}>
              <Nav />
            </div>
            {currentAccount && currentAccount !== config.defaultAddress ? (
              <div className={styles.connectedWrapper}>
                <Button style={{ padding: '6px 8px', fontSize: '14px' }} theme="deepBlue">
                  {currentAccount.slice(0, 4)}...{currentAccount.slice(-4)}
                </Button>
                <div className={styles.menus}>
                  <div className={cn(styles.menu, styles.btn)} onClick={resetAccount}>
                    Disconnect
                  </div>
                </div>
              </div>
            ) : (
              <Button style={{ padding: '6px 8px', fontSize: '14px' }} pure={true} theme="lightBlue" onClick={connectWallet}>
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
      {faqModalVisible && <FaqModal onCancel={() => setFaqModalVisible(false)} />}
      {ifoFaqModalVisible && <IfoFaqModal onCancel={() => setIfoFaqModalVisible(false)} />}
      {drawerVisible && <Drawer className='mobile-drawer' visible={true} onClose={()=>setDrawerVisible(false)}>
        
        <Nav /></Drawer>}
    </header>
  )
}
