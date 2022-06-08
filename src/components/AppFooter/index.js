import React from 'react'
import { ReactComponent as IconTwitter } from 'assets/socials/twitter.svg'
import { ReactComponent as IconMedium } from 'assets/socials/medium.svg'
import { ReactComponent as IconGitbook } from 'assets/socials/gitBook.svg'
import { ReactComponent as IconGithub } from 'assets/socials/gitHub.svg'
import { ReactComponent as IconDiscord } from 'assets/socials/discord.svg'
import { ReactComponent as IconTelegram } from 'assets/socials/telegram.svg'
import style from './style.module.scss'

const socialLinks = [
  {
    key: 'twitter',
    icon: <IconTwitter className={style.socialIcons} />,
    link: 'https://twitter.com/0xconcentrator',
  },
  {
    key: 'medium',
    icon: <IconMedium className={style.socialIcons} />,
    link: 'https://aladdindao.medium.com',
  },
  {
    key: 'gitbook',
    icon: <IconGitbook className={style.socialIcons} />,
    link: 'https://docs.aladdin.club/',
  },
  {
    key: 'github',
    icon: <IconGithub className={style.socialIcons} />,
    link: 'https://github.com/AladdinDAO/',
  },
  {
    key: 'discord',
    icon: <IconDiscord className={style.socialIcons} />,
    link: 'https://discord.gg/mCTXgANxWy',
  },
  {
    key: 'telegramm',
    icon: <IconTelegram className={style.socialIcons} />,
    link: 'https://t.me/aladdin_dao',
  },
]

export default function AppFooter() {
  return (
    <div className={style.footer}>
      <div className="container">
        <div className={style.footerInner}>
          <div className={style.linksWrapper}>
            <div className={style.footerTitle}>Audited And Verified</div>
            <ul className={style.links}>
              <li>
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://aladdin.club/audits/PeckShield-Audit-Report-AladdinV3Concentrator-v1.0.pdf"
                >
                  <img src="/resources/images/audits/peckshield.png" />
                </a>
              </li>
              <li>
                <a rel="noopener noreferrer" target="_blank" href="https://aladdin.club/audits/AladdinDao_V3_Report_Secbit.pdf">
                  <img src="/resources/images/audits/secbit.jpg" />
                </a>
              </li>
            </ul>
          </div>
          <div className={style.socials}>
            {socialLinks.map(item => (
              <a
                key={item.key}
                target="_blank"
                rel="noopener noreferrer"
                alt={item.key}
                href={item.link}
                className={style.socialLink}
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>
        <div className={style.copyright}>
          <div className={style.risk}>This project is in beta. Use at your own risk.</div>
          Copyright © 2022 Aladdin ENS:{' '}
          <a rel="noopener noreferrer" target="_blank" href="https://etherscan.io/address/aladdindao.eth">
            AladdinDAO.eth
          </a>
        </div>
      </div>
    </div>
  )
}
