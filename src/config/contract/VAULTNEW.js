
import config from 'config'
import abi from 'config/abi'
import { useContract } from 'hooks/useContracts'

const VAULTNEW = () => {
  const VaultNewContract = useContract(config.contracts.concentratorIFOVault, abi.AladdinConcentratorNewVaultABI)
  return VaultNewContract
}

export default VAULTNEW

export const getVAULTNEWAddress = () => config.contracts.concentratorIFOVault
