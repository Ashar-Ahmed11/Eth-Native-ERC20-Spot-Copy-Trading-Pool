import cardIcon1 from '../../assets/marketsavy/icon.svg';
import cardIcon2 from '../../assets/marketsavy/icon1.svg';
import cardIcon3 from '../../assets/marketsavy/icon2.svg';
import cardIcon4 from '../../assets/marketsavy/icon3.svg';
import lineAccent from '../../assets/marketsavy/line3.svg';
import readMoreIcon from '../../assets/marketsavy/frame5.svg';

const featureCards = [
  {
    icon: cardIcon1,
    title: 'Transaction Security',
    text: 'The advantage of our service is that it has advanced security systems to guarantee your account.',
  },
  {
    icon: cardIcon2,
    title: 'Lightning Fast Exchange',
    text: 'Make secure purchases and swaps with market data designed for fast decisions.',
  },
  {
    icon: cardIcon3,
    title: 'Support System',
    text: 'For those of you who are the first to use Morry, we also provide a step-by-step tutorial.',
  },
  {
    icon: cardIcon4,
    title: 'Connect Bank Account',
    text: 'You can top up or make transactions to all banks around the world.',
  },
];

function FeatureCard({ icon, title, text }) {
  return (
    <article className="feature-card">
      <div>
        <img className="feature-icon" src={icon} alt="" />
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
      <a href="#learn" className="read-more">
        Read More <img src={readMoreIcon} alt="" />
      </a>
    </article>
  );
}

export default function ConfidenceSection() {
  return (
    <section className="confidence-section section-pad" id="service">
      <div className="container position-relative">
        <img className="section-line" src={lineAccent} alt="" />
        <h2 className="section-title text-center mx-auto">Confidently buy, sell, and exchange cryptocurrencies</h2>
        <div className="row g-4 mt-4">
          {featureCards.map((card) => (
            <div className="col-12 col-md-6 col-xl-3" key={card.title}>
              <FeatureCard {...card} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
