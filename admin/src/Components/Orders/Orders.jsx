import { useEffect, useState } from 'react';
import './Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch(`${process.env.SERVER_URL}/allorders`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetched orders:', data);
                setOrders(data);
            })
            .catch(error => console.error('Error fetching orders:', error));
    }, []);

    return (
        <div className="orders-container">
            <h1>All Orders</h1>
            <table className="orders-table">
                <thead>
                    <tr>
                        <th className="order-id">Order ID</th>
                        <th className="user-name">User Name</th>
                        <th className="user-email">User Email</th>
                        <th className="total-amount">Total Amount</th>
                        <th className="status">Status</th>
                        <th className="address">Address</th>
                        <th className="phone-number">Phone Number</th>
                        <th className="product-name">Product Name</th>
                        <th className="product-quantity">Quantity</th>
                        <th className="product-size">Size</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(orders) && orders.length > 0 ? orders.map(order => (
                        order.products.map((product, index) => {
                            const userName = order.userId?.name || order.clientName || 'Unknown';
                            const userEmail = order.userId?.email || 'N/A';
                            const address = order.address ? `${order.address}` : 'Unknown';
                            const phoneNumber = order.phoneNumber || 'Unknown';
                            return (
                                <tr key={`${order.orderId}-${index}`}>
                                    {index === 0 && (
                                        <>
                                            <td rowSpan={order.products.length}>{order.orderId}</td>
                                            <td rowSpan={order.products.length}>{userName}</td>
                                            <td rowSpan={order.products.length}>{userEmail}</td>
                                            <td rowSpan={order.products.length}>{order.totalAmount}</td>
                                            <td rowSpan={order.products.length}>{order.orderStatus || 'Pending'}</td>
                                            <td rowSpan={order.products.length}>{address}</td>
                                            <td rowSpan={order.products.length}>{phoneNumber}</td>
                                        </>
                                    )}
                                    <td>{product.name}</td>
                                    <td>{product.quantity}</td>
                                    <td>{product.size}</td>
                                </tr>
                            );
                        })
                    )) : (
                        <tr>
                            <td colSpan="10">No orders found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Orders;
