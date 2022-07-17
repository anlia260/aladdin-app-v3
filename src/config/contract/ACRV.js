
import config from 'config'
import abi from 'config/abi'
import { useContract } from 'hooks/useContracts'

const ACRV = () => {
    const AcrvContract = useContract(config.contracts.convexVaultAcrv, abi.AladdinCRVABI)
    return AcrvContract
}

export default ACRV

export const getACRVAddress = () => config.contracts.convexVaultAcrv
