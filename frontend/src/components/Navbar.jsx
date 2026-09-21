import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">TradeX</Link>
        <span>Virtual Trading Platform</span>
      </div>

      <div className="navbar-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/portfolio">Portfolio</Link>
        <Link to="/transactions">Transactions</Link>
      </div>

      <Link to="/profile" className="navbar-user">
        Ashwini
      </Link>
    </nav>
  );
}

export default Navbar;