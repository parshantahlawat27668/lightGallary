import React from 'react'
import styles from "./Footer.module.css"
const Footer = () => {
  return (
     <footer className={styles.footer}>
      <div className={styles.container}>

        <div className={styles.column}>
          <h2 className={styles.logo}>LightGallery</h2>
          <p className={styles.description}>
            Brightening Homes, Illuminating Lives. Discover premium lighting solutions for every space.
          </p>
        </div>

        <div className={styles.column}>
          <h4>Quick Links</h4>
          <ul>
            <li>Home</li>
            <li>Shop</li>
            <li>New Arrivals</li>
            <li>Best Sellers</li>
            <li>Contact Us</li>
            <li>FAQs</li>
          </ul>
        </div>

        <div className={styles.column}>
          <h4>Categories</h4>
          <ul>
            <li>Ceiling Lights</li>
            <li>Wall Lamps</li>
            <li>Decorative Lights</li>
            <li>Smart Lights</li>
            <li>Outdoor Lights</li>
          </ul>
        </div>

        <div className={styles.column}>
          <h4>Contact Us</h4>
          <p>📍 123 Shine Street, Delhi, India</p>
          <p>📞 +91-9876543210</p>
          <p>📧 support@lightgallery.in</p>
          <div className={styles.socials}>
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
            <a href="#">YouTube</a>
            <a href="#">Pinterest</a>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <p>© {new Date().getFullYear()} LightGallery. All rights reserved.</p>
        <div className={styles.legalLinks}>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms & Conditions</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
