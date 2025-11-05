// components/Navbar.tsx
"use client";

import styles from "../styles/Navbarauthority.module.css";
import WalletConnect from "./ConnectWalletButton";

const Navbar: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <a href="/">CRX Authority</a>
      </div>
      <ul className={styles.navLinks}>
        <li>
          <button onClick={() => scrollToSection("dashboard")}>Request</button>
        </li>
        <li>
          <button onClick={() => scrollToSection("mint")}>Mint</button>
        </li>
       
      </ul>
      <WalletConnect />
    </nav>
  );
};

export default Navbar;
