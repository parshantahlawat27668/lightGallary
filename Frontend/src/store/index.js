import {configureStore} from "@reduxjs/toolkit"
import userReducer from "./user"
import productsReducer from './products'
import adminProductsReducer from "./adminProducts"
import adminOrdersReducer from "./adminOrders"
import adminUsersReducer from "./adminUsers"
const store = configureStore({
    reducer:{
    user:userReducer,
    products:productsReducer,
    adminProducts:adminProductsReducer,
    adminOrders:adminOrdersReducer,
    adminUser:adminUsersReducer
    }
});

export default store;