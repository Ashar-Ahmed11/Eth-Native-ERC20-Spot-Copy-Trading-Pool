import texture from '../../assets/marketsavy/texture.svg';
import tealLine from '../../assets/marketsavy/line1.svg';
import orangeLine from '../../assets/marketsavy/line.svg';

function PhoneFrame({ variant, children, label }) {
  return (
    <div className={`platform-phone platform-phone-${variant}`} role="img" aria-label={label}>
      <div className="phone-speaker" />
      <div className="phone-screen">
        {children}
      </div>
    </div>
  );
}

function StatisticScreen() {
  return (
    <>
      <div className="phone-status">9:41 <span /></div>
      <div className="phone-title">Statistic</div>
      <div className="stat-coin-row">
        <span className="btc-dot">B</span>
        <div>
          <strong>Bitcoin BTC/USDT</strong>
          <small>Today up to <span>+5.34%</span></small>
        </div>
      </div>
      <div className="stat-tabs">
        <span>5m</span>
        <span className="active">20m</span>
        <span>35m</span>
        <span>50m</span>
      </div>
      <div className="candles">
        <span className="up one" />
        <span className="down two" />
        <span className="up three" />
        <span className="up four" />
        <span className="down five" />
      </div>
    </>
  );
}

function CrystalScreen() {
  return (
    <>
      <div className="phone-status">9:41 <span /></div>
      <div className="spark spark-one">+</div>
      <div className="spark spark-two">+</div>
      <div className="spark spark-three">+</div>
      <div className="crystal">
        <span />
        <span />
        <span />
      </div>
      <div className="center-caption">Everyone can invest</div>
    </>
  );
}

function DashboardScreen() {
  return (
    <>
      <div className="phone-status">9:41 <span /></div>
      <div className="dashboard-top">
        <strong>Dashboard</strong>
        <span>⌕</span>
      </div>
      <div className="balance-card">
        <small>Total Balance</small>
        <strong>$19,243 <span>+0.8%</span></strong>
      </div>
      <div className="quick-actions">
        <span>Scan</span>
        <span>Receive</span>
        <span>Gift</span>
      </div>
      <div className="dashboard-list">
        <span />
        <span />
        <span />
      </div>
    </>
  );
}

export default function PlatformSection() {
  return (
    <section className="platform-section text-center" id="product">
      <img className="platform-texture" src={texture} alt="" />
      <div className="container position-relative">
        <h2>One Platform Application to Invest in Crypto</h2>
        <p>Investing in cryptocurrencies is increasingly straightforward and easier. Find your preferred currencies with our assistance.</p>
        <div className="platform-phone-stage mx-auto">
          <img className="platform-scribble platform-scribble-left" src={tealLine} alt="" />
          <img className="platform-scribble platform-scribble-right" src={orangeLine} alt="" />
          <PhoneFrame variant="left" label="Statistic mobile trading screen">
            <StatisticScreen />
          </PhoneFrame>
          <PhoneFrame variant="right" label="Dashboard mobile wallet screen">
            <DashboardScreen />
          </PhoneFrame>
          <PhoneFrame variant="center" label="Main crypto investment mobile screen">
            <CrystalScreen />
          </PhoneFrame>
        </div>
      </div>
    </section>
  );
}
