import { createSlice } from "@reduxjs/toolkit";

const adminOrdersSlice = createSlice({
name:"orders",
initialState:[],
reducers:{
    setOrders:(state, action)=>{
        return action.payload;
    }
}
});
export const {setOrders} = adminOrdersSlice.actions;
export default adminOrdersSlice.reducer;
