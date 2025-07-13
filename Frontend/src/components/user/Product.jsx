import React, { forwardRef, useState } from 'react'
import styles from "./Product.module.css"
import image from "../../assets/bulb.avif"
import { GoHeartFill } from "react-icons/go";
import { GoHeart } from "react-icons/go";
import {useNavigate} from "react-router-dom"
import axios from 'axios';
const Product = forwardRef (({title, price, productId}, ref) => {
  const [wishListed, setWishListed] = useState(false);
  const navigate = useNavigate();
  const toggleWishList = async()=>{
    setWishListed((prev)=>!prev);
    await axios.patch("http://localhost:8000/api/v1/user/toggle-wishlist-products",{productId});
  }

  const handleProductClick = (productId)=>{
navigate(`/shop/product/?productId=${productId}`);
  }
  return (
    <div className={styles.main} ref={ref} onClick={()=>handleProductClick(productId)}>
      {
        wishListed?
        <GoHeartFill size={20} color='red' className={styles.wishlistIcon} onClick={()=>toggleWishList(productId)}/>:
        <GoHeart size={20} color='grey' className={styles.wishlistIcon} onClick={toggleWishList}/>
      }
      <img src={image} className={styles.productImg}></img>
      <p>{title}</p>
      <p>Rs. {price}</p>
    </div>
  
  )
}
);

export default Product
