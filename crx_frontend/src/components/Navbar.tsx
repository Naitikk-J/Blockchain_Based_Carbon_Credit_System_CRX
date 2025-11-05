"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../styles/Navbar.module.css';

const Navbar = () => {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/requests', label: 'Requests' },
    { href: '/profile', label: 'Profile' },
    { href: '/dashboard/user', label: 'Dashboard' },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">CRX</Link>
      </div>
      <div className={styles.navLinks}>
        {navLinks.map(link => (
          <Link key={link.href} href={link.href} className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}>
              {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
