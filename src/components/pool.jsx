import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom/cjs/react-router-dom.min'
import { useReadContract } from 'wagmi'
import { formatEther } from 'viem'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { poolAbi } from '../contracts/pool'

const shortenAddress = (address = '') => {
  if (!address) return '-'
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const statusLabel = (status) => {
  if (status === 1) return 'Finished'
  return 'Ongoing'
}

const Pool = () => {
  const { pooladdress } = useParams()
  const [tokenMetaMap, setTokenMetaMap] = useState({})

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

  const { data: poolToken } = useReadContract({
    abi: poolAbi,
    address: pooladdress,
    functionName: 'poolToken'
  })

  const { data: poolTokenAmount } = useReadContract({
    abi: poolAbi,
    address: pooladdress,
    functionName: 'poolTokenAmount'
  })

  const { data: membersOfPools } = useReadContract({
    abi: poolAbi,
    address: pooladdress,
    functionName: 'membersOfPools'
  })

  const { data: tradeTokens } = useReadContract({
    abi: poolAbi,
    address: pooladdress,
    functionName: 'tradeTokens'
  })

  const { data: allTrades, isPending: isTradesLoading } = useReadContract({
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

  const poolTokenMeta = poolToken ? tokenMetaMap[poolToken.toLowerCase()] : null

  const totalTradeBalance = (allTrades || []).reduce((acc, trade) => acc + (trade?.tokenTotalBalance || 0n), 0n)
  const ongoingTrades = (allTrades || []).filter((trade) => trade?.tradeStatus === 0).length

  return (
    <main className="container py-4 pool-page">
      <ToastContainer position="top-right" autoClose={4000} />
      <div className="d-flex align-items-start justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h1 className="pool-title mb-1">Pool Details</h1>
          <p className="pool-subtitle mb-0">Monitor pool stats and trades</p>
        </div>
        <Link className="btn btn-outline-primary px-4 py-2" to="/pool-manager">Back to Pools</Link>
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
            <span className="badge text-bg-light text-primary px-3 py-2">Pool #{poolId?.toString() || '0'}</span>
          </div>
          <div className="row g-3 pt-4">
            <div className="col-12 col-md-4">
              <p className="pool-meta-label mb-1">Pool Address</p>
              <p className="pool-address mb-0">{shortenAddress(pooladdress)}</p>
            </div>
            <div className="col-12 col-md-4">
              <p className="pool-meta-label mb-1">Pool Admin</p>
              <p className="pool-address mb-0">{shortenAddress(poolAdmin)}</p>
            </div>
            <div className="col-12 col-md-4">
              <p className="pool-meta-label mb-1">Pool Token</p>
              <p className="pool-address mb-0">{shortenAddress(poolToken)}</p>
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
                      <p className="pool-address mb-0">{shortenAddress(trade.tokenAddress)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}

export default Pool
