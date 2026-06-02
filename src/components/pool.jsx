import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom/cjs/react-router-dom.min'
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { formatEther, parseUnits } from 'viem'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { poolAbi } from '../contracts/pool'
import { erc20Abi } from '../contracts/erc20'
import { useWatchBlockNumber } from 'wagmi'

const shortenAddress = (address = '') => {
  if (!address) return '-'
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const statusLabel = (status) => {
  if (status === 1) return 'Finished'
  return 'Ongoing'
}

const poolStatusLabel = (status) => {
  if (Number(status || 0) === 1) return 'Closed'
  return 'Active'
}

const Pool = () => {
  const { pooladdress } = useParams()
  const connectedaddress = useAccount()
  const [tokenMetaMap, setTokenMetaMap] = useState({})
  const [lastAction, setLastAction] = useState('')
  const [showTradeModal, setShowTradeModal] = useState(false)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showDcaModal, setShowDcaModal] = useState(false)
  const [showSellModal, setShowSellModal] = useState(false)
  const [showClosePoolModal, setShowClosePoolModal] = useState(false)
  const [showExitPoolModal, setShowExitPoolModal] = useState(false)
  const [showTradeTokenDropdown, setShowTradeTokenDropdown] = useState(false)
  const [tradeTokenSearch, setTradeTokenSearch] = useState('')
  const [tradeAmount, setTradeAmount] = useState('')
  const [tradeTokenAddress, setTradeTokenAddress] = useState('')
  const [depositAmount, setDepositAmount] = useState('')
  const [dcaAmount, setDcaAmount] = useState('')
  const [selectedTradeId, setSelectedTradeId] = useState(null)

  const { data: txHash, writeContract, error: writeError, isPending: isWritePending } = useWriteContract()
  const { isSuccess: isConfirmed, isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txHash,
    confirmations: 1
  })

  useWatchBlockNumber({
        onBlockNumber(blockNumber) {
          refetchPoolTokenAmount()
          console.log('New block:', blockNumber)
        }
    })


  const { data: poolId } = useReadContract({
    abi: poolAbi,
    address: pooladdress,
    functionName: 'poolId'
  })

  const { data: poolAdmin } = useReadContract({
    abi: poolAbi,
    address: pooladdress,
    functionName: 'poolAdmin'
  })

  const { data: poolStatus, refetch: refetchPoolStatus } = useReadContract({
    abi: poolAbi,
    address: pooladdress,
    functionName: 'status'
  })

  const { data: poolToken } = useReadContract({
    abi: poolAbi,
    address: pooladdress,
    functionName: 'poolToken'
  })

  const { data: poolTokenAmount,refetch: refetchPoolTokenAmount } = useReadContract({
    abi: poolAbi,
    address: pooladdress,
    functionName: 'poolTokenAmount'
  })
  const { data: userPoolTokenBalance } = useReadContract({
    abi: erc20Abi,
    address: poolToken,
    functionName: 'balanceOf',
    args: [connectedaddress?.address],
    query: {
      enabled: !!poolToken && !!connectedaddress?.address
    }
  })
  const isDepositAmountValid = !!depositAmount && /^\d+$/.test(depositAmount)
  const depositAmountValue = isDepositAmountValid ? parseUnits(depositAmount, 0) : 0n
  const { data: poolAllowance, refetch: refetchAllowance } = useReadContract({
    abi: erc20Abi,
    address: poolToken,
    functionName: 'allowance',
    args: [connectedaddress?.address, pooladdress],
    query: {
      enabled: !!poolToken && !!connectedaddress?.address && isDepositAmountValid
    }
  })

  const { data: membersOfPools, refetch: refetchMembers } = useReadContract({
    abi: poolAbi,
    address: pooladdress,
    functionName: 'membersOfPools'
  })

  const { data: tradeTokens } = useReadContract({
    abi: poolAbi,
    address: pooladdress,
    functionName: 'tradeTokens'
  })

  const { data: allTrades, isPending: isTradesLoading, refetch: refetchTrades } = useReadContract({
    abi: poolAbi,
    address: pooladdress,
    functionName: 'getAllTrades'
  })

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
    if (showTradeModal) return
    setShowTradeTokenDropdown(false)
    setTradeTokenSearch('')
  }, [showTradeModal])

  useEffect(() => {
    if (!writeError) return
    toast.error(writeError.shortMessage || writeError.message || 'Transaction failed')
  }, [writeError])

  useEffect(() => {
    if (!isConfirmed) return
    if (lastAction === 'trade') {
      toast.success('Trade created successfully')
      setShowTradeModal(false)
      setTradeAmount('')
      setTradeTokenAddress('')
    }
    if (lastAction === 'deposit') {
      toast.success('Deposit successful')
      setShowDepositModal(false)
      setDepositAmount('')
    }
    if (lastAction === 'approveDeposit') {
      toast.success('Deposit amount approved')
      refetchAllowance()
    }
    if (lastAction === 'dca') {
      toast.success('DCA executed successfully')
      setShowDcaModal(false)
      setDcaAmount('')
      setSelectedTradeId(null)
    }
    if (lastAction === 'sell') {
      toast.success('Trade closed successfully')
      setShowSellModal(false)
      setSelectedTradeId(null)
    }
    if (lastAction === 'closePool') {
      toast.success('Pool closed successfully')
      setShowClosePoolModal(false)
    }
    if (lastAction === 'exitPool') {
      toast.success('You exited the pool successfully')
      setShowExitPoolModal(false)
    }
    refetchPoolStatus()
    refetchMembers()
    refetchPoolTokenAmount()
    refetchTrades()
  }, [isConfirmed, lastAction, refetchTrades, refetchAllowance, refetchPoolStatus, refetchMembers, refetchPoolTokenAmount])

  const poolTokenMeta = poolToken ? tokenMetaMap[poolToken.toLowerCase()] : null
  const isPoolAdmin = !!connectedaddress?.address && !!poolAdmin && connectedaddress.address.toLowerCase() === poolAdmin.toLowerCase()
  const isPoolClosed = Number(poolStatus || 0) === 1
  const tokenOptions = Object.values(tokenMetaMap).sort((a, b) => {
    const left = (a.symbol || a.name || '').toLowerCase()
    const right = (b.symbol || b.name || '').toLowerCase()
    return left.localeCompare(right)
  })
  const filteredTradeTokens = tokenOptions.filter((token) => {
    if (!tradeTokenSearch.trim()) return true
    const query = tradeTokenSearch.toLowerCase()
    return (
      token.symbol?.toLowerCase().includes(query) ||
      token.name?.toLowerCase().includes(query) ||
      token.address?.toLowerCase().includes(query)
    )
  })
  const selectedTradeTokenMeta = tradeTokenAddress ? tokenMetaMap[tradeTokenAddress.toLowerCase()] : null
  // console.log("get all trades data", allTrades);
  const handleTrade = () => {
    if (!tradeAmount || !tradeTokenAddress) return
    setLastAction('trade')
    writeContract({
      abi: poolAbi,
      address: pooladdress,
      functionName: 'trade',
      args: [tradeTokenAddress, parseUnits(tradeAmount, 0)]
    })
  }

  const handleDeposit = () => {
    if (!depositAmount) return
    setLastAction('deposit')
    writeContract({
      abi: poolAbi,
      address: pooladdress,
      functionName: 'depositToken',
      args: [parseUnits(depositAmount, 0)]
    })
  }

  const handleApproveDeposit = () => {
    if (!isDepositAmountValid) return
    setLastAction('approveDeposit')
    writeContract({
      abi: erc20Abi,
      address: poolToken,
      functionName: 'approve',
      args: [pooladdress, depositAmountValue]
    })
  }

  const handleDca = () => {
    if (!dcaAmount || selectedTradeId === null) return
    setLastAction('dca')
    writeContract({
      abi: poolAbi,
      address: pooladdress,
      functionName: 'dca',
      args: [parseUnits(String(selectedTradeId), 0), parseUnits(dcaAmount, 0)]
    })
  }

  const handleSell = () => {
    if (selectedTradeId === null) return
    setLastAction('sell')
    writeContract({
      abi: poolAbi,
      address: pooladdress,
      functionName: 'sellToken',
      args: [parseUnits(String(selectedTradeId), 0)]
    })
  }

  const handleClosePool = () => {
    setLastAction('closePool')
    writeContract({
      abi: poolAbi,
      address: pooladdress,
      functionName: 'endPool'
    })
  }

  const handleExitPool = () => {
    setLastAction('exitPool')
    writeContract({
      abi: poolAbi,
      address: pooladdress,
      functionName: 'memberExitPool'
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

  const totalTradeBalance = (allTrades || []).reduce((acc, trade) => acc + (trade?.tokenTotalBalance || 0n), 0n)
  const ongoingTrades = (allTrades || []).filter((trade) => trade?.tradeStatus === 0).length
  const poolAvailableBalance = poolTokenAmount || 0n
  const userAvailableBalance = userPoolTokenBalance || 0n
  const isDepositApproved = isDepositAmountValid && (poolAllowance || 0n) >= depositAmountValue

  return (
    <main className="container py-4 pool-page">
      <ToastContainer position="top-right" autoClose={4000} />
      <div className="d-flex align-items-start justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h1 className="pool-title mb-1">Pool Details</h1>
          <p className="pool-subtitle mb-0">Monitor pool stats and trades</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          {!isPoolClosed && isPoolAdmin && (
            <>
              <button className="btn btn-primary px-4 py-2" onClick={() => setShowTradeModal(true)}>Trade</button>
              <button className="btn btn-outline-primary px-4 py-2" onClick={() => setShowDepositModal(true)}>Deposit</button>
              <button className="btn btn-outline-danger px-4 py-2" onClick={() => setShowClosePoolModal(true)}>Close Pool</button>
            </>
          )}
          {!isPoolClosed && !isPoolAdmin && (
            <>
              <button className="btn btn-outline-primary px-4 py-2" onClick={() => setShowDepositModal(true)}>Deposit</button>
              <button className="btn btn-outline-danger px-4 py-2" onClick={() => setShowExitPoolModal(true)}>Exit</button>
            </>
          )}
          <Link className="btn btn-outline-primary px-4 py-2" to="/pool-manager">Back to Pools</Link>
        </div>
      </div>

      <div className="card pool-item-card mb-4">
        <div className="card-body p-4">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3">
              {poolTokenMeta?.logoURI ? (
                <img
                  src={poolTokenMeta.logoURI}
                  alt={poolTokenMeta.symbol || 'token'}
                  width="56"
                  height="56"
                  className="rounded-circle border"
                />
              ) : (
                <div className="rounded-circle border d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                  <span className="small text-muted">?</span>
                </div>
              )}
              <div>
                <h4 className="mb-1">{poolTokenMeta?.symbol || 'Pool Token'}</h4>
                <p className="pool-meta-label mb-0">{poolTokenMeta?.name || shortenAddress(poolToken)}</p>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <span className={`badge px-3 py-2 ${isPoolClosed ? 'bg-secondary-subtle text-secondary-emphasis' : 'bg-success-subtle text-success-emphasis'}`}>
                {poolStatusLabel(poolStatus)}
              </span>
              <span className="badge text-bg-light text-primary px-3 py-2">Pool #{poolId?.toString() || '0'}</span>
            </div>
          </div>
          <div className="row g-3 pt-4">
            <div className="col-12 col-md-4">
              <p className="pool-meta-label mb-1">Pool Address</p>
              <p className="pool-address mb-0 d-flex align-items-center gap-2 flex-wrap">
                <span>{shortenAddress(pooladdress)}</span>
                <button type="button" className="btn pool-copy-btn" onClick={() => handleCopy(pooladdress)} title="Copy pool address">
                  Copy
                </button>
              </p>
            </div>
            <div className="col-12 col-md-4">
              <p className="pool-meta-label mb-1">Pool Admin</p>
              <p className="pool-address mb-0 d-flex align-items-center gap-2 flex-wrap">
                <span>{shortenAddress(poolAdmin)}</span>
                <button type="button" className="btn pool-copy-btn" onClick={() => handleCopy(poolAdmin)} title="Copy pool admin">
                  Copy
                </button>
              </p>
            </div>
            <div className="col-12 col-md-4">
              <p className="pool-meta-label mb-1">Pool Token</p>
              <p className="pool-address mb-0 d-flex align-items-center gap-2 flex-wrap">
                <span>{shortenAddress(poolToken)}</span>
                <button type="button" className="btn pool-copy-btn" onClick={() => handleCopy(poolToken)} title="Copy pool token">
                  Copy
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-xl-3">
          <div className="pool-stat-card">
            <p className="pool-stat-label mb-1">Pool Liquidity</p>
            <h3 className="pool-stat-value mb-1">{Number(formatEther(poolTokenAmount || 0n)).toFixed(2)}</h3>
            <p className="pool-stat-note mb-0">{poolTokenMeta?.symbol || 'Token units'}</p>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <div className="pool-stat-card">
            <p className="pool-stat-label mb-1">Pool Members</p>
            <h3 className="pool-stat-value mb-1">{membersOfPools?.toString() || '0'}</h3>
            <p className="pool-stat-note mb-0">Total participants</p>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <div className="pool-stat-card">
            <p className="pool-stat-label mb-1">Total Trades</p>
            <h3 className="pool-stat-value mb-1">{tradeTokens?.toString() || '0'}</h3>
            <p className="pool-stat-note mb-0">Contract counter</p>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <div className="pool-stat-card">
            <p className="pool-stat-label mb-1">Ongoing Trades</p>
            <h3 className="pool-stat-value mb-1">{ongoingTrades}</h3>
            <p className="pool-stat-note mb-0">Open positions</p>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="pool-section-title mb-0">Trades ({allTrades?.length || 0})</h3>
        <p className="pool-meta-label mb-0">Total trade token balance: {Number(formatEther(totalTradeBalance)).toFixed(2)}</p>
      </div>

      {isTradesLoading && <p className="text-muted">Loading trades...</p>}
      {!isTradesLoading && (!allTrades || allTrades.length === 0) && (
        <p className="text-muted">No trades available for this pool.</p>
      )}

      <div className="row g-3">
        {(allTrades || []).map((trade, index) => {
          const tradeTokenMeta = tokenMetaMap[trade.tokenAddress?.toLowerCase()]
          return (
            <div className="col-12 col-lg-6" key={`${trade.tokenAddress}-${index}`}>
              <div className="card h-100 pool-item-card">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center gap-3">
                      {tradeTokenMeta?.logoURI ? (
                        <img
                          src={tradeTokenMeta.logoURI}
                          alt={tradeTokenMeta.symbol || 'token'}
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
                        <h5 className="mb-1">{tradeTokenMeta?.symbol || shortenAddress(trade.tokenAddress)}</h5>
                        <p className="pool-meta-label mb-0">{tradeTokenMeta?.name || 'Unknown Token'}</p>
                      </div>
                    </div>
                    <span className={`badge px-3 py-2 ${trade.tradeStatus === 0 ? 'bg-success-subtle text-success-emphasis' : 'bg-secondary-subtle text-secondary-emphasis'}`}>
                      {statusLabel(trade.tradeStatus)}
                    </span>
                  </div>
                  <div className="row g-3">
                    <div className="col-6">
                      <p className="pool-meta-label mb-1">Token Balance</p>
                      <p className="pool-meta-value mb-0">{Number(formatEther(trade.tokenTotalBalance || 0n)).toFixed(4)}</p>
                    </div>
                    <div className="col-6">
                      <p className="pool-meta-label mb-1">Entry Price</p>
                      <p className="pool-meta-value mb-0">{Number(formatEther(trade.tokenEntryPrice || 0n)).toFixed(8)}</p>
                    </div>
                    <div className="col-6">
                      <p className="pool-meta-label mb-1">Exit Price</p>
                      <p className="pool-meta-value mb-0">{Number(formatEther(trade.tokenExitPrice || 0n)).toFixed(8)}</p>
                    </div>
                    <div className="col-6">
                      <p className="pool-meta-label mb-1">Token Address</p>
                      <p className="pool-address mb-0 d-flex align-items-center gap-2 flex-wrap">
                        <span>{shortenAddress(trade.tokenAddress)}</span>
                        <button type="button" className="btn pool-copy-btn" onClick={() => handleCopy(trade.tokenAddress)} title="Copy trade token">
                          Copy
                        </button>
                      </p>
                    </div>
                  </div>
                  {isPoolAdmin && !isPoolClosed && trade.tradeStatus === 0 && (
                    <div className="pool-trade-actions mt-4 pt-3 border-top">
                      <button
                        className="btn pool-action-btn pool-action-btn-dca"
                        onClick={() => {
                          setSelectedTradeId(index + 1)
                          setShowDcaModal(true)
                        }}
                      >
                        DCA
                      </button>
                      <button
                        className="btn pool-action-btn pool-action-btn-sell"
                        onClick={() => {
                          setSelectedTradeId(index + 1)
                          setShowSellModal(true)
                        }}
                      >
                        Sell
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {showTradeModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Create Trade</h5>
                  <button type="button" className="btn-close" onClick={() => setShowTradeModal(false)} />
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Trade Token</label>
                    <div className="position-relative">
                      <button
                        type="button"
                        className="form-select text-start pool-token-dropdown-toggle"
                        onClick={() => setShowTradeTokenDropdown((prev) => !prev)}
                      >
                        {selectedTradeTokenMeta ? (
                          <span className="d-flex align-items-center gap-2">
                            {selectedTradeTokenMeta.logoURI ? (
                              <img
                                src={selectedTradeTokenMeta.logoURI}
                                alt={selectedTradeTokenMeta.symbol || 'token'}
                                width="24"
                                height="24"
                                className="rounded-circle border"
                              />
                            ) : (
                              <span className="token-picker-avatar" />
                            )}
                            <span>
                              <span className="d-block">{selectedTradeTokenMeta.symbol || shortenAddress(tradeTokenAddress)}</span>
                              <small className="d-block text-muted">{selectedTradeTokenMeta.name || tradeTokenAddress}</small>
                            </span>
                          </span>
                        ) : (
                          <span className="text-muted">Select a token</span>
                        )}
                        <span className={`pool-token-dropdown-arrow ${showTradeTokenDropdown ? 'open' : ''}`} aria-hidden="true" />
                      </button>
                      {showTradeTokenDropdown && (
                        <div className="token-picker-menu shadow">
                          <div className="p-2 border-bottom">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Search symbols, names, or addresses"
                              value={tradeTokenSearch}
                              onChange={(e) => setTradeTokenSearch(e.target.value)}
                            />
                          </div>
                          <div className="token-picker-list">
                            {filteredTradeTokens.map((token) => (
                              <button
                                key={token.address}
                                type="button"
                                className={`token-picker-item ${tradeTokenAddress?.toLowerCase() === token.address.toLowerCase() ? 'active' : ''}`}
                                onClick={() => {
                                  setTradeTokenAddress(token.address)
                                  setShowTradeTokenDropdown(false)
                                  setTradeTokenSearch('')
                                }}
                              >
                                {token.logoURI ? (
                                  <img src={token.logoURI} alt={token.symbol || 'token'} width="28" height="28" className="rounded-circle border" />
                                ) : (
                                  <span className="token-picker-avatar" />
                                )}
                                <span className="token-picker-text">
                                  <span className="token-picker-symbol">{token.symbol || 'Unknown'}</span>
                                  <span className="token-picker-name">{token.name || token.address}</span>
                                </span>
                              </button>
                            ))}
                            {filteredTradeTokens.length === 0 && (
                              <div className="p-3 text-muted small">No matching tokens found.</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mb-1">
                    <label className="form-label">Trade Amount</label>
                    <input className="form-control" value={tradeAmount} onChange={(e) => setTradeAmount(e.target.value)} placeholder="Amount in wei" />
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <small className="text-muted">Available pool balance: {poolAvailableBalance.toString()}</small>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setTradeAmount(poolAvailableBalance.toString())}
                      >
                        Max
                      </button>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowTradeModal(false)}>Close</button>
                  <button type="button" className="btn btn-primary" onClick={handleTrade} disabled={isWritePending || isConfirming}>
                    {isWritePending || isConfirming ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={() => setShowTradeModal(false)} />
        </>
      )}

      {showDepositModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Deposit Token</h5>
                  <button type="button" className="btn-close" onClick={() => setShowDepositModal(false)} />
                </div>
                <div className="modal-body">
                  <div className="mb-1">
                    <label className="form-label">Deposit Token Amount</label>
                    <input className="form-control" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} placeholder="Amount in wei" />
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <small className="text-muted">Your token balance: {userAvailableBalance.toString()}</small>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setDepositAmount(userAvailableBalance.toString())}
                      >
                        Max
                      </button>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowDepositModal(false)}>Close</button>
                  {isDepositApproved ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleDeposit}
                      disabled={!isDepositAmountValid || isWritePending || isConfirming}
                    >
                      {isWritePending || isConfirming ? 'Depositing...' : 'Deposit'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={handleApproveDeposit}
                      disabled={!isDepositAmountValid || isWritePending || isConfirming}
                    >
                      {isWritePending || isConfirming ? 'Approving...' : 'Approve'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={() => setShowDepositModal(false)} />
        </>
      )}

      {showClosePoolModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Close Pool</h5>
                  <button type="button" className="btn-close" onClick={() => setShowClosePoolModal(false)} />
                </div>
                <div className="modal-body">
                  <p className="mb-2">Are you sure you want to proceed?</p>
                  <p className="text-muted mb-0">Performing this action will result in the withdrawal of all tokens for all users and the pool will not be accessible anymore.</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowClosePoolModal(false)}>Cancel</button>
                  <button type="button" className="btn btn-danger" onClick={handleClosePool} disabled={isWritePending || isConfirming}>
                    {isWritePending || isConfirming ? 'Closing...' : 'Close'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={() => setShowClosePoolModal(false)} />
        </>
      )}

      {showExitPoolModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Exit Pool</h5>
                  <button type="button" className="btn-close" onClick={() => setShowExitPoolModal(false)} />
                </div>
                <div className="modal-body">
                  <p className="mb-2">Are you sure you want to proceed?</p>
                  <p className="text-muted mb-0">Exiting the pool will withdraw your balances from the pool and remove your access as a member.</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowExitPoolModal(false)}>Cancel</button>
                  <button type="button" className="btn btn-danger" onClick={handleExitPool} disabled={isWritePending || isConfirming}>
                    {isWritePending || isConfirming ? 'Exiting...' : 'Exit'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={() => setShowExitPoolModal(false)} />
        </>
      )}

      {showDcaModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Dollar Cost Average</h5>
                  <button type="button" className="btn-close" onClick={() => setShowDcaModal(false)} />
                </div>
                <div className="modal-body">
                  <div className="mb-1">
                    <label className="form-label">Trade Amount</label>
                    <input className="form-control" value={dcaAmount} onChange={(e) => setDcaAmount(e.target.value)} placeholder="Amount in wei" />
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <small className="text-muted">Available pool balance: {poolAvailableBalance.toString()}</small>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setDcaAmount(poolAvailableBalance.toString())}
                      >
                        Max
                      </button>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowDcaModal(false)}>Close</button>
                  <button type="button" className="btn btn-primary" onClick={handleDca} disabled={isWritePending || isConfirming}>
                    {isWritePending || isConfirming ? 'Submitting...' : 'Create'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={() => setShowDcaModal(false)} />
        </>
      )}

      {showSellModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Close Trade</h5>
                  <button type="button" className="btn-close" onClick={() => setShowSellModal(false)} />
                </div>
                <div className="modal-body">
                  <p className="mb-0">Are you sure you want to close the trade?</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowSellModal(false)}>Cancel</button>
                  <button type="button" className="btn btn-danger" onClick={handleSell} disabled={isWritePending || isConfirming}>
                    {isWritePending || isConfirming ? 'Closing...' : 'Confirm'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={() => setShowSellModal(false)} />
        </>
      )}
    </main>
  )
}

export default Pool
