
import config from 'config'
import abi from 'config/abi'
import { useContract } from 'hooks/useContracts'

const VAULT = () => {
    const convexVaultsContract = useContract(config.contracts.convexVault, abi.AladdinConvexVaultABI)
    return convexVaultsContract
}

export default VAULT

export const getVAULTAddress = () => config.contracts.convexVault
