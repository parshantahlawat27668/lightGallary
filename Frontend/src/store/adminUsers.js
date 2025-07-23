import { createSlice } from "@reduxjs/toolkit";

const adminUsersSlice = createSlice({
    name:"users",
    initialState:[],
    reducers:{
        setUsers:(state, action)=>{
            return action.payload
        }
    }
});

export const  {setUsers} = adminUsersSlice.actions;
export default adminUsersSlice.reducer;

