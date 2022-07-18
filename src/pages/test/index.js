import React, { useState, useContext, useEffect } from 'react'
import { Web3Context } from 'context/Web3Context'
import Button from 'components/Button'
import useVaultList from '../vault/controllers/useVaultList'
import VAULT, { getVAULTAddress } from 'config/contract/VAULT'
import VAULTNEW, { getVAULTNEWAddress } from 'config/contract/VAULTNEW'
import { cBN, basicCheck, formatBalance } from 'utils'



const TestPage = () => {
  const { currentAccount, web3 } = useContext(Web3Context)
  const { VAULT_LIST_DATA, VAULT_NEW_LIST_DATA } = useVaultList()
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [type, setType] = useState('New')
  const [loadingNew, setLoadingNew] = useState(false)
  const [loadingOld, setLoadingOld] = useState(false)
  const handleHarvest = async (type) => {
    setType(type);
    if (!basicCheck(web3, currentAccount)) return
    const pidNew = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
    const pidOld = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
    const pids = type == 'New' ? pidNew : pidOld
    const vaultContract = type == 'New' ? VAULTNEW() : VAULT()
    const loadingFn = type == 'New' ? setLoadingNew : setLoadingOld
    let _data = [];
    let _total = 0;
    setData([])
    setTotal(0)
    let i = 0;
    loadingFn(true)
    for (const pid of pids) {
      const poolName = type == 'New' ? VAULT_NEW_LIST_DATA[i].name : VAULT_LIST_DATA[i].name
      i++;
      try {
        const reward = await vaultContract.methods.harvest(pid, currentAccount, 0).call({ from: currentAccount, gas: 5000000 })
        console.log('harvestPool--', pid, reward / 1e18, poolName)
        const _num = reward / 1e18;
        _total += _num
        _data.push({
          pid,
          name: poolName,
          num: _num
        })
      } catch (e) {
        _data.push({
          pid,
          name: poolName,
          num: 0
        })
        console.log('e---', e)
      }
    }
    loadingFn(false)
    setData(_data)
    setTotal(_total)
  }

  return (
    <div style={{ width: '1024px', margin: '0 auto', background: '#fff', minHeight: '500px' }}>
      <Button style={{ marginTop: '100px', marginLeft: '500px' }} loading={loadingNew} theme="lightBlue" onClick={() => { handleHarvest('New') }}>
        IFO Vault
      </Button>
      <Button style={{ marginTop: '100px', marginLeft: '10px' }} theme="lightBlue" loading={loadingOld} onClick={() => { handleHarvest('Old') }}>
        OLD Vault
      </Button>
      <hr style={{ background: '#ccc', marginTop: '20px' }} />
      <div style={{ marginTop: '20px' }}>
        {!!data.length && data.map((item, index) => {
          return <p key={`type-${index}`}><span style={{ marginRight: '5px' }}>pid: {item.pid}</span> {item.name}<br /> noharvest Number : {item.num}</p>
        })}
        {!!data.length && <p>total:{total}</p>}
      </div>
    </div>
  )
}

export default TestPage
