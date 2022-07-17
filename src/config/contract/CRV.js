
import config from 'config'
import abi from 'config/abi'
import { useContract } from 'hooks/useContracts'

const CRV = () => {
    const crvContract = useContract(config.tokens.crv, abi.erc20ABI)
    return crvContract
}

export default CRV

export const getCRVAddress = () => config.tokens.crv
