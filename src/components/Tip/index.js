import React from 'react'
import styles from './styles.module.scss'
import cn from 'classnames'
import { InfoCircleFilled } from '@ant-design/icons'

export default function Tip({ title, placement, color, style, width }) {
  return (
    <div className={styles.tip} style={style}>
      <InfoCircleFilled className={styles.icon} style={{color, width}} />
      <div className={cn(styles.title, styles[placement])} dangerouslySetInnerHTML={{__html: title}} />
    </div>
  )
}
