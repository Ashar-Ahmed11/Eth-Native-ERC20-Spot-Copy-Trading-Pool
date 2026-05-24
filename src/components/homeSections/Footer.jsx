import BrandLogo from './BrandLogo';

const columns = [
  ['General', 'Service', 'Market', 'Community', 'Blog', 'About'],
  ['Product', 'Chart', 'Sparks', 'Snaps', 'Newsflow', 'Trading Views', 'Courses'],
  ['Community', 'Streams', 'Ideas', 'Chat', 'House Rules'],
  ['Bussines', 'Partner', 'Collaboration', 'Program', 'Solutions', 'Widgets'],
  ['Information', 'API', 'Terms and Conditions', 'Privacy Policy'],
];

export default function Footer() {
  return (
    <footer className="marketsavy-footer">
      <div className="container">
        <div className="row g-5">
          <div className="col-lg-4">
            <BrandLogo footer />
            <p className="footer-copy">Since then, the company has grown organically to. Marketsavy is the world's largest trading platform, with $12 billion worth of currency trading and 500,000 tickets sold daily to tens of thousands of traders worldwide.</p>
          </div>
          <div className="col-lg-8">
            <div className="footer-grid">
              {columns.map(([title, ...items]) => (
                <div key={title}>
                  <h3>{title}</h3>
                  {items.map((item) => <a href="#top" key={item}>{item}</a>)}
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="copyright">Marketsavy © 2021-2022, All Rights Reserved</p>
      </div>
    </footer>
  );
}
