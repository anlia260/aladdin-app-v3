import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import cn from 'classnames'
import styles from './styles.module.scss'

export default function TipContent({ title }) {
  const tip = useSelector(state => state.settings.tip)
  const theme = useSelector(state => state.settings.theme)
  const dispatch = useDispatch()

  const hideTip = () => {
    dispatch({
      type: 'settings/SET_TIP',
      payload: {
        title: '',
      },
    })
  }

  const showFaqModal = () => {
    dispatch({
      type: 'settings/SET_FAQ_VISIBLE',
      payload: {
        visible: true,
      },
    })
  }

  return (
    <div>
      {tip && tip.title && (
        <div
          id="tipWrapper"
          className={styles.tipWrapper}
          onMouseLeave={hideTip}
          style={
            window.screen.availWidth > tip.x + 300
              ? { left: `${tip.x}px`, top: `${tip.y}px` }
              : { right: `${window.screen.availWidth - tip.x}px`, top: `${tip.y}px` }
          }
        >
          {tip.title === 'seeFAQ' ? (
            <div className={cn(styles.tipContent, theme === 'default' && styles.defaultTheme)}>
              See <a onClick={showFaqModal}>FAQ</a> for details
            </div>
          ) : (
            <div
              className={cn(styles.tipContent, theme === 'default' && styles.defaultTheme)}
              dangerouslySetInnerHTML={{ __html: tip.title }}
            />
          )}
        </div>
      )}
    </div>
  )
}
