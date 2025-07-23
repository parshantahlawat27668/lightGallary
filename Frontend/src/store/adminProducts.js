import { createSlice } from "@reduxjs/toolkit";

const adminProductsSlice = createSlice({
name:"adminProducts",
initialState:[],
reducers:{
    setAdminProducts:(state,action)=>{
        return action.payload;
    }
}
});

export const {setAdminProducts} = adminProductsSlice.actions;
export default adminProductsSlice.reducer;