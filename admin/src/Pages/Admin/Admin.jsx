import './Admin.css'
import Sidebar from '../../Components/Sidebar/Sidebar';
import { Routes,Route } from 'react-router-dom';
import ListProduct from '../../Components/ListProduct/ListProduct.jsx';
import AddProduct from "../../Components/AddProduct/AddProduct.jsx";
import Orders from '../../Components/Orders/Orders.jsx';

const Admin = () => {
    return (
        <div className='admin'>
            <Sidebar/>
            <Routes>
                <Route path='/addproduct' element={<AddProduct/>}/>
                <Route path='/listproduct' element={<ListProduct/>}/>
                <Route path='/orders' element={<Orders />} />
            </Routes>  
        </div>
    );
}

export default Admin;
