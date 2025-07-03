import React, { useState } from 'react'
import styles from "./ProductsLayout.module.css"
import { Outlet } from 'react-router-dom'
import Products from './Products'
import AddProduct from './AddProduct'
import UpdateProduct from './UpdateProduct'

const ProductsLayout = () => {
  const [page, setPage] = useState("products");
  const [productId, setProductId] = useState(null);
  const goToAddPage=()=>{
    console.log("go to add page running");
    setPage("add");
  }
  const goToUpdatePage = (productId)=>{
    setProductId(productId);
    setPage("update");

  }
  const backToProducts = ()=>{
    setPage("products");
  }
  return (
    <div className={styles.main}>
      {
        page==="products"?<Products goToAddPage={goToAddPage} goToUpdatePage={goToUpdatePage}/>
        :page==="add"?<AddProduct backToProducts={backToProducts}/>
        :page==="update"?<UpdateProduct backToProducts={backToProducts} productId={productId}/>
        :""
      }
    </div>
  )
}

export default ProductsLayout
