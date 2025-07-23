import React, { useEffect, useState } from 'react'
import styles from "./ProductsLayout.module.css"
import { Outlet } from 'react-router-dom'
import Products from './Products'
import AddProduct from './AddProduct'
import UpdateProduct from './UpdateProduct'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setAdminProducts } from '../../../store/adminProducts'

const ProductsLayout = () => {
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
  },[]);


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
    <>products</>

    
    // <div className={styles.main}>
    //   {
    //     page==="products"?<Products goToAddPage={goToAddPage} goToUpdatePage={goToUpdatePage}/>
    //     :page==="add"?<AddProduct backToProducts={backToProducts}/>
    //     :page==="update"?<UpdateProduct backToProducts={backToProducts} productId={productId}/>
    //     :""
    //   }
    // </div>
  )
}

export default ProductsLayout
