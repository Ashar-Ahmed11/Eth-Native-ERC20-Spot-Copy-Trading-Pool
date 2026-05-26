import React from 'react'
import { useAccount } from 'wagmi'
import { config } from './config'
import { useBalance,useWriteContract,useReadContract,useWaitForTransactionReceipt } from 'wagmi'
import {poolManagerAbi} from '../contracts/poolManager'
import { poolManagerAddress } from '../contracts/poolManager'
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

     const { data: allPools, isPending } = useReadContract({
    abi: poolManagerAbi,
    address: poolManagerAddress,
    functionName: 'getAllPoolsStruct',
    args: [],
    watch: isLoading
  })  
  console.log(allPools);
  

  return (
    <div>PoolManager</div>
  )
}

export default PoolManager