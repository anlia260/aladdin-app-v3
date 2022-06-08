import React from 'react'
import styles from './styles.module.scss'
import cn from 'classnames'
import { InfoCircleFilled } from '@ant-design/icons'

export default function Tip({ title, placement, color }) {
  return (
    <div className={styles.tip}>
      <InfoCircleFilled className={styles.icon} style={{color}} />
      <div className={cn(styles.title, styles[placement])} dangerouslySetInnerHTML={{__html: title}} />
    </div>
  )
}
