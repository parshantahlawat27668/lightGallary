import { Route, Routes } from 'react-router-dom';
import './App.css'
import {useSelector} from "react-redux"
import CheckAuth from './components/common/checkAuth';
import Layout from './pages/auth/Layout';
import Login from './components/auth/Login.jsx';
import Register from './components/auth/Register';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./styles/toast.css";
import VerifyOtp from './components/auth/VerifyOtp.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import Dashboard from './components/admin/dashboard/Dashboard.jsx';
import Stock from './components/admin/stock/Stock.jsx';
import Users from './components/admin/users/Users.jsx';
import Orders from './components/admin/orders/Orders.jsx';
import ProductsLayout from './components/admin/products/ProductsLayout.jsx';
import UserLayout from './pages/user/UserLayout.jsx';
const App = () => {
  const user = useSelector((state)=>state.user.activeUser);
  return (
    <div className='appContainer'>
      <ToastContainer 
       position="bottom-left"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop={true}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  pauseOnHover
  draggable
  theme="light" // or "dark"
  limit={3}
  toastClassName="custom-toast"
  bodyClassName="custom-toast-body"
      />
  <Routes>
    
<Route path='/' element={<CheckAuth user={user}></CheckAuth>}/>
{/* Auth Routes */}
<Route path='/auth' element={<CheckAuth user={user}><Layout/></CheckAuth>}>
<Route path='login' element={<Login/>}></Route>
<Route path='register' element={<Register/>}></Route>
<Route path='verify-phone' element={<VerifyOtp/>}></Route>
</Route>

{/* Admin Routes */}
<Route path='/admin' element={<CheckAuth user={user}><AdminLayout/></CheckAuth>}>
<Route path="dashboard" element={<Dashboard/>}></Route>
<Route path="orders" element={<Orders/>}></Route>
<Route path='products' element={<ProductsLayout/>}>
</Route>  
<Route path="users" element={<Users/>}></Route>
<Route path="stock" element={<Stock/>}></Route>

</Route>

{/* User Routes */}
<Route path='/shop/home' element={<CheckAuth user={user}><UserLayout/></CheckAuth>}>

</Route>
  </Routes>
    </div>
  )
}

export default App
