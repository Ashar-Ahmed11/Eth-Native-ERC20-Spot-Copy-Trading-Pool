import appImage from '../../assets/marketsavy/maskGroup.png';

export default function CTASection() {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <h2>Set up in minutes. join us for the latest information</h2>
            <form className="email-form">
              <input type="email" placeholder="Your Email Address" aria-label="Your Email Address" />
              <button type="submit">Submit</button>
            </form>
          </div>
          <div className="col-lg-6">
            <div className="cta-art">
              <img src={appImage} alt="MarketSavy app analytics" />
              <div />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
