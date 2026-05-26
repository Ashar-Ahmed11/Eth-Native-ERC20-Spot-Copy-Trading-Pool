import BrandLogo from './BrandLogo';
import heroElements from '../../assets/marketsavy/elements.svg';
import verifiedIcon from '../../assets/marketsavy/frame6.svg';
import spiral from '../../assets/marketsavy/spiral.svg';
import chevronDown from '../../assets/marketsavy/frame7.svg';
import bitcoinLogo from '../../assets/marketsavy/logo2.svg';
import ethLogo from '../../assets/marketsavy/eth.svg';
import lunaLogo from '../../assets/marketsavy/luna.svg';
import tetherLogo from '../../assets/marketsavy/tether.svg';
import uniswapLogo from '../../assets/marketsavy/uniswap.svg';
import dogeLogo from '../../assets/marketsavy/doge.svg';
import appImage from '../../assets/marketsavy/maskGroup.png';

const tickerItems = [
  { icon: ethLogo, name: 'Ethereum', value: '757.36 USD', change: '+0.35%', up: true },
  { icon: bitcoinLogo, name: 'Bitcoin', value: '993.32 USD', change: '-0.11%', up: false },
  { icon: lunaLogo, name: 'LUNA', value: '351.73 USD', change: '+0.15%', up: true },
  { icon: tetherLogo, name: 'Tether', value: '216.92 USD', change: '+1.35%', up: true },
  { icon: uniswapLogo, name: 'Uniswap', value: '579.25 USD', change: '-2.62%', up: false },
  { icon: dogeLogo, name: 'Dogecoin', value: '831.36 USD', change: '+1.14%', up: true },
];



function StoreBadge({ label }) {
  return (
    <button className="store-badge" type="button">
      <span className="store-icon" />
      <span>{label}</span>
    </button>
  );
}

function CryptoTicker() {
  return (
    <div className="crypto-ticker">
      <div className="ticker-track">
        {[...tickerItems, ...tickerItems].map((item, index) => (
          <div className="ticker-item" key={`${item.name}-${index}`}>
            <span className="ticker-title">
              <img src={item.icon} alt="" />
              {item.name}
            </span>
            <span>{item.value}</span>
            <span className={item.up ? 'text-positive' : 'text-negative'}>{item.change}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="hero-section" id="top">
      
      <img className="hero-elements" src={heroElements} alt="" />
      <div className="container position-relative">
        <div className="hero-copy mx-auto text-center">
          <div className="trust-pill">
            <img src={verifiedIcon} alt="" />
            <span>The number one trusted platform in the world</span>
          </div>
          <h1>
            Create your first <em>cryptocurrency</em> wallet right now!
          </h1>
          <img className="spiral-accent" src={spiral} alt="" />
          <p>Trade with confidence and develop your future with the world's fastest crypto exchange.</p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <StoreBadge label="App Store" />
            <StoreBadge label="Google Play" />
          </div>
        </div>
        <div className="hero-preview mx-auto">
          <img src={appImage} alt="MarketSavy trading dashboard preview" />
        </div>
      </div>
      <CryptoTicker />
    </section>
  );
}
