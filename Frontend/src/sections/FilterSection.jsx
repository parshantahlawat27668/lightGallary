import React, { useEffect, useRef, useState } from 'react'
import styles from './FilterSection.module.css'
import { PiSlidersHorizontalDuotone } from "react-icons/pi";
import { useSearchParams } from "react-router-dom"
import Product from '../components/user/Product'
import { useSelector } from "react-redux"
import { selectAllProducts } from '../store/selectors/productsSelectors';


const categories = [
  {
    category: "indoor",
    subCategory: [
      "Ceiling Lights",
      "Panel Lights",
      "Chandeliers",
      "Track Lights",
      "Wall Lights"
    ]
  },
  {
    category: "outdoor",
    subCategory: [
      "Flood Lights",
      "Street Lights",
      "Garden Lights",
      "Gate Lights",
      "Bollard Lights"
    ]
  },
  {
    category: "decorative",
    subCategory: [
      "String Lights",
      "Lanterns",
      "Wall Art Lights",
      "Neon Signs",
      "Festive Lights"
    ]
  },
  {
    category: "smart",
    subCategory: [
      "Smart Bulbs",
      "Smart Strips",
      "Motion Sensor Lights",
      "Voice Controlled Lights"
    ]
  },
  {
    category: "lamps",
    subCategory: [
      "Table Lamps",
      "Floor Lamps",
      "Desk Lamps",
      "Study Lamps",
      "Bedside Lamps"
    ]
  },
  {
    category: "bulbs",
    subCategory: [
      "LED Bulbs",
      "CFL Bulbs",
      "Tube Lights",
      "Rechargeable Bulbs"
    ]
  }
];



const FilterSection = () => {
  const [searchParams] = useSearchParams();
  const categoryParams = searchParams.get("category");
  const allProducts = useSelector((state) => selectAllProducts(state));
  const [displayProducts, setDisplayProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [subCategoryArray, setSubCategoryArray] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);

  const getSortedProducts = (products, sortBy) => {
    switch (sortBy) {
      case "low-to-high":
        return [...products].sort((a, b) => a.price - b.price);

      case "high-to-low":
        return [...products].sort((a, b) => b.price - a.price);

      case "newest-first":
        return [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      case "oldest-first":
        return [...products].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      default:
        return products;
    }
  }
  const getFilteredProducts = () => {
    if (category === "All") {
      return allProducts;
    }
    const filteredProducts = allProducts?.filter((product) => (product.category === category && subCategoryArray?.includes(product.subCategory)));
    return filteredProducts;
  }

  const updateDisplayProducts = () => {
    const filteredProducts = getFilteredProducts();
    const sortedProducts = getSortedProducts(filteredProducts, sortBy);
    setDisplayProducts(sortedProducts);
  }


  useEffect(() => {
    setCategory(categoryParams || "All");
  }, [categoryParams]);


  useEffect(() => {
    updateDisplayProducts();
  }, [category, subCategoryArray, sortBy, categoryParams]);




  useEffect(() => {
    const selectedCategory = categories.find((product) => product.category === category);
    setSelectedSubCategories(selectedCategory?.subCategory);
    setSubCategoryArray(selectedCategory?.subCategory);
  }, [category]);




  const categoryChangeHandler = (e) => {
    setCategory(e.target.value);
  }

  const subCategoryChangeHandler = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      if (!subCategoryArray.includes(value)) {
        setSubCategoryArray((prev) => [...prev, value]);
      }
    } else {
      setSubCategoryArray((prev) => prev.filter((sub) => sub !== value));
    }
    console.log(subCategoryArray);
  };

  const sortChangeHandler = (e) => {
    setSortBy(e.target.value);
    console.log("sort value change ", e.target.value);
  }




  return (
    <div className={styles.main}>
      <div className={styles.filter}>
        <div className={styles.filterHeader}>
          <PiSlidersHorizontalDuotone size={22} />
          Filter
        </div>
        <div className={styles.filters}>

          <div className={styles.category}>
            <label htmlFor='cagegory'>Category</label>
            <select id='category' name='category' className={styles.categoryInput} value={category} onChange={(e) => categoryChangeHandler(e)}>
              <option value="All">All</option>
              <option value="indoor">Indoor</option>
              <option value="outdoor">OutDoor</option>
              <option value="decorative">Decorative Lights</option>
              <option value="smart">Smart Lights</option>
              <option value="lamps">Lamps</option>
              <option value="bulbs">Bulb & Tube Lights</option>
            </select>
          </div>

          <div className={styles.subCategory}>
            <p>Sub Category</p>
            {
              selectedSubCategories?.map((subCategory, index) => {
                return <label key={index} ><input
                  type='checkbox'
                  value={subCategory}
                  checked={subCategoryArray.includes(subCategory)}
                  onChange={subCategoryChangeHandler}
                />{subCategory}</label>
              })
            }

          </div>

          <div className={styles.sort}>
            <p>Sort By</p>
            <label><input type='radio' name='sort' value='low-to-high' onChange={(e) => sortChangeHandler(e)} />Price ( low to high )</label>
            <label><input type='radio' id='sort' name='sort' value='high-to-low' onChange={(e) => sortChangeHandler(e)} />Price ( high to low )</label>
            <label><input type='radio' name='sort' value='oldest-first' onChange={(e) => sortChangeHandler(e)} />Oldest First</label>
            <label><input type='radio' name='sort' value='newest-first' onChange={(e) => sortChangeHandler(e)} />Newest First</label>
          </div>
        </div>
      </div>
      <div className={styles.productsContainer}>
        {
          displayProducts?.map((product, index) => {
            return <Product title={product?.title} price={product?.price} key={index} productId={product?._id} />
          })
        }
      </div>
    </div>
  )
}

export default FilterSection
