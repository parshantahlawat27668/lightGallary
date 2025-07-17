import React from 'react'
import styles  from "./OrderSection.module.css"
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { selectAllProducts } from '../store/selectors/productsSelectors';
import { useState } from 'react';
const OrderSection = () => {
  const location = useLocation();
  const {productId} = location.state || {};
  const allProducts = useSelector((state)=>selectAllProducts(state));
  const product = allProducts.find((product)=>product._id.toString()===productId.toString());
  const [paymentMethod, setPaymentMethod] = useState("online");

  const handlePaymentMethodChange = (e)=>{
    setPaymentMethod(e.target.value);
  }
  return (
    <div className={styles.main}>

<div className={styles.container}>
  <div className={styles.contact}>
        <p>Contact</p>
        <input type="text" placeholder='Email' style={{width:"100%"}}/>
      </div>


      <div className={styles.address}>
        <p>Delivery</p>
        <div className={styles.group}>
        <input type='text' placeholder='First name ' style={{flex:1}}></input>
        <input type='text' placeholder='Last name (Optional)' style={{flex:1}}></input>
        </div>
        <input type='text' placeholder='Address' required></input>
        <div className={styles.group}>
        <input type='text' placeholder='City' style={{flex:1}} required></input>
        <input type='text' placeholder='State' style={{flex:1}} required></input>
        <input type='number' placeholder='PIN code' style={{flex:1}} required></input>
        </div>
      </div>


      <div className={styles.payment}>
        <p>Payment</p>
        <label htmlFor='cod'><input type='radio' id='cod' name='paymentMethod' value="cod" onChange={(e)=>handlePaymentMethodChange(e)} checked={paymentMethod==="cod"}/>Cash on delivery</label>
        <label htmlFor='online'><input type='radio' id='online' name='paymentMethod' value="online" onChange={(e)=>handlePaymentMethodChange(e)} checked={paymentMethod==="online"}/>Online</label>

        {
          paymentMethod==="online"?
          <button className={styles.orderBtn}>Pay now</button>:
          <button className={styles.orderBtn}>Complete order</button>
        }
      </div>
</div>

<div className={styles.productsData}>
  <div className={styles.products}>
    <div className={styles.product}>
      <p style={{display:"flex",alignItems:"center",gap:"8px"}}> <img src={product.images.front.url} className={styles.productImg}/> {product?.title}</p>
      <p>Rs. {product.price}</p>
    </div>
    <hr style={{width:"100%"}}/>
  </div>
  <div className={styles.subTotal}>
    <p>Subtotal</p>
    <p>Rs. 500</p>
  </div>
  <div className={styles.shipping}>
    <p>Shipping</p>
    <p>Rs. 60</p>
  </div>
  <div className={styles.total}>
    <p>Total</p>
    <p>Rs. 560</p>
  </div>

</div>
      


      
    </div>
  )
}

export default OrderSection
