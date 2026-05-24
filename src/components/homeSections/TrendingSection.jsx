import bitcoinLogo from '../../assets/marketsavy/logo2.svg';
import ethLogo from '../../assets/marketsavy/eth.svg';
import xrpLogo from '../../assets/marketsavy/xrp.svg';
import dogecoinLogo from '../../assets/marketsavy/dogecoin.svg';
import adaLogo from '../../assets/marketsavy/ada.svg';
import polygonLogo from '../../assets/marketsavy/polygon.svg';
import solLogo from '../../assets/marketsavy/sol.svg';
import chartUp from '../../assets/marketsavy/chart.svg';
import chartDown from '../../assets/marketsavy/chart1.svg';

const cryptoCards = [
  { icon: bitcoinLogo, name: 'Bitcoin', pair: 'BTC/USD', price: '$36,402.80', change: '+2.51%', up: true },
  { icon: ethLogo, name: 'Ethereum', pair: 'ETH/USD', price: '$1,812.24', change: '-0.28%', up: false },
  { icon: xrpLogo, name: 'XRP', pair: 'XRP/USD', price: '$0.53', change: '+1.36%', up: true },
  { icon: dogecoinLogo, name: 'Dogecoin', pair: 'DOGE/USD', price: '$0.083', change: '-0.42%', up: false },
  { icon: adaLogo, name: 'Cardano', pair: 'ADA/USD', price: '$0.39', change: '+0.94%', up: true },
  { icon: polygonLogo, name: 'Polygon', pair: 'MATIC/USD', price: '$0.72', change: '+1.72%', up: true },
  { icon: solLogo, name: 'Solana', pair: 'SOL/USD', price: '$24.18', change: '-1.16%', up: false },
];

export default function TrendingSection() {
  return (
    <section className="trending-section section-pad">
      <div className="container-fluid px-0">
        <div className="container text-center">
          <h2>Community crypto trending</h2>
          <p>Markets you can watch, compare, and follow with the latest crypto market insights.</p>
        </div>
        <div className="crypto-card-row mt-4">
          {cryptoCards.map((coin) => (
            <article className="crypto-card" key={coin.name}>
              <div className="d-flex align-items-center justify-content-between">
                <span className="coin-name"><img src={coin.icon} alt="" /> {coin.name}</span>
                <span className={coin.up ? 'text-positive' : 'text-negative'}>{coin.change}</span>
              </div>
              <div className="coin-price">{coin.price}</div>
              <div className="coin-pair">{coin.pair}</div>
              <img className="coin-chart" src={coin.up ? chartUp : chartDown} alt="" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
