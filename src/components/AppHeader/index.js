import React, { useContext, useCallback, useState } from 'react'
import cn from 'classnames'
import { Link, NavLink } from 'react-router-dom'
import Button from 'components/Button'
import LogoIcon from 'assets/logo.svg'
import NetworkCheck from 'components/NetworkCheck'
import FaqModal from 'components/FaqModal'
import { Web3Context } from '../../context/Web3Context'

import styles from './styles.module.scss'
import config from 'config'

export default function AppHeader(props) {
  const { currentAccount, connectWallet, resetAccount } = useContext(Web3Context)
  const [faqModalVisible, setFaqModalVisible] = useState(false)
  return (
    <header className={cn(styles.appHeader, 'py-4')}>
      <div className="container">
        <div className="flex justify-between">
          <ul className="flex items-center">
            <li>
              <Link to="/vault">
                <img src={LogoIcon} className={styles.logo} />
              </Link>
            </li>
            {/* <li>
              <a className={styles.link} href="https://app.aladdin.club">
                AladdinDAO
              </a>
            </li> */}
            <li>
              <NavLink className={styles.link} activeClassName={styles.active} to="/vault">
                Vault
              </NavLink>
            </li>
          </ul>
          <div className="flex items-center flex-wrap">
            <div className="px-4 py-3 mr-3 text-white bg-blue-600 cursor-pointer" onClick={() => setFaqModalVisible(true)}>
              FAQ
            </div>
            <NetworkCheck />
            {(currentAccount && currentAccount != config.defaultAddress) ? (
              <div className={styles.connectedWrapper}>
                <Button theme="deepBlue">
                  {currentAccount.slice(0, 4)}...{currentAccount.slice(-4)}
                </Button>
                <div className={styles.menus}>
                  <div className={styles.menu} onClick={resetAccount}>
                    Disconnect
                  </div>
                </div>
              </div>
            ) : (
              <Button pure={true} theme="lightBlue" onClick={connectWallet}>
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
      {faqModalVisible && <FaqModal onCancel={() => setFaqModalVisible(false)} />}
    </header>
  )
}
