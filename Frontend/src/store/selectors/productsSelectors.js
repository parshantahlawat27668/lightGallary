
export const selectAllProducts  =(state)=> state.products;

export const selectBestSellers = (state, limit= 10) =>{
return [...selectAllProducts(state)]
.sort((a,b)=>b.sold - a.sold)
.slice(0,limit);
};

export const selectProductById = (state, productId) =>{
    return selectAllProducts(state).find((product)=>product._id===productId)
}

export const selectNewArrivals = (state, limit=10) =>{
return [...selectAllProducts(state)]
.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt))
.slice(0,limit);
};  

export const selectProductsByCategory = (state, category)=>{
return selectAllProducts(state).filter(
    (product)=> product.category?.toLowerCase() === category?.toLowerCase()
);
}