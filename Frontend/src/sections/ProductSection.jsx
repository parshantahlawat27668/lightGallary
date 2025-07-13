import React, { useRef, useState } from 'react'
import styles from "./ProductSection.module.css"
import { LuPlus } from "react-icons/lu";
import { LuMinus } from "react-icons/lu";
import { useSelector } from 'react-redux';
import { selectProductById } from '../store/selectors/productsSelectors';
import { useSearchParams } from 'react-router-dom';
// const product = {
//       specifications: {
//         wattage: '24',
//         voltage: '220',
//         colorTemperature: 'warm white ',
//         warranty: '2 years'
//       },
//       images: {
//         front: {
//           url: 'https://res.cloudinary.com/dcezxtvlz/image/upload/v1751196904/g5kpruup9e0yo9wufvcn.jpg',
//           public_id: 'g5kpruup9e0yo9wufvcn',
//           resource_type: 'image'
//         },
//         back: {
//           url: 'https://res.cloudinary.com/dcezxtvlz/image/upload/v1751196905/rozrmcxs6o6rierc9fni.jpg',
//           public_id: 'rozrmcxs6o6rierc9fni',
//           resource_type: 'image'
//         }
//       },
//       _id: '686124ea981efa01db15ccf4',
//       title: 'LED Tube Light 30',
//       description: 'High-quality LED tube light 3 for home and commercial use.',
//       price: 90,
//       discountPrice: 10,
//       stock: 500,
//       sold: 0,
//       category: 'lights',
//       subCategory: 'tube lights',
//       brand: 'suriya',
//       isPublish: true,
//       rating: 0,
//       numOfRatingUser: 0,
//       createdAt: '2025-06-29T11:35:06.218Z',
//       updatedAt: '2025-06-29T11:35:06.218Z',
//       __v: 0
//     }
const ProductSection = () => {
  const [quantity, setQuantity] = useState(1);
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");
  const product = useSelector((state)=>selectProductById(state,productId));
  const [selectedImage, setSelectedImage] = useState(product.images.front.url);
  const selectImage = (imagePath)=>{
    setSelectedImage(imagePath);
  }
  const handleQuantityChange=(e)=>{
    setQuantity(e.target.value);
  }
  const handleIncrement=()=>{
    setQuantity((prev)=>prev+1);
  }
  const handleDecrement = ()=>{
    if(quantity>0){
      setQuantity((prev)=>prev-1);
    }
  }
  return (
    <div className={styles.main}>
      <div className={styles.product}>
      <div className={styles.imageGallery}>
        <div className={styles.selector}>
        <img src={product.images.front.url} className={styles.selectorImage} onClick={()=>selectImage(product.images.front.url)}></img>
        <img src={product.images.back.url} className={styles.selectorImage} onClick={()=>selectImage(product.images.back.url)}></img>
        </div>

      <div className={styles.imageDisplay}>
        <img src={selectedImage} className={styles.displayImage}></img>
      </div>
      </div>
      <div className={styles.productDetails}>
        <p className={styles.title}>{product.title}</p>
        {/* <p>{product.description}</p> */}
        <p className={styles.price}>Rs. {product.price}</p>
        <label htmlFor="quantity" className={styles.quantity}>Quantity </label>
        <div style={{display:"flex", gap:"6px",marginBottom:"20px"}}>
        <div className={styles.decrement}><LuMinus size={18} onClick={handleDecrement}/></div>
        <input id='quantity' type='number' name='quantity' className={styles.quantityInput}min={1} value={quantity} onChange={(e)=>handleQuantityChange(e)}></input>
        <div className={styles.increment} ><LuPlus size={18} onClick={handleIncrement}/></div>
        </div>
        <button className={styles.cartBtn}>ADD TO CART</button>
        <button className={styles.buyBtn}>BUY IT NOW</button> 
      </div>
      </div>
    </div>
  )
}

export default ProductSection
