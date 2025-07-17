import React, { forwardRef, useState } from 'react'
import styles from "./Product.module.css"
import image from "../../assets/bulb.avif"
import { GoHeartFill } from "react-icons/go";
import { GoHeart } from "react-icons/go";
import {useNavigate} from "react-router-dom"
import axios from 'axios';
import { updateUser } from '../../store/user';
import {useDispatch} from "react-redux"
const Product = forwardRef (({product, wishListed}, ref) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const toggleWishList = async(productId,e)=>{
    e.stopPropagation();
    const response =  await axios.patch("http://localhost:8000/api/v1/user/toggle-wishlist-products",{productId},{withCredentials:true});
    dispatch(updateUser(response.data.data.user));
  }

  const handleProductClick = (productId)=>{
navigate(`/shop/product/?productId=${productId}`);
  }
  return (
    <div className={styles.main} ref={ref} onClick={()=>handleProductClick(product._id)}>
      {
        wishListed?
        <GoHeartFill size={20} color='red' className={styles.wishlistIcon} onClick={(e)=>toggleWishList(product._id,e)}/>:
        <GoHeart size={20} color='grey' className={styles.wishlistIcon} onClick={(e)=>toggleWishList(product._id,e)}/>
      }
      <img src={product.images.front.url} className={styles.productImg}></img>
      <p>{product.title}</p>
      <p>Rs. {product.price}</p>
    </div>
  
  )
}
);

export default Product
