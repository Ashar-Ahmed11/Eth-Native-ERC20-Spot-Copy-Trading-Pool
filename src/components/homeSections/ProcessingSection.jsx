import appImage from '../../assets/marketsavy/tribalx-processing-cover.png';
import arrowUpIcon from '../../assets/marketsavy/arrowRightUp.svg';

const links = ['Market Overview', 'Latest News', 'Payment & Payouts', 'Income', 'Converter'];

export default function ProcessingSection() {
  return (
    <section className="processing-section section-pad" id="how-it-works">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-5">
            <h2>Infrastructure for bitcoin processing securely in your company</h2>
            <div className="processing-list mt-4">
              {links.map((item) => (
                <a href="#product" key={item}>
                  <span>{item}</span>
                  <img src={arrowUpIcon} alt="" />
                </a>
              ))}
            </div>
          </div>
          <div className="col-lg-7">
            <div className="">
              <img src={appImage} className="card-img-top rounded-5" style={{opacity:"85%"}} alt="Crypto exchange analytics dashboard" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
