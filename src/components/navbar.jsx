import react from 'react';
import BrandLogo from './homeSections/BrandLogo';
import chevronDown from '../assets/marketsavy/frame7.svg';
import { ConnectKitButton } from 'connectkit';
export default function Navbar() {
  return (
    <nav className="marketsavy-nav navbar navbar-expand-lg">
      <div className="container-fluid px-lg-5 px-3">
        <a className="navbar-brand" href="#top" aria-label="MarketSavy home">
          <BrandLogo />
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#marketsavyNavbar">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="marketsavyNavbar">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-3">
            {['How it works', 'Service', 'Learn', 'Blog', 'About'].map((item) => (
              <li className="nav-item" key={item}>
                <a className="nav-link" href={`#${item.toLowerCase().replaceAll(' ', '-')}`}>{item}</a>
              </li>
            ))}
            <li className="nav-item dropdown">
              <a className="nav-link d-flex align-items-center gap-1" href="#product">
                Product <img className="nav-chevron" src={chevronDown} alt="" />
              </a>
            </li>
          </ul>
          <div className="d-flex gap-2">
            <ConnectKitButton showBalance/>
          </div>
        </div>
      </div>
    </nav>
  );
}