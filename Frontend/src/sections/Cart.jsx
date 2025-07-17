import React, { useEffect } from 'react'
import styles from "./Cart.module.css"
import {useSelector} from "react-redux"
import { selectAllProducts } from '../store/selectors/productsSelectors';
const Cart = () => {
  const cartProducts = useSelector((state)=>state.user.activeUser.cart);
  const allProducts = useSelector((state)=>selectAllProducts(state));



const getProductTitleById = (productId)=>{
  const product = allProducts.find((product)=>product._id.toString()===productId.toString());
  return product?.title;
  }

const getTotalPrice = ()=>{
  let total=0;
  cartProducts.map((product)=>{
    total = total + product.price;
  });
  return total;
}
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
        cartProducts.map((product)=>{
          return <div className={styles.productRow}>
        <div className={`${styles.product} ${styles.cel}`}><img src=''></img>{getProductTitleById(product.product)}</div>
        <div className={`${styles.quantity} ${styles.cel}`}>{product.quantity}</div>
        <div className={`${styles.total} ${styles.cel}`}>{product.price}</div>
        {/* <p>Remove</p> */}
      </div>
        })
      }


     </div>
     <div className={styles.checkOutContainer}>
      <p>Subtotal: Rs. {getTotalPrice()}</p>
      <p>Tax included. Shipping calculated at checkout.</p>
      <button className={styles.checkOutBtn}>Check Out</button>
     </div>
    </div>
  )
}

export default Cart
