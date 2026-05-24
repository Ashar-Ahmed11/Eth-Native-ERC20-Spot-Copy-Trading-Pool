import coinBtc from '../../assets/marketsavy/logo.svg';
import chartUp from '../../assets/marketsavy/chart.svg';

function TradeTicket() {
  return (
    <div className="trade-ticket">
      <div className="d-flex align-items-center justify-content-between">
        <strong>Open New Position</strong>
        <span>...</span>
      </div>
     <div className="d-flex align-items-center justify-content-between w-100 gap-2">
  <img
    src={coinBtc}
    alt=""
    style={{ width: "40px", height: "40px", objectFit: "contain" }}
  />

  <div className="flex-grow-1">
    <strong className="d-block">Bitcoin/USD</strong>
    <small>
      Today up to <span>+5.34%</span>
    </small>
  </div>

  <img
    src={chartUp}
    alt=""
    style={{ width: "80px", height: "40px", objectFit: "contain" }}
  />
</div>
      <div className="ticket-switch"><span>Buy</span><span>Sell</span></div>
      <label>Ammount</label>
      <div className="ticket-input">$ 25,000.00</div>
      <label>Price</label>
      <div className="ticket-input">36,482.32 USD</div>
      <button type="button">Buy Now</button>
    </div>
  );
}

export default function InstallSection() {
  return (
    <section className="install-section section-pad" id="learn">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-5">
            <h2>Installation of a crypto role is now simpler.</h2>
            <p>After we have created an account, you can set up your wallet with the crypto assets that matter most.</p>
            <button className="btn btn-primary">Explore Now</button>
          </div>
          <div className="col-lg-7">
            <div className="install-visual">
              <TradeTicket />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
