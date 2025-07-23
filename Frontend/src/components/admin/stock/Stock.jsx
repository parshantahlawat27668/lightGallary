import React from 'react'
import { useDispatch, useSelector } from "react-redux"
import { setAdminProducts } from '../../../store/adminProducts';
import axios from 'axios';
import { useEffect } from 'react';
import styles from "./Stock.module.css"
import { useState } from 'react';
const Stock = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.adminProducts);
  useEffect(() => {
    if (products.length === 0) {
      axios.get("http://localhost:8000/api/v1/products/admin")
        .then((response) => {
          dispatch(setAdminProducts(response.data.data));
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <input type='text' placeholder='Search' className={styles.search}></input>
        <div style={{ display: "flex", gap: "20px", marginRight: "20px" }}>
          <p className={styles.filter}>Filter</p>
          <p className={styles.sort}>Sort</p>
        </div>
      </div>
      <div className={styles.products}>
        <div className={styles.titleRow}>
          <div className={styles.product}>Product</div>
          <div className={styles.category}>Category</div>
          <div className={styles.subCategory}>Sub Category</div>
          <div className={styles.brand}>Brand</div>
          <div className={styles.stock}>Stock</div>
          <div className={styles.status}>Status</div>
        </div>
        {
          products.map((product) => {
            return <div className={styles.productRow} key={product._id}>
              <div className={styles.product}><img src={product.images.front.url} className={styles.productImage}/>{product.title}</div>
              <div className={styles.category}>{product.category}</div>
              <div className={styles.subCategory}>{product.subCategory}</div>
              <div className={styles.brand}>{product.brand}</div>
              <div className={styles.stock}>{product.stock}</div>
              <div className={styles.status}>In Stock</div>
            </div>
          })
        }
      </div>
    </div>
  )
}

export default Stock
