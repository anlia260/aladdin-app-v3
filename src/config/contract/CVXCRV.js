
import config from 'config'
import abi from 'config/abi'
import { useContract } from 'hooks/useContracts'

const CVXCRV = () => {
    const CVXCRVContract = useContract(config.tokens.cvxcrv, abi.erc20ABI)
    return CVXCRVContract
}

export default CVXCRV

export const getCVXCRVAddress = () => config.tokens.cvxcrv
