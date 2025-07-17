import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activeUser:null,
    isLoading:false,
    error:null
};



const userSlice = createSlice({
    name:"user",
    initialState:initialState,
    reducers:{
        loginStart:(state)=>{
            state.isLoading=true,
            state.error=null    
        },
        loginSuccess:(state, action)=>{
            state.activeUser=action.payload,
            state.isLoading=false
        },
        loginFailure:(state, action)=>{
            state.isLoading=false,
            state.error=action.payload
        },
        logout:(state)=>{
            state.activeUser=null,
            state.accessToken=null
        },
        updateUser:(state, action )=>{
            state.activeUser=action.payload;
        }
    }
});
export const {loginStart, loginSuccess, loginFailure, logout, updateUser} = userSlice.actions;
export default userSlice.reducer;