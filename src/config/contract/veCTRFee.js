
import config from 'config'
import abi from 'config/abi'
import { useContract } from 'hooks/useContracts'

const useVeCTRFee = () => {
  const VeCtrFeeContract = useContract(config.contracts.veCtrFee, abi.veCTRFeeDistributor)
  return VeCtrFeeContract
}

export default useVeCTRFee
