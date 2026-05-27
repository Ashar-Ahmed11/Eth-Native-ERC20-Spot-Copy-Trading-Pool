import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useBalance, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, isAddress, formatEther } from 'viem'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { poolManagerAbi } from '../contracts/poolManager'
import { poolManagerAddress } from '../contracts/poolManager'
import { erc20Abi } from '../contracts/erc20'


const shortenAddress = (address = '') => {
  if (!address) return '-'
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const PoolManager = () => {
  const connectedaddress = useAccount()
  const [showModal, setShowModal] = useState(false)
  const [tokenAddress, setTokenAddress] = useState('')
  const [depositTokenAmount, setDepositTokenAmount] = useState('')
  const [searchText, setSearchText] = useState('')
  const [sortOrder, setSortOrder] = useState('newest')
  const [lastAction, setLastAction] = useState('')
  const [tokenMetaMap, setTokenMetaMap] = useState({})

  const tokenAddressIsValid = isAddress(tokenAddress || '0x0')
  const amountIsValid = !!depositTokenAmount && /^\d+$/.test(depositTokenAmount)
  const depositAmountValue = amountIsValid ? parseUnits(depositTokenAmount, 0) : 0n

  const currentUserETH = useBalance({
    address: connectedaddress.address,
  })

  const { data, writeContract, error, isPending: isWritePending } = useWriteContract()

  const { data:receipt,isSuccess: isConfirmed, isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: data,
    chainId:31337,
    confirmations: 1
  })

  console.log("transaction receipt success: ",isConfirmed);
  console.log("transaction receipt is loading: ",isConfirming);
  console.log("transaction hash: ",receipt);
  

  const { data: allPools, isPending, refetch } = useReadContract({
    abi: poolManagerAbi,
    address: poolManagerAddress,
    functionName: 'getAllPoolsStruct',
  })

  const { data: allowanceValue, refetch: refetchAllowance } = useReadContract({
    abi: erc20Abi,
    address: tokenAddressIsValid ? tokenAddress : undefined,
    functionName: 'allowance',
    args: [connectedaddress?.address, poolManagerAddress],
    query: {
      enabled: !!connectedaddress?.address && tokenAddressIsValid && amountIsValid
    }
  })

  const isApproved = amountIsValid && tokenAddressIsValid && (allowanceValue || 0n) >= depositAmountValue

  useEffect(() => {
    const fetchTokenList = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/Uniswap/default-token-list/main/src/tokens/mainnet.json')
        const tokens = await response.json()
        const mapByAddress = tokens.reduce((acc, token) => {
          acc[token.address.toLowerCase()] = token
          return acc
        }, {})
        setTokenMetaMap(mapByAddress)
      } catch (fetchError) {
        toast.error('Could not fetch token metadata list')
      }
    }
    fetchTokenList()
  }, [])

  useEffect(() => {
    if (!error) return
    toast.error(error.shortMessage || error.message || 'Transaction failed')
  }, [error])

  useEffect(() => {
    if (!isConfirmed) return
    if (lastAction === 'approve') {
      toast.success('Token approved for pool manager')
      refetchAllowance()
    }
    if (lastAction === 'create') {
      toast.success('Pool created successfully')
      setShowModal(false)
      setTokenAddress('')
      setDepositTokenAmount('')
      refetchAllowance()
      refetch()
    }
  }, [isConfirmed, lastAction, refetch, refetchAllowance])

  const handleCreatePool = () => {
    if (!tokenAddressIsValid || !amountIsValid) return
    setLastAction('create')
    writeContract({
      abi: poolManagerAbi,
      address: poolManagerAddress,
      functionName: 'createPool',
      args: [tokenAddress, depositAmountValue]
    })
  }

  const handleApprove = () => {
    if (!tokenAddressIsValid || !amountIsValid) return
    setLastAction('approve')
    writeContract({
      abi: erc20Abi,
      address: tokenAddress,
      functionName: 'approve',
      args: [poolManagerAddress, depositAmountValue]
    })
  }

  const handleCopy = async (value) => {
    try {
      await navigator.clipboard.writeText(value)
      toast.success('Copied to clipboard')
    } catch (copyError) {
      toast.error('Copy failed')
    }
  }

  const allPoolsList = allPools || []
  const totalLiquidity = Number(formatEther( allPoolsList.reduce((acc, pool) => acc + (pool?.poolTokenAmount || 0n), 0n))).toFixed(2)
  const totalTrades = allPoolsList.reduce((acc, pool) => acc + (pool?.poolTotalTrades || 0n), 0n)

  const filteredPools = allPoolsList.filter((pool) => {
    if (!searchText.trim()) return true
    const query = searchText.toLowerCase()
    return (
      pool.poolAddress.toLowerCase().includes(query) ||
      pool.poolOwner.toLowerCase().includes(query) ||
      pool.poolToken.toLowerCase().includes(query)
    )
  })

  const displayedPools = [...filteredPools].sort((a, b) => {
    if (sortOrder === 'oldest') return a.poolAddress.localeCompare(b.poolAddress)
    return b.poolAddress.localeCompare(a.poolAddress)
  })

  return (
    <main className="container py-4 pool-page">
      <ToastContainer position="top-right" autoClose={4000} />
      <div className="d-flex align-items-start justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h1 className="pool-title mb-1">Pool Manager</h1>
          <p className="pool-subtitle mb-0">Create and manage your liquidity pools</p>
        </div>
        <button className="btn btn-primary px-4 py-2" onClick={() => setShowModal(true)}>Create Pool</button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-xl-3">
          <div className="pool-stat-card">
            <p className="pool-stat-label mb-1">Total Pools</p>
            <h3 className="pool-stat-value mb-1">{allPoolsList.length}</h3>
            <p className="pool-stat-note mb-0">Active pools</p>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <div className="pool-stat-card">
            <p className="pool-stat-label mb-1">Total Liquidity</p>
            <h3 className="pool-stat-value mb-1">{totalLiquidity}</h3>
            <p className="pool-stat-note mb-0">Token units</p>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <div className="pool-stat-card">
            <p className="pool-stat-label mb-1">Total Trades</p>
            <h3 className="pool-stat-value mb-1">{totalTrades.toString()}</h3>
            <p className="pool-stat-note mb-0">All time</p>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <div className="pool-stat-card">
            <p className="pool-stat-label mb-1">Your Balance</p>
            <h3 className="pool-stat-value mb-1">
              {connectedaddress.address ? (Number(currentUserETH?.data?.formatted || 0).toFixed(4)) : '0.0000'} ETH
            </h3>
            <p className="pool-stat-note mb-0">Wallet balance</p>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
        <h3 className="pool-section-title mb-0">Your Pools ({displayedPools.length})</h3>
        <div className="d-flex gap-2 align-items-center flex-wrap">
          <input
            type="text"
            className="form-control pool-search"
            placeholder="Search pools..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <select
            className="form-select pool-sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="newest">Sort by: Newest</option>
            <option value="oldest">Sort by: Oldest</option>
          </select>
        </div>
      </div>

      {isPending && <p className="text-muted">Loading pools...</p>}
      {!isPending && displayedPools.length === 0 && (
        <p className="text-muted">No pools available.</p>
      )}

      <div className="row g-3">
        {displayedPools.map((pool, index) => {
          const poolTokenMeta = tokenMetaMap[pool.poolToken.toLowerCase()]
          return (
          <div className="col-12 col-lg-6" key={`${pool.poolAddress}-${index}`}>
            <div className="card h-100 pool-item-card">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div className="d-flex align-items-center gap-3">
                    {poolTokenMeta?.logoURI ? (
                      <img
                        src={poolTokenMeta.logoURI}
                        alt={poolTokenMeta.symbol || 'token'}
                        width="44"
                        height="44"
                        className="rounded-circle border"
                      />
                    ) : (
                      <div className="rounded-circle border d-flex align-items-center justify-content-center" style={{ width: '44px', height: '44px' }}>
                        <span className="small text-muted">?</span>
                      </div>
                    )}
                    <div>
                      <h5 className="mb-1">{poolTokenMeta?.symbol || shortenAddress(pool.poolToken)}</h5>
                      <p className="pool-meta-label mb-0">{poolTokenMeta?.name || 'Unknown Token'}</p>
                      <span className="badge bg-success-subtle text-success-emphasis px-3 py-2 mt-2">Active</span>
                    </div>
                  </div>
                  <span className="badge text-bg-light text-primary px-3 py-2">Pool #{index + 1}</span>
                </div>
                <div className="row g-2 pb-3 border-bottom">
                  <div className="col-12 col-md-4">
                    <p className="pool-meta-label mb-1">Token Amount</p>
                    <p className="pool-meta-value mb-0">{Number(formatEther(pool.poolTokenAmount)).toFixed(2)}</p>
                  </div>
                  <div className="col-12 col-md-4">
                    <p className="pool-meta-label mb-1">Total Trades</p>
                    <p className="pool-meta-value mb-0">{pool.poolTotalTrades?.toString()}</p>
                  </div>
                  <div className="col-12 col-md-4">
                    <p className="pool-meta-label mb-1">Liquidity</p>
                    <p className="pool-meta-value mb-0">{Number(formatEther(pool.poolTokenAmount)).toFixed(2)}</p>
                  </div>
                </div>
                <div className="row g-3 pt-3">
                  <div className="col-12 col-md-6">
                    <p className="pool-meta-label mb-1">Pool Address</p>
                    <p className="pool-address mb-0">
                      {shortenAddress(pool.poolAddress)}
                      <button
                        type="button"
                        className="btn pool-copy-btn ms-2"
                        onClick={() => handleCopy(pool.poolAddress)}
                        title="Copy pool address"
                      >
                        Copy
                      </button>
                    </p>
                  </div>
                  <div className="col-12 col-md-6">
                    <p className="pool-meta-label mb-1">Pool Owner</p>
                    <p className="pool-address mb-0">
                      {shortenAddress(pool.poolOwner)}
                      <button
                        type="button"
                        className="btn pool-copy-btn ms-2"
                        onClick={() => handleCopy(pool.poolOwner)}
                        title="Copy pool owner"
                      >
                        Copy
                      </button>
                    </p>
                  </div>
                  <div className="col-12">
                    <p className="pool-meta-label mb-1">Pool Token</p>
                    <p className="pool-address mb-0">
                      {shortenAddress(pool.poolToken)}
                      <button
                        type="button"
                        className="btn pool-copy-btn ms-2"
                        onClick={() => handleCopy(pool.poolToken)}
                        title="Copy pool token"
                      >
                        Copy
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )
        })}
      </div>

      {showModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Create Pool</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Token Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={tokenAddress}
                      onChange={(e) => setTokenAddress(e.target.value)}
                      placeholder="0x..."
                    />
                  </div>
                  <div className="mb-1">
                    <label className="form-label">Deposit Token Amount</label>
                    <input
                      type="text"
                      className="form-control"
                      value={depositTokenAmount}
                      onChange={(e) => setDepositTokenAmount(e.target.value)}
                      placeholder="Amount in wei"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>
                    Close
                  </button>
                  {isApproved ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleCreatePool}
                      disabled={!tokenAddressIsValid || !amountIsValid || isWritePending || isConfirming}
                    >
                      {isWritePending || isConfirming ? 'Creating...' : 'Create'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={handleApprove}
                      disabled={!tokenAddressIsValid || !amountIsValid || isWritePending || isConfirming}
                    >
                      {isWritePending || isConfirming ? 'Approving...' : 'Approve'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={() => setShowModal(false)} />
        </>
      )}
    </main>
  )
}

export default PoolManager
