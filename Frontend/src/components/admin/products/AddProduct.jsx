import React from 'react'
import styles from "./AddProduct.module.css"
import { MdCancel, MdOutlineCancel } from "react-icons/md";
import axios from 'axios';
import { toast } from 'react-toastify';
const AddProduct = ({backToProducts}) => {
  const cancelHandler = ()=>{
    backToProducts();
  }

  const onAddHandler = (e)=>{
    e.preventDefault();
    const formData = new FormData(e.target);
    axios.post("http://localhost:8000/api/v1/product/add",formData,{withCredentials:true})
    .then((result)=>{
      toast.success(result.data.message);
      backToProducts();
    })
    .catch((err)=>{
      toast.error(err.response.data.message);
    })
  }

  return (
    <div className={styles.main}>
    <h2>Add Product</h2>
    <form className={styles.form} onSubmit={onAddHandler}>
      <MdCancel className={styles.cancelBtn} size={"21px"} onClick={cancelHandler}/>
      <div className={styles.left}>
        <div className={styles.groupField}>
              <label htmlFor='title'>Title</label>
              <input id='title' name='title' type='text' required placeholder='Product Title'></input>
            </div>

            <div className={styles.groupField}>
              <label htmlFor='description'>Description</label>
              <textarea id='description' name='description' type='text' required placeholder='Product Description' rows="5" style={{ outline: "none", border: "none" }}></textarea>
            </div>

             <div className={styles.groupField} >
                <label htmlFor='category'>Category</label>
                <input id='category' name='category' type='text' required placeholder='Product Category'></input>
              </div>

              <div className={styles.groupField} >
                <label htmlFor='subCategory'>Sub Category</label>
                <input id='subCategory' name='subCategory' type='text' required placeholder='Product Sub Category'></input>
              </div>

              <div style={{display:"flex", gap:"5px"}}>
                <div className={styles.groupField}>
            <label htmlFor='wattage'>Wattage</label>
            <input id='wattage' name='wattage' type='text' placeholder='e.g. "10W"'></input>
          </div>
          <div className={styles.groupField}>
            <label htmlFor='voltage'>Voltage</label>
            <input id='voltage' name='voltage' type='text' placeholder='e.g. "220V"'></input>
          </div>
              </div>

              <div style={{display:"flex", gap:"5px"}}>
 <div className={styles.groupField}>
            <label htmlFor='colorTemperature'>Color Temperature</label>
            <input id='colorTemperature' name='colorTemperature' type='text' placeholder='e.g. "Warm White"'></input>
          </div>

          <div className={styles.groupField}>
            <label htmlFor='warranty'>Warranty</label>
            <input id='warranty' name='warranty' type='text' placeholder='e.g. "2 year"'></input>
          </div>
              </div>
            
      </div>
      <div className={styles.right}>
        <div className={styles.groupField}>
                <label htmlFor='price'>Price</label>
                <input id='price' name='price' type='number' required placeholder='Product Price'></input>
              </div>
              <div className={styles.groupField}>
                <label htmlFor='discountPrice'>Discount Price</label>
                <input id='discountPrice' name='discountPrice' type='number' placeholder='Product Discount Price'></input>
              </div>

               <div className={styles.groupField}>
              <label htmlFor='brand'>Brand</label>
              <input id='brand' name='brand' type='text' required placeholder='Product brand'></input>
            </div>

            <div className={styles.groupField} >
              <label htmlFor='stock'>Stock</label>
              <input id='stock' name='stock' type='number' required placeholder='Product Stock'></input>
            </div>


             <div className={styles.groupField}>
          <label htmlFor='frontImage'>Front Image</label>
          <input id='frontImage' name='frontImage' type='file' required placeholder='Product brand'></input>
          </div>

          <div className={styles.groupField}>
          <label htmlFor='backImage'>Back Image</label>
          <input id='backImage' name='backImage' type='file'></input>
          </div>
          <button type='submit' className={styles.btn}>Add</button>


      </div>
    </form>
    </div>
  )
}

export default AddProduct
