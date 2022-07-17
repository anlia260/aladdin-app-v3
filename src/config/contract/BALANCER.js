
import config from 'config'
import abi from 'config/abi'
import { useContract } from 'hooks/useContracts'

const BALANCER = () => {
  const BalancerContract = useContract(config.contracts.BalancerContract, abi.BalancerABI)
  return BalancerContract
}

export default BALANCER

export const getBALANCERWAddress = () => config.contracts.BalancerContract
