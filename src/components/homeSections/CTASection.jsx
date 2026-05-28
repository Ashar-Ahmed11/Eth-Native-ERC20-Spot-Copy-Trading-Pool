import ctaPrimaryImage from '../../assets/marketsavy/tribalx-cta-cover.png';
import ctaSecondaryImage from '../../assets/marketsavy/tribalx-install-cover.png';

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
              <img className="cta-art-primary" src={ctaPrimaryImage} alt="TribalX copy trading network growth cover" />
              {/* <img className="cta-art-secondary" src={ctaSecondaryImage} alt="TribalX onboarding preview" /> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
