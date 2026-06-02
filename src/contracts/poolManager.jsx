export const poolManagerAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_depositToken",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_depositTokenAmount",
        "type": "uint256"
      }
    ],
    "name": "createPool",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllPoolsStruct",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "poolAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "poolOwner",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "poolToken",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "poolTokenAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "poolTotalTrades",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "status",
            "type": "uint256"
          }
        ],
        "internalType": "struct PoolManager.poolObj[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "poolbyId",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "pools",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

export const poolManagerAddress = "0x715C13e76D2F375c8eE1F9F0a5690Ff79a00Df10"