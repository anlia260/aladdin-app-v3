import React, { useEffect } from 'react'
import styles from './styles.module.scss'
import { InfoCircleFilled } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'

export default function Tip({ title, color, width }) {
  const theme = useSelector(state => state.settings.theme)
  const dispatch = useDispatch()

  const showTip = e => {
    dispatch({
      type: 'settings/SET_TIP',
      payload: {
        title: title,
        x: e.clientX,
        y: e.clientY,
      },
    })
  }

  const hideTip = e => {
    if (e.relatedTarget.id === 'tipWrapper') {
      return
    }
    dispatch({
      type: 'settings/SET_TIP',
      payload: {
        title: '',
      },
    })
  }

  return (
    <div className={styles.tip}>
      <InfoCircleFilled  onMouseEnter={showTip}
        onMouseLeave={hideTip} className={styles.icon} style={{color, width}} />
      {/* <img
        onMouseEnter={showTip}
        onMouseLeave={hideTip}
        src={theme === 'default' ? ExpDefault : ExpDark}
        className={styles.icon}
      /> */}
      {/* <div className={cn(styles.titleWrapper, styles[placement])}>
        {titleElement && (
          <div className={cn(styles.title)} style={style}>
            {titleElement}
          </div>
        )}
        {title && <div className={cn(styles.title)} style={style} dangerouslySetInnerHTML={{ __html: title }} />}
      </div> */}
    </div>
  )
}
