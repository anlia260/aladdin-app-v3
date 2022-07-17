
import config from 'config'
import abi from 'config/abi'
import { useContract } from 'hooks/useContracts'

const CONCENTRATORGAUGE = () => {
  const ConcentratorGaugeContract = useContract(config.contracts.aladdinConcentratorGateway, abi.AladdinConcentratorGaugeABI)
  return ConcentratorGaugeContract
}

export default CONCENTRATORGAUGE

export const getCONCENTRATORGAUGEAddress = () => config.contracts.aladdinConcentratorGateway
