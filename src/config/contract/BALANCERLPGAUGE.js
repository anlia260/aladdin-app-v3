
import config from 'config'
import abi from 'config/abi'
import { useContract } from 'hooks/useContracts'

const BALANCERLPGAUGE = () => {
    const BALANCERLPGAUGEContract = useContract(config.contracts.aladdinBalancerLPGauge, abi.AladdinBalancerLPGaugeABI)
    return BALANCERLPGAUGEContract
}

export default BALANCERLPGAUGE

export const getBALANCERLPGAUGEAddress = () => config.contracts.aladdinBalancerLPGauge
