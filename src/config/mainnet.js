import tokensInfo from './tokens'
const CHAIN_ID = 1

const NETWORK_NAME = 'mainnet'
const devRpcurl = [1, 'https://eth-mainnet.alchemyapi.io/v2/NYoZTYs7oGkwlUItqoSHJeqpjqtlRT6m']

const contracts = {
  ...tokensInfo.contracts
}

const tokens = {
  ...tokensInfo.tokens
}

const BalancerPools = {
  ...tokensInfo.BalancerPools
}

const TOKENS_INFO = {
  ...tokensInfo.TOKENS_INFO
}

const zapTokens = tokensInfo.zapTokens

const convexVaultPool = {
  ...tokensInfo.convexVaultPool
}

const CONVEXVAULTPOOL_INFO = {
  ...tokensInfo.CONVEXVAULTPOOL_INFO
}

export default {
  CHAIN_ID,
  devRpcurl,
  NETWORK_NAME,
  tokens,
  zapTokens,
  contracts,
  convexVaultPool,
  BalancerPools,
  TOKENS_INFO,
  CONVEXVAULTPOOL_INFO
}
