import React, { forwardRef } from 'react'
import styles from "./Product.module.css"
import image from "../../assets/bulb.avif"
const Product = forwardRef (({name, price}, ref) => {
  return (
    <div className={styles.main} ref={ref}>
      <img src={image} className={styles.productImg}></img>
      <p>{name}</p>
      <p>Rs. {price}</p>
    </div>
  
  )
}
);

export default Product
