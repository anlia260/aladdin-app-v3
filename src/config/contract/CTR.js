
import config from 'config'
import abi from 'config/abi'
import { useContract } from 'hooks/useContracts'

const CTR = () => {
  const CTRContract = useContract(config.contracts.aladdinCTR, abi.AladdinCTRABI)
  return CTRContract
}

export default CTR

export const getCTRAddress = () => config.contracts.aladdinCTR
