import React, { useEffect, useRef } from 'react'
import styles from "./OrderSection.module.css"
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { selectAllProducts } from '../store/selectors/productsSelectors';
import { useState } from 'react';
import {toast} from "react-toastify"
import axios from "axios"
const OrderSection = () => {
  const location = useLocation();
  const { productsArray } = location.state || [];
  const [subTotal, setSubTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const addressRef = useRef();
  const cityRef = useRef();
  const stateRef = useRef();
  const pinCodeRef = useRef();
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  }

  useEffect(()=>{
    const CalSubTotal = ()=>{
      let price = 0;
      productsArray?.forEach((product)=>{
        price += product.price * product.quantity;
      });
      setSubTotal(price);
    }

  CalSubTotal()
  },[productsArray]);

  const handleOrder = (e)=>{
    e.preventDefault();
    const products = productsArray?.map((product)=>{
      return {product:product._id, quantity:product.quantity}
    });
    const shippingAddress={
      fullName:firstNameRef.current.value.trim() + " " + lastNameRef.current.value.trim(),
      address:addressRef.current.value.trim(),
      city:cityRef.current.value.trim(),
      state:stateRef.current.value.trim(),
      pinCode:pinCodeRef.current.value,
    }
    
    if(paymentMethod==="cod"){
      const order = {
        products:products,
        paymentMethod:paymentMethod,
        shippingAddress:shippingAddress,   
      };
      axios.post("http://localhost:8000/api/v1/orders",order,{withCredentials:true})
      .then((response)=>{
        toast.success(response.data.message);
        axios.patch("http://localhost:8000/api/v1/user/clear-cart-products",null,{withCredentials:true}).
        then((response)=>{

        })
        .catch((err)=>console.log(err))
      })
      .catch((error)=>{
        console.log(error)
      })
    }
  }
  return (
    <div className={styles.main}>

      <form className={styles.container} onSubmit={(e)=>handleOrder(e)}>
        <div className={styles.contact}>
          <p>Contact</p>
          <input type="text" placeholder='Email' style={{ width: "100%" }} />
        </div>


        <div className={styles.address}>
          <p>Delivery</p>
          <div className={styles.group}>
            <input type='text' placeholder='First name ' style={{ flex: 1 }} ref={firstNameRef}></input>
            <input type='text' placeholder='Last name (Optional)' style={{ flex: 1 }} ref={lastNameRef}></input>
          </div>
          <input type='text' placeholder='Address' required ref={addressRef}></input>
          <div className={styles.group}>
            <input type='text' placeholder='City' style={{ flex: 1 }} required ref={cityRef}></input>
            <input type='text' placeholder='State' style={{ flex: 1 }} required ref={stateRef}></input>
            <input type='number' placeholder='PIN code' style={{ flex: 1 }} required ref={pinCodeRef}></input>
          </div>
        </div>


        <div className={styles.payment}>
          <p>Payment</p>
          <label htmlFor='cod'><input type='radio' id='cod' name='paymentMethod' value="cod" onChange={(e) => handlePaymentMethodChange(e)} checked={paymentMethod === "cod"} />Cash on delivery</label>
          <label htmlFor='online'><input type='radio' id='online' name='paymentMethod' value="online" onChange={(e) => handlePaymentMethodChange(e)} checked={paymentMethod === "online"} />Online</label>

          {
            paymentMethod === "online" ?
              <button className={styles.orderBtn} type='submit'>Pay now</button> :
              <button className={styles.orderBtn}  type='submit'>Complete order</button>
          }
        </div>
      </form>

      <div className={styles.productsData}>
        <div className={styles.products}>


          {
            productsArray?.map((product) => {
              return <div className={styles.product}>
                <p style={{ display: "flex", alignItems: "center", gap: "8px" }}> <img src={product.images.front.url} className={styles.productImg} /> {product?.title}</p>
                <p>Rs. {product.price * product.quantity}</p>
              </div>
            })
          }


          <hr style={{ width: "100%" }} />
        </div>
        <div className={styles.subTotal}>
          <p>Subtotal</p>
          <p>Rs. {subTotal}</p>
        </div>
        <div className={styles.shipping}>
          <p>Shipping</p>
          <p>Rs. 60</p>
        </div>
        <div className={styles.total}>
          <p>Total</p>
          <p>Rs. {subTotal + 60}</p>
        </div>

      </div>




    </div>
  )
}

export default OrderSection
