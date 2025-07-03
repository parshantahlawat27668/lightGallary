import axios from 'axios'
import React, { useEffect, useState } from 'react'
import styles from "./UpdateProduct.module.css"
import { MdCancel } from 'react-icons/md';
import { useRef } from 'react';
import { toast } from 'react-toastify';
const UpdateProduct = ({ productId, backToProducts }) => {
  const [product, setProduct] = useState(null);

  const titleRef = useRef();
  const descriptionRef = useRef();
  const categoryRef = useRef();
  const subCategoryRef = useRef();
  const priceRef = useRef();
  const discountPriceRef = useRef();
  const brandRef = useRef();
  const stockRef = useRef();
  const wattageRef = useRef();
  const voltageRef = useRef();
  const colorTemperatureRef = useRef();
  const warrantyRef = useRef();
  const isPublishRef = useRef();

  const setProductValues = () => {
    titleRef.current.value = product.title;
    descriptionRef.current.value = product.description;
    categoryRef.current.value = product.category;
    subCategoryRef.current.value = product.subCategory;
    priceRef.current.value = product.price;
    discountPriceRef.current.value = product.discountPrice;
    brandRef.current.value = product.brand;
    stockRef.current.value = product.stock;
    wattageRef.current.value = product.specifications.wattage;
    voltageRef.current.value = product.specifications.voltage;
    warrantyRef.current.value = product.specifications.warranty;
    colorTemperatureRef.current.value = product.specifications.colorTemperature;
    isPublishRef.current.checked = product.isPublish;

  }
  useEffect(() => {
    if (product) {
      setProductValues();
    }
  }, [product]);


  const getProduct = async () => {
    await axios.get(`http://localhost:8000/api/v1/products/${productId}`, { withCredentials: true })
      .then((result) => {
        setProduct(result.data.data);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    console.log(data);

  }
  const deleteHandler = async () => {
    await axios.delete(`http://localhost:8000/api/v1/products/delete/${productId}`, { withCredentials: true })
      .then((result) => {
        toast.success(result.data.message);
        backToProducts();

      })
      .catch((err) => {
        console.log(err);
      })
  }

  useEffect(() => {
    getProduct();
  }, [productId]);


  return (
    <div className={styles.main}>
      <h2>Update Product</h2>
      {
        product ? <form className={styles.form} onSubmit={onSubmitHandler}>
          <MdCancel className={styles.cancelBtn} size={"21px"} onClick={backToProducts} />
          <div className={styles.left}>
            <div className={styles.groupField}>
              <label htmlFor='title'>Title</label>
              <input id='title' name='title' type='text' required placeholder='Product Title' ref={titleRef}></input>
            </div>

            <div className={styles.groupField}>
              <label htmlFor='description'>Description</label>
              <textarea id='description' name='description' type='text' required placeholder='Product Description' rows="4" style={{ outline: "none", border: "none" }} ref={descriptionRef}></textarea>
            </div>

            <div className={styles.groupField} >
              <label htmlFor='category'>Category</label>
              <input id='category' name='category' type='text' required placeholder='Product Category' ref={categoryRef}></input>
            </div>

            <div className={styles.groupField} >
              <label htmlFor='subCategory'>Sub Category</label>
              <input id='subCategory' name='subCategory' type='text' required placeholder='Product Sub Category' ref={subCategoryRef}></input>
            </div>

            <div style={{ display: "flex", gap: "5px" }}>
              <div className={styles.groupField}>
                <label htmlFor='wattage'>Wattage</label>
                <input id='wattage' name='wattage' type='text' placeholder='e.g. "10W"' ref={wattageRef}></input>
              </div>
              <div className={styles.groupField}>
                <label htmlFor='voltage'>Voltage</label>
                <input id='voltage' name='voltage' type='text' placeholder='e.g. "220V"' ref={voltageRef}></input>
              </div>
            </div>

            <div style={{ display: "flex", gap: "5px" }}>
              <div className={styles.groupField}>
                <label htmlFor='colorTemperature'>Color Temperature</label>
                <input id='colorTemperature' name='colorTemperature' type='text' placeholder='e.g. "Warm White"' ref={colorTemperatureRef}></input>
              </div>

              <div className={styles.groupField}>
                <label htmlFor='warranty'>Warranty</label>
                <input id='warranty' name='warranty' type='text' placeholder='e.g. "2 year"' ref={warrantyRef}></input>
              </div>
            </div>

          </div>
          <div className={styles.right}>
            <div className={styles.groupField}>
              <label htmlFor='price'>Price</label>
              <input id='price' name='price' type='number' required placeholder='Product Price' ref={priceRef}></input>
            </div>
            <div className={styles.groupField}>
              <label htmlFor='discountPrice'>Discount Price</label>
              <input id='discountPrice' name='discountPrice' type='number' placeholder='Product Discount Price' ref={discountPriceRef}></input>
            </div>

            <div className={styles.groupField}>
              <label htmlFor='brand'>Brand</label>
              <input id='brand' name='brand' type='text' required placeholder='Product brand' ref={brandRef}></input>
            </div>

            <div className={styles.groupField} >
              <label htmlFor='stock'>Stock</label>
              <input id='stock' name='stock' type='number' required placeholder='Product Stock' ref={stockRef}></input>
            </div>
            <div className={styles.groupField} style={{ marginBottom: "15px", flexDirection:"row", gap:"5px",marginTop:"20px" }}>
              <label htmlFor='isPublish'>Is Publish</label>
              <input id='isPublish' name='isPublish' type='checkbox' ref={isPublishRef}></input>
            </div>



            <button type='submit' className={styles.btn} >Update</button>
            <button type='submit' className={styles.btn} style={{ backgroundColor: "#ff000094", color: "white", marginTop: "10px" }}
              onClick={deleteHandler}
            >Delete</button>


          </div>
        </form>
          : <h4>Product not Found</h4>
      }

    </div>
  )
}

export default UpdateProduct
