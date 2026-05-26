import React from 'react'
import { useAccount } from 'wagmi'
import { config } from './config'
import { useBalance,useWriteContract,useReadContract,useWaitForTransactionReceipt } from 'wagmi'
const PoolManager = () => {
      const connectedaddress = useAccount(config)
    // console.log(connectaddress.address);
    const currentUserETH = useBalance({
        address: connectedaddress.address,
    })


//   writeContract({
//       abi: multisigABI,
//       address: multisigmanageraddr,
//       functionName: 'acceptWalletRequest',
//       args: [walletRequestIndex]

//     })

    const { data, writeContract, error, isSuccess } = useWriteContract(

    )

    console.log(currentUserETH.data);
    
    // const transaction = useWaitForTransactionReceipt({})
    const { isError, isLoading } = useWaitForTransactionReceipt({
        hash: data,
        confirmations: 2,
        config
    })
  return (
    <div>PoolManager</div>
  )
}

export default PoolManager