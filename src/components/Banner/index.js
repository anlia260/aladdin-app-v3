import React from 'react'

import styles from './styles.module.scss'

export default function Banner({ title, subtitle }) {
  return (
    <div className={styles.banner}>
      {title && <div className={styles.title}>{title}</div>}
      {subtitle && <div className={styles.subtitle}>{subtitle} </div>}
    </div>
  )
}
