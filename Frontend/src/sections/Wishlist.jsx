import React from 'react'
import styles from "./Wishlist.module.css"
import Product from '../components/user/Product'
const Wishlist = () => {
  return (
    <div className={styles.main}>
      <p className={styles.heading}>My Wishlist</p>
      <div className={styles.productContainer}>
       <div style={{display:"flex",flexDirection:"column", paddingBottom:"15px"}}>
        <Product/>
        <button className={styles.moveCartBtn}>Move to Cart</button>
        </div>

        <div style={{display:"flex",flexDirection:"column", paddingBottom:"15px"}}>
        <Product/>
        <button className={styles.moveCartBtn}>Move to Cart</button>
        </div><div style={{display:"flex",flexDirection:"column", paddingBottom:"15px"}}>
        <Product/>
        <button className={styles.moveCartBtn}>Move to Cart</button>
        </div><div style={{display:"flex",flexDirection:"column", paddingBottom:"15px"}}>
        <Product/>
        <button className={styles.moveCartBtn}>Move to Cart</button>
        </div><div style={{display:"flex",flexDirection:"column", paddingBottom:"15px"}}>
        <Product/>
        <button className={styles.moveCartBtn}>Move to Cart</button>
        </div><div style={{display:"flex",flexDirection:"column", paddingBottom:"15px"}}>
        <Product/>
        <button className={styles.moveCartBtn}>Move to Cart</button>
        </div><div style={{display:"flex",flexDirection:"column", paddingBottom:"15px"}}>
        <Product/>
        <button className={styles.moveCartBtn}>Move to Cart</button>
        </div>
       
      </div>
    </div>
  )
}

export default Wishlist
