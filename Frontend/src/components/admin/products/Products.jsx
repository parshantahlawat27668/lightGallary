import React from 'react'
import styles from "./Products.module.css"
import { BsSearchHeart } from "react-icons/bs";
import { IoIosSearch, IoMdAdd } from "react-icons/io";
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

const Products = ({ goToAddPage, goToUpdatePage }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const addProducthandler = () => {
    goToAddPage();
  }

  const productClickHandler = (productId) => {
    goToUpdatePage(productId);
  }

  const fetchProducts = async () => {
  if (loading) return;
  setLoading(true);

  try {
    const result = await axios.get(`http://localhost:8000/api/v1/products`);
    const newProducts = result.data.data.products;
    setProducts(newProducts);
  } catch (err) {
    console.log("Error fetching products:", err);
  } finally {
    setLoading(false); // move out of then/catch
  }
};



  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <div className={styles.productsSection}>
      <div className={styles.header}>
        <div className={styles.search}>
          <input type='text' placeholder='Search Products'></input>
          <IoIosSearch size={"20px"} />
        </div>
        <button className={styles.addProduct} onClick={addProducthandler}><IoMdAdd /> Add Product</button>
        <div className={styles.features}>
          <h6>Filter</h6>
          <h6>Sorts</h6>
        </div>
      </div>
      <hr />
      <div className={styles.titlesRow}>
        <div className={`${styles.product} ${styles.col}`}>Product</div>
        <div className={`${styles.category} ${styles.col}`}>Category</div>
        <div className={`${styles.price} ${styles.col}`}>Price</div>
        <div className={`${styles.stock} ${styles.col}`}>Stock</div>
        <div className={`${styles.status} ${styles.col}`}>Status</div>
      </div>
      {
        loading ? <h3>Loading</h3> : <div className={styles.products}>
          {
            products.map((product, index) => {
              return <div className={styles.productRow} onClick={() => productClickHandler(product._id)} key={index} >
                <div className={`${styles.product} ${styles.col}`} style={{ display: "flex" }}> 
                  <p>{product.title}</p>
                </div>
                <div className={`${styles.category} ${styles.col}`}>{product.category}</div>
                <div className={`${styles.price} ${styles.col}`}>Rs. {product.price}</div>
                <div className={`${styles.stock} ${styles.col}`}>{product.stock}</div>
                <div className={`${styles.status} ${styles.col}`}>Published</div>
              </div>
            })
          }

        </div>
      }

    </div>
  )
}

export default Products
