import React from 'react'
import { Web3ContextProvider } from './context/Web3Context'
// import { connect } from 'react-redux'

const Web3Context = ({ children }) => {
  return <Web3ContextProvider>{children}</Web3ContextProvider>
}

export default Web3Context
