
import config from 'config'
import abi from 'config/abi'
import { useContract } from 'hooks/useContracts'

const BALANCERLPGAUGEGATAWAY = () => {
  const BalancerLPGaugeGatewayContract = useContract(config.contracts.aladdinBalancerLPGaugeGateway, abi.AladdinBalancerLPGaugeGatewayABI)
  return BalancerLPGaugeGatewayContract
}

export default BALANCERLPGAUGEGATAWAY

export const getBALANCERLPGAUGEGATAWAYAddress = () => config.contracts.aladdinBalancerLPGaugeGateway
