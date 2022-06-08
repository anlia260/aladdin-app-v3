import React from 'react'
import { FormattedMessage } from 'react-intl'

import './style.scss'

export default function MaxButton(props) {
  return (
    <button
      type="button"
      className="max-btn"
      onClick={() => {
        props.onSet()
      }}
    >
      <FormattedMessage id="form.max" />
    </button>
  )
}
