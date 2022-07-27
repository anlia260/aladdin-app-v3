import tokensInfo from './tokens'
const CHAIN_ID = 10540

const NETWORK_NAME = 'mainnet'
const devRpcurl = [10540, 'http://47.242.46.45:10540']

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
