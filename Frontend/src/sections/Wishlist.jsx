import React, { useState } from 'react'
import styles from "./Wishlist.module.css"
import Product from '../components/user/Product'
import axios from 'axios'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

const Wishlist = () => {
  const [wishList, setWishList] = useState([]);

  useEffect(() => {
    const getWishlist = async () => {
      await axios.get("http://localhost:8000/api/v1/user/wishlist", { withCredentials: true })
        .then((result) => {
          setWishList(result.data.data.wishListProducts);
        })
        .catch((error) => {
          console.log(error);
        })
    }
    getWishlist();
  },[],);

// is WishListed logic
const user = useSelector((state)=>state.user.activeUser);
const wishlist = user?.wishList?.map((id) => id.toString()) || [];
const wishlistSet = new Set(wishlist);
const isWishListed = (productId) => wishlistSet.has(productId.toString());

  return (
    <div className={styles.main}>
      <p className={styles.heading}>My Wishlist</p>
      <div className={styles.productContainer}>
        {
          wishList.length < 1 ? <h3>No products available</h3> :
            wishList.map((product, index) => {
              return <div style={{ display: "flex", flexDirection: "column", paddingBottom: "15px" }} key={index}>
                <Product product={product} wishListed = {isWishListed(product._id)}/>
                <button className={styles.moveCartBtn}>Move to Cart</button>
              </div>
            })
        }
      </div>

    </div>
  )
}

export default Wishlist
