import { useEffect, useState } from 'react'
import { cBN, getLPTokenPrice, getTokenPrice } from 'utils'
import config from 'config'
import abi from 'config/abi'
import useWeb3 from 'hooks/useWeb3'
import { BalancerSDK, BalancerSdkConfig, Network } from '@balancer-labs/sdk';
import { multiCall } from 'utils/contract'
import useACrv from './useACrv'
import { useContract } from 'hooks/useContracts'
import { LIQUIDITY_LIST_IFO } from 'config/convexVault'
import NoPayableAction, { noPayableErrorAction } from 'utils/noPayableAction'

let ctime = 0
const useLiquidityMining = refreshTrigger => {
  const { web3, currentAccount, checkChain, CHAINSTATUS, web3Alc, getBlockNumber } = useWeb3()
  const [liquidityListInfo, setLiquidityListInfo] = useState({ listInfo: LIQUIDITY_LIST_IFO })
  const convexVaultsIFOContract = useContract(config.contracts.concentratorIFOVault, abi.AladdinConcentratorContVaultABI)
  const [liquidityData, setLiquidityData] = useState({
    totalSupply: 0, userDeposits: 0, liquidityApy: cBN(0)
  })

  const [apy, setApy] = useState(0)
  const AladdinLiquidityMiningRewarderContract = useContract(config.contracts.aladdinLiquidityMiningRewarder, abi.AladdinConcetratorLiquidityMiningABI)
  const AladdinConcetratorLiquidityGaugeContract = useContract(config.contracts.aladdinConcentratorLiquidityGauge, abi.AladdinConcetratorLiquidityGaugeABI)

  const BalancerSdkConfig = {
    network: Network.MAINNET,
    rpcUrl: config.INFURA_HTTP_URL,
  };

  const balancer = new BalancerSDK(BalancerSdkConfig);



  const fetchLiquidityData = async () => {
    let _web3 = web3;
    if (checkChain === CHAINSTATUS["checkWeb3"]) {
      _web3 = web3Alc
    }
    try {
      const wethDaiPoolId =
        '0x0b09dea16768f0799065c475be02919503cb2a3500020000000000000000001a';
      // This will fetch pools information using data provider
      const spotPriceEthDai = await balancer.pricing.getSpotPrice(
        '0x6b175474e89094c44da98b954eedeac495271d0f',
        '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        wethDaiPoolId
      );
      console.log('spotPriceEthDai---', spotPriceEthDai)
      const goblinContracts = [
        AladdinConcetratorLiquidityGaugeContract.methods.totalSupply(),
        AladdinConcetratorLiquidityGaugeContract.methods.claimable_reward_write(currentAccount, config.tokens.CTR),
        AladdinConcetratorLiquidityGaugeContract.methods.balanceOf(currentAccount),
        convexVaultsIFOContract.methods.ctrMined()
      ]
      const [totalSupply, claimable, userDeposits, ctrMined] = await multiCall(
        web3,
        currentAccount,
        ...goblinContracts,
      )
      // console.log('totalSupply, claimable, userDeposits, ctrMined---', testa, currentAccount, config.tokens.CTR, totalSupply, claimable, userDeposits, ctrMined)
      const liquidityApy = cBN(ctrMined).div(totalSupply || 1).multipliedBy(100) || cBN(0)
      const liquidityData = {
        ...LIQUIDITY_LIST_IFO[0],
        totalSupply,
        claimable,
        userDeposits,
        liquidityApy
      }
      setLiquidityData(liquidityData)
      return liquidityData
    } catch (e) {
      return []
    }
  }


  useEffect(async () => {
    if (checkChain) {
      // const crvPrice = await getTokenPrice('convex-crv')
      await fetchLiquidityData()
      // setConvexVaultIFOInfo({
      //   listInfo: listData
      // })
    }
  }, [getBlockNumber(), checkChain, refreshTrigger])

  return {
    poolList: LIQUIDITY_LIST_IFO,
    liquidityData,
    liquidityListInfo,
    fetchLiquidityData,
    AladdinLiquidityMiningRewarderContract,
    AladdinConcetratorLiquidityGaugeContract
  }
}
export default useLiquidityMining
