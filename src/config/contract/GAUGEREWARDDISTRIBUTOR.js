
import config from 'config'
import abi from 'config/abi'
import { useContract } from 'hooks/useContracts'

const GAUGEREWARDDISTRIBUTOR = () => {
  const GaugeRewardDistributorContract = useContract(config.contracts.aladdinGaugeRewardDistributor, abi.AladdinGaugeRewardDistributorABI)
  return GaugeRewardDistributorContract
}

export default GAUGEREWARDDISTRIBUTOR

export const getCONCENTRATORGAUGEAddress = () => config.contracts.aladdinGaugeRewardDistributor
