import brandMark from '../../assets/marketsavy/group80.svg';
import brandWord from '../../assets/marketsavy/marketSavy1.svg';
import footerMark from '../../assets/marketsavy/group79.svg';
import footerWord from '../../assets/marketsavy/marketSavy.svg';

export default function BrandLogo({ footer = false }) {
  return (
    <div className="brand-logo d-inline-flex align-items-center">
      <span className="brand-mark">
        <img src={footer ? footerMark : brandMark} alt="" />
      </span>
      {/* <img className="brand-word" src={footer ? footerWord : brandWord} alt="MarketSavy" /> */}
      <span className='fw-bold'>TribalX</span>
    </div>
  );
}
