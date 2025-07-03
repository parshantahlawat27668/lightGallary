import React from 'react'
import styles from './Header.module.css'
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { GoHeart } from "react-icons/go";
import { GoHeartFill } from "react-icons/go";
import { BsSearch } from "react-icons/bs";
const Header = () => {
  return (
    <div className={styles.main}>
      <div className={styles.nav1}>
<div className={styles.logo}>
       <h1>LightGallery</h1>
      </div>
      <div className={styles.search}>
        <input type='text' placeholder='Search Products'></input>
        <BsSearch className={styles.searchIcon} size={15}/>
      </div>
      <div className={styles.rightOpt}>
        <MdOutlineShoppingCart size={20}/>
        {/* <GoHeartFill /> */}
        <GoHeart size={20}/>
        <FaRegUser size={20}/>
      </div>
      </div>
      <div className={styles.nav2}>
        <p>Indoor Lights</p>
        <p>Outdoor Lights</p>
        <p>Decorative Lights</p>
        <p>Smart Lights</p>
        <p>Lamps Lights</p>
        <p>Bulbs & Tubes Lights</p>

      </div>
      


    </div>
  )
}

export default Header
