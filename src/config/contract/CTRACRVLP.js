
import config from 'config'
import abi from 'config/abi'
import { useContract } from 'hooks/useContracts'

const CTRACRVLP = () => {
    const CTRACRVLPContract = useContract(config.tokens.CTRACRV, abi.erc20ABI)
    return CTRACRVLPContract
}

export default CTRACRVLP

export const getCTRACRVLPAddress = () => config.tokens.CTRACRV
