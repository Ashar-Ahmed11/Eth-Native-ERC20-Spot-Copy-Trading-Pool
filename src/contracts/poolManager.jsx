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
    "name": "getAllPools",
    "outputs": [
      {
        "internalType": "string[5]",
        "name": "",
        "type": "string[5]"
      },
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      },
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      },
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
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

export const poolManagerAddress = "0xe5e56701f7e241cc8C598615C4FBf6EF1ECf27B6"