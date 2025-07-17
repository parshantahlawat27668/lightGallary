import React from 'react'
import styles from './Header.module.css'
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { GoHeart } from "react-icons/go";
import { GoHeartFill } from "react-icons/go";
import { BsSearch } from "react-icons/bs";
import { Link } from 'react-router-dom';
const Header = () => {
  return (
    <div className={styles.main}>
      <div className={styles.nav1}>
        <Link className={styles.link} to="/shop/home">
          <h1>LightGallery</h1>
        </Link>
        <div className={styles.search}>
          <input type='text' placeholder='Search Products'></input>
          <BsSearch className={styles.searchIcon} size={15} />
        </div>
        <div className={styles.rightOpt}>
          <Link className={styles.link} to="/shop/cart">
            <MdOutlineShoppingCart size={20} />
          </Link>
          <Link to="/shop/wishlist" className={styles.link}>
            <GoHeart size={20} />
          </Link>
          <Link to="/shop/user" className={styles.link}>
            <FaRegUser size={20} />
          </Link>
        </div>
      </div>
      <div className={styles.nav2}>
        <Link to="/shop/filter?category=Indoor lights" className={styles.link}>Indoor Lights</Link>
        <Link to="/shop/filter?category=Outdoor lights" className={styles.link}>Outdoor Lights</Link>
        <Link to="/shop/filter?category=Decorative lights" className={styles.link}>Decorative Lights</Link>
        <Link to="/shop/filter?category=Smart lights" className={styles.link}>Smart Lights</Link>
        <Link to="/shop/filter?category=lamps" className={styles.link}>Lamps Lights</Link>
        <Link to="/shop/filter?category=Basic lights" className={styles.link}>Basic Lights</Link>
      </div>



    </div>
  )
}

export default Header
