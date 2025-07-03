import {configureStore} from "@reduxjs/toolkit"
import userReducer from "./user"
import productsReducer from './products'
const store = configureStore({
    reducer:{
    user:userReducer,
    product:productsReducer,
    
    }
});

export default store;