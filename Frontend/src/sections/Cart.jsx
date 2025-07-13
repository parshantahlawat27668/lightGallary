import React from 'react'
import styles from "./Cart.module.css"
const Cart = () => {
  const products = [
  { name: "LED Smart Bulb", price: 299, quantity: 1 },
  { name: "Ceiling Panel Light", price: 899, quantity: 2 },
  { name: "Decorative Wall Light", price: 649, quantity: 1 },
  { name: "Tube Light 36W", price: 450, quantity: 3 },
  // { name: "Spot Light Adjustable", price: 320, quantity: 2 },
  // { name: "Flood Light 100W", price: 1299, quantity: 1 },
  // { name: "Solar Garden Light", price: 799, quantity: 2 },
  // { name: "Chandelier 5 Arms", price: 2599, quantity: 1 },
  // { name: "Emergency Light", price: 559, quantity: 4 },
  // { name: "Pendant Hanging Light", price: 999, quantity: 1 },
];

  return (
    <div className={styles.main}>
     <p className={styles.heading}>Cart</p>
     <div className={styles.cartProductsContainer}>
      <div className={styles.titlesRow}>
        <div className={`${styles.product} ${styles.cel}`}>Product</div>
        <div className={`${styles.quantity} ${styles.cel}`}>Quantity</div>
        <div className={`${styles.total} ${styles.cel}`}>Total</div>
             <hr style={{ position:'absolute',bottom:"-10px", height:"0.5px",backgroundColor:"black",width:"100%"}}/>
      </div>
 

      {
        products.map((product)=>{
          return <div className={styles.productRow}>
        <div className={`${styles.product} ${styles.cel}`}>{product.name}</div>
        <div className={`${styles.quantity} ${styles.cel}`}>{product.quantity}</div>
        <div className={`${styles.total} ${styles.cel}`}>{product.price}</div>
      </div>
        })
      }


     </div>
     <div className={styles.checkOutContainer}>
      <p>Subtotal: Rs. 4000</p>
      <p>Tax included. Shipping calculated at checkout.</p>
      <button className={styles.checkOutBtn}>Check Out</button>
     </div>
    </div>
  )
}

export default Cart
