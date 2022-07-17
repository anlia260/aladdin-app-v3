
import config from 'config'
import abi from 'config/abi'
import { useContract } from 'hooks/useContracts'

const useVeCTR = () => {
  const VeCtrContract = useContract(config.contracts.veCtr, abi.veCTR)
  return VeCtrContract
}

export const veCTRAddress = config.contracts.veCtr

export default useVeCTR
