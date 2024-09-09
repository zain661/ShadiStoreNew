# Shadi Embroidery Store

A full-stack e-commerce platform developed using the **MERN** stack, designed for Shadi Embroidery Store in Jenin. This project features secure user authentication, API integration for delivery, and an admin panel to manage products, orders, and customer data.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
---

## Features

- **User Registration & Authentication**: JWT-based authentication with email confirmation to ensure secure user accounts.
- **Shopping Cart**: Allows customers to browse products, add them to a cart, and proceed to checkout.
- **Order Management**: API integration with a delivery company for direct order processing, with payment on delivery.
- **Admin Interface**: Manage products, orders, and customer data through a secure admin dashboard.
- **Scalability & Security**: Efficient token management, stateless API design, and error handling for robust performance.
- **Asynchronous Operations**: Maintains responsiveness for a smooth user experience.

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **API Integration**: APIs for delivery services
- **Payment**: Payment on delivery

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/shadi-store.git
    cd shadi-store
    ```

2. **Install dependencies**:
   - For the backend:
     ```bash
     cd backend
     npm install
     ```

   - For the frontend:
     ```bash
     cd ../frontend
     npm install
     ```

3. **Environment Variables**:
   Create a `.env` file in the `backend` directory with the following:
   ```bash
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   EMAIL_SERVICE=your_email_service
   EMAIL_USERNAME=your_email_username
   EMAIL_PASSWORD=your_email_password
