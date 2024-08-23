// What: This line sets the port number that the server will listen on.
// Why: By specifying a port, you define where your server will be accessible. In this case, it will be accessible on port 4000.
const port = process.env.PORT || 4000;
import express from "express"; // express: A web framework for Node.js to create server-side applications. express: To create routes -Routes: Define the URLs/endpoints and associate them with specific HTTP methods (e.g., GET, POST). Routes are about mapping URLs to the functions that should be executed.- and handle HTTP requests -refers to the process of responding to these requests. When a route matches a client's request, the server executes a callback function (also known as a route handler or controller) to handle the request and send back a response.-
import request from "request"; // Import the request module
const app = express();
import mongoose from "mongoose"; // mongoose: An ODM (Object Data Modeling) library -It is a programming technique used to map objects in your code to data stored in a database, typically a NoSQL database like MongoDB. This allows developers to interact with the database using objects, classes, and methods, rather than writing raw database queries. ODMs provide a structured and object-oriented way to manage database operations.- for MongoDB and Node.js.To interact with MongoDB, enabling you to define schemas and models.
import jwt from "jsonwebtoken"; //A library to create and verify JSON Web Tokens. To manage authentication using JWTs.
import multer from "multer"; //A middleware for handling multipart/form-data (used for file uploads).
import path from "path"; //A Node.js module for working with file and directory paths.
import cors from "cors"; //A middleware to enable Cross-Origin Resource Sharing (CORS). To allow your server to accept requests from different origins (useful in development when your frontend and backend are on different servers).

import connectDB from "./database.mjs";
import Product from "./product.mjs";
import User from "./user.mjs";
import Order from "./order.mjs";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
//Load environment variables from a .env file into process.env.
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//What: This middleware parses incoming requests with JSON payloads and is based on body-parser. It extracts the JSON data from the request body and makes it available under req.body.
//Why: When clients send data to your server in JSON format (such as in POST requests), you need to parse this data to work with it in your server-side code. express.json() does this automatically, making it easier to handle JSON data.
app.use(cors()); //Why: By default, web browsers restrict cross-origin HTTP requests initiated from scripts for security reasons. This means a web application running on one domain (e.g., http://example.com) cannot request resources from another domain (e.g., http://api.example.com). Using cors() middleware allows you to relax this restriction and define rules for allowing such requests.
//Database connection with mongoDb
connectDB();

//API creation
app.get("/", (req, res) => {
  res.send("Express App is running");
});
app.use(
  cors({
    origin: [`${process.env.CLIENT_URL}`],
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true,
  }),
);
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000/");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });



// Middleware to set CORS headers
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   next();
// });



let tokenData = null; // In-memory store for token data


const fetchToken = async () => {
  const url = "https://roadfinitymobile.roadfn.com/api/Login"; // Ensure the correct endpoint path
  const payload = {
    UserName: "researchers@road.com",
    Password: "123456",
    DeviceToken: "string", // You can provide an empty string or null here
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Ensure correct content type
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(
        `Network response was not ok. Status: ${response.status} - ${response.statusText}. Details: ${errorDetails}`
      );
    }

    const data = await response.json();
    console.log("Response data:", data); // Log the entire response for debugging
    const token = data.Token; // Adjust according to the actual response structure
    console.log(`Token: ${token}`);
    return data;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
};

// Call the function

const fetchCities = async (token) => {
  const citiesUrl = "https://roadfinitymobile.roadfn.com/api/Business/Cities";

  try {
    const response = await fetch(citiesUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(
        `Failed to fetch cities. Status: ${response.status} - ${response.statusText}. Details: ${errorDetails}`
      );
    }

    const citiesData = await response.json();
    //console.log(citiesData);
    return citiesData;
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw error; // Propagate the error for handling at the caller's end
  }
};
const isTokenExpired = (expires) => {
    return new Date(expires) < new Date();
  };

const fetchAreas = async(token, cityId)=> {
      const areaUrl = `https://roadfinitymobile.roadfn.com/api/Business/Areas?CityId=${cityId}`;
      try{
        const response = await fetch(areaUrl,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
       );
       if(!response.ok){
        const errorDetails = await response.text();
        throw new Error(
          `Failed to fetch cities. Status: ${response.status} - ${response.statusText}. Details: ${errorDetails}`
        );
      }
      const areas = await response.json();
      //console.log(areas);
      return areas;
    }
     catch (error) {
        console.error("Error fetching cities:", error);
        throw error; // Propagate the error for handling at the caller's end
      }
}

const fetchTrackingNumber = async (token) => {
  try {
    const response = await fetch(`https://roadfinitymobile.roadfn.com/api/Business/GetShipmentsTrackingGeneratedCode`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    const trackingNumber = data.GeneratedCode;
    console.log('Tracking Number:', trackingNumber);
    return trackingNumber;
  } catch (error) {
    console.error("Error fetching tracking number:", error);
    throw error; // Propagate the error for handling at the caller's end
  }
}

const fetchShipmentTypes = async (token)=> {
  try{
    const response = await fetch(`https://roadfinitymobile.roadfn.com/api/Business/ShipmentsTypes`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log('Shipment Types:', data);
    return data;
    }
    catch (error) {
      console.error("Error fetching shipmentTypes:", error);
      throw error; // Propagate the error for handling at the caller's end
    }
}

const fetchShippingFees = async (token) => {
  try {
    const response = await fetch(`https://roadfinitymobile.roadfn.com/api/Business/ListOfShippingFees`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};



const createShipment = async (shipmentData, token) => {
  try {
      const response = await fetch('https://roadfinitymobile.roadfn.com/api/Business/CreateShipmentConfirm', {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(shipmentData)
      });
      if(!response.ok){
        const errorDetails = await response.text();
        throw new Error(
          `Failed to fetch cities. Status: ${response.status} - ${response.statusText}. Details: ${errorDetails}`
        );
      }
      else{
        console.log(`shipment done ${response.status} ${response.statusText}`)
      }
  } catch (error) {
      console.error('Error:', error);
      throw error;
  }
};

  
app.get('/api/fees' , async(req,res) => {
  try{
    if (!tokenData || isTokenExpired(tokenData.expires)) {
      // Fetch new token
      tokenData = await fetchToken();
    }
    const feesData = await fetchShippingFees(tokenData.Token);
    res.json(feesData);
  }
  catch (error) {
    console.error("Error fetching fees:", error);
    res.status(500).json({ error: "Failed to fetch cities" });
  }
})
app.get('/api/areas' , async (req,res) =>{
  try {
    const { cityId } = req.query; // Extract cityId from query parameters
    if (!tokenData || isTokenExpired(tokenData.expires)) {
      // Fetch new token
      tokenData = await fetchToken();
    }

    // Fetch cities using token
    const areasData = await fetchAreas(tokenData.Token, cityId);
    res.json(areasData);
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).json({ error: "Failed to fetch cities" });
  }
});
  
  app.get("/api/cities", async (req, res) => {
    try {
      if (!tokenData || isTokenExpired(tokenData.expires)) {
        // Fetch new token
        tokenData = await fetchToken();
      }
  
      // Fetch cities using token
      const citiesData = await fetchCities(tokenData.Token);
      res.json(citiesData);
    } catch (error) {
      console.error("Error fetching cities:", error);
      res.status(500).json({ error: "Failed to fetch cities" });
    }
});

//nodemailer, a module for Node.js applications that allows you to send emails. This specific configuration creates a transporter object that is used to send emails via Gmail's SMTP server
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Specifies the SMTP server to use for sending emails. In this case, it is set to Gmail's SMTP server.
  port: 587, // Use port 587 for TLS/STARTTLS
  secure: false, // false for TLS/STARTTLS, true for SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, //Disables certificate validation. This can be useful in development environments but is not recommended for production because it makes the connection less secure.
  },
});
//1. Email Verification When a user registers, you want to verify their email address to ensure it’s valid and that they have access to it. In this context, the token is sent to the user's email address. When the user clicks the verification link, the token is sent back to your server to confirm their email address.2. Authentication When a user logs in, you want to create a session for them. Instead of using traditional server-side sessions, you can use JWTs. The token is generated upon successful login and sent back to the client. The client stores the token (typically in local storage or cookies) and includes it in the Authorization header of subsequent requests to access protected routes.
//Token Types and Use Cases Email Verification Token:Purpose: To verify the user's email address.Lifespan: Usually short-lived, e.g., 1 hour.
// Contents: User ID and email, with a claim specifying that it is for email verification.
// Process: Generated during registration, sent via email, and validated when the user clicks the verification link.
// Authentication Token:
// Purpose: To authenticate the user and create a session.
// Lifespan: Can be longer-lived, e.g., 24 hours, but should be renewed periodically.
// Contents: User ID, email, and any roles or permissions.
// Process: Generated upon successful login and used in the Authorization header of subsequent requests.

const generateEmailVerificationToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, type: "email-verification" },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};
const generateAuthToken = (user) => {
  return jwt.sign(
    { user: { id: user._id, email: user.email } },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};

const sendVerificationEmail = (user, req, res) => {
  const token = generateEmailVerificationToken(user);
  user.confirmationToken = token;
  user.save(); //Associates the generated token with the user's record in the database.

  const verificationLink = `http://${req.headers.host}/verify-email?token=${token}`; //By using req.headers.host, you ensure that the constructed link always points back to the same server that handled the request, even if your server's address changes.
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Email Verification",
    text: `Please verify your email by clicking the following link: ${verificationLink}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    //Uses the nodemailer transporter to send the email
    if (err) {
      console.log("Error sending verification email:", err);
      return res
        .status(500)
        .json({ error: "Error sending verification email" });
    } else {
      console.log("Verification email sent: " + info.response);
      return res.status(200).json({ message: "Verification email sent" });
    }
  });
};

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  console.log("Registering user:", { name, email, password });

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with a salt round of 10
    let cart = {};
    // for (let i = 0; i < 300; i++) {
    //   cart[i] = 0;
    // }
    const user = new User({
      name,
      email,
      password: hashedPassword,
      cartData: cart,
    });
    await user.save();
    sendVerificationEmail(user, req, res);
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      console.error("Duplicate email error:", error);
      res.status(400).json({ error: "Email already registered" });
    } else {
      console.error("Error registering user:", error);
      res.status(400).json({ error: "Error registering user" });
    }
  }
});

app.get("/verify-email", async (req, res) => {
  const token = req.query.token;
  if (!token) return res.status(400).send("Invalid token");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id });
    if (!user) return res.status(400).send("Invalid token");

    user.isVerified = true;
    user.confirmationToken = null;
    await user.save();

    res.redirect("https://shadistore-1-frontend.onrender.com/turath/login?verified=true"); // Redirect to login page with a query parameter
  } catch (error) {
    res.status(400).send("Invalid token");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ error: "Email not verified" });
    }

    const token = generateAuthToken(user);
    console.log("token:", token);
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//destination: Specifies the location where the uploaded files will be stored. In this case, they will be stored in the upload/images folder. filename: Specifies how uploaded files will be named. Here, the file is named using the field name followed by the timestamp and the original file extension.
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

//creating upload endpoint for images, What it is: express.static() is used to deliver static files such as images Why is it used: To make uploaded files accessible via the browser. When the user requests /images/<filename>, Express will send the file from upload/images.
app.use("/images", express.static("upload/images"));
app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `${process.env.SERVER_URL}/images/${req.file.filename}`,
  });
});
app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }

  const product = new Product({
    id: id,
    name: req.body.name,
    description: req.body.description, // Add description to the product object
    image: req.body.image,
    category: req.body.category,
    price: req.body.price,
    sizes: req.body.sizes, // expects an array of size objects { size: 'M', quantity: 10 }
  });

  console.log(product);
  await product.save();
  console.log("saved");
  res.json({
    success: true,
    name: req.body.name,
  });
});

app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("removed");
  res.json({
    success: true,
    name: req.body.name,
  });
});
app.post("/updateProduct", async (req, res) => {
  const { id, name, description, image, category, price, sizes, available } =
    req.body; // Include description
  console.log(req.body);

  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { id: id },
      { name, description, image, category, price, sizes, available }, // Include description in the update query
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
});

app.get("/allproducts", async (req, res) => {
  console.log("here10")
  let products = await Product.find({});
  console.log("All products", products);
  res.send(products);
});

//creating middleware to fetch user
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  console.log("Token received:", token); // Debugging statement
  if (!token) {
    return res
      .status(401)
      .send({ errors: "please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token verified:", data); // Debugging statement
    req.user = data.user;
    next();
  } catch (error) {
    console.error("Token verification error:", error); // Debugging statement
    res.status(401).send({ errors: "please authenticate using a valid token" });
  }
};

//creating endpoint for adding products in cartData
//creating endpoint for adding products in cartData
app.post("/addtocart", fetchUser, async (req, res) => {
  try {
    console.log("added", req.body.itemId, req.body.size);
    let userData = await User.findOne({ _id: req.user.id });

    // Check if cartData is an object and initialize if not
    if (typeof userData.cartData !== "object") {
      userData.cartData = {};
    }

    // Fetch the product to check the quantity
    let productDetails = await Product.findById(req.body.itemId);
    if (!productDetails) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    // Find the size and check the quantity
    const sizeDetails = productDetails.sizes.find(
      (size) => size.size === req.body.size
    );
    if (!sizeDetails) {
      res
        .status(404)
        .json({
          message: `Size ${req.body.size} not found for product ${productDetails.name}`,
        });
      return;
    }

    if (sizeDetails.quantity <= 0) {
      res
        .status(400)
        .json({
          message: `Product ${productDetails.name} with size ${req.body.size} is out of stock`,
        });
      return;
    }

    // Ensure the itemId in cartData is an object
    if (typeof userData.cartData[req.body.itemId] === "number") {
      userData.cartData[req.body.itemId] = {}; // Convert number to object if necessary
    }

    if (!userData.cartData[req.body.itemId]) {
      userData.cartData[req.body.itemId] = {}; // Initialize as an object if not already
    }

    if (!userData.cartData[req.body.itemId][req.body.size]) {
      userData.cartData[req.body.itemId][req.body.size] = 0; // Initialize size quantity to 0 if it doesn't exist
    }

    userData.cartData[req.body.itemId][req.body.size] += 1; // Increment the quantity for the specified size

    await User.findOneAndUpdate(
      { _id: req.user.id },
      { cartData: userData.cartData }
    );
    res.send({ message: "Added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//creating endpoint for removing product from cartData
app.post("/removefromcart", fetchUser, async (req, res) => {
  try {
    const { itemId, size } = req.body;
    if (!itemId || !size) {
      return res.status(400).send({ message: "Item ID and size are required" });
    }

    let userData = await User.findOne({ _id: req.user.id });

    if (userData.cartData[itemId] && userData.cartData[itemId][size]) {
      userData.cartData[itemId][size] -= 1;

      if (userData.cartData[itemId][size] <= 0) {
        delete userData.cartData[itemId][size];
        if (Object.keys(userData.cartData[itemId]).length === 0) {
          delete userData.cartData[itemId];
        }
      }

      await User.findOneAndUpdate(
        { _id: req.user.id },
        { cartData: userData.cartData }
      );
      return res.send({ message: "Removed" });
    } else {
      return res
        .status(400)
        .send({ message: "Item not in cart or quantity is zero" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get("/product/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//creating endpoint for removing product from cartData
app.post("/removefromcart", fetchUser, async (req, res) => {
  try {
    console.log("removed", req.body.itemId);
    let userData = await User.findOne({ _id: req.user.id });

    if (
      userData.cartData[req.body.itemId] &&
      userData.cartData[req.body.itemId] > 0
    ) {
      userData.cartData[req.body.itemId] -= 1;

      if (userData.cartData[req.body.itemId] === 0) {
        delete userData.cartData[req.body.itemId];
      }

      await User.findOneAndUpdate(
        { _id: req.user.id },
        { cartData: userData.cartData }
      );
      res.send({ message: "Removed" });
    } else {
      res.status(400).send({ message: "Item not in cart or quantity is zero" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to fetch cart data
app.get("/cart", fetchUser, async (req, res) => {
  try {
    let userData = await User.findOne({ _id: req.user.id });
    if (!userData) {
      return res.status(404).send({ message: "User not found" });
    }
    console.log(userData.cartData)
    res.json(userData.cartData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/createorder", async (req, res) => {
  const { products, address, guestName, cityId, areaId, phoneNumber, totalAmount } = req.body;
  try {
    if (!tokenData || isTokenExpired(tokenData.expires)) {
      // Fetch new token
      tokenData = await fetchToken();
    }
    const t = await fetchTrackingNumber(tokenData.Token);
    let lastOrder = await Order.findOne().sort({ orderId: -1 });
    let orderId = lastOrder ? lastOrder.orderId + 1 : 1;

    const convertedProducts = await Promise.all(
      products.map(async (product) => {
        let productDetails = await Product.findById(product.productId);
        if (!productDetails) {
          throw new Error(`Product with id ${product.productId} not found`);
        }

        // Find the size and update its quantity
        const sizeDetails = productDetails.sizes.find(
          (size) => size.size === product.size
        );
        if (!sizeDetails) {
          throw new Error(
            `Size ${product.size} not found for product ${productDetails.name}`
          );
        }

        sizeDetails.quantity -= product.quantity;
        if (sizeDetails.quantity < 0) {
          res.status(400).json({
            success: false,
            message: `Product ${productDetails.name} with size ${product.size} is out of stock`,
          });
          return null; // Return null to stop further processing in the map
        }

        await productDetails.save();

        return {
          productId: productDetails._id,
          name: productDetails.name,
          quantity: product.quantity,
          size: product.size,
        };
      })
    );

    if (convertedProducts.includes(null)) {
      return;
    }
    const shipmentData = {
      ClientAddress: address,
      ClientAreaID: areaId,
      ClientCityID: cityId,
      ClientName: guestName,
      ClientPhone: phoneNumber,
      ShipmentTotal: totalAmount ,
      ShipmentTrackingNo: t,
      qrAltId: "",
      ShipmentTypeID: 5, // Example shipment type ID
      ClientPhone2: "00000000",
      Alert: "ممنوع القياس منعا باتا ويتحمل مسؤولية القياس الموزع في حال عدم التبليغ",
      Remarks: "Remarks Example",
      IsReturn: false,
      ShipmentContains: JSON.stringify(convertedProducts)
    };
console.log(shipmentData)
    createShipment(shipmentData, tokenData.Token);
    const newOrderData = {
      orderId,
      products: convertedProducts,
      totalAmount,
      address,
      phoneNumber,
      clientName: guestName || "Guest",
    };

    if (req.user) {
      newOrderData.userId = new mongoose.Types.ObjectId(req.user.id);
      await User.findOneAndUpdate({ _id: req.user.id }, { cartData: {} });
    }

    const newOrder = new Order(newOrderData);
    await newOrder.save();

    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    if (!res.headersSent) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error", error });
    }
  }
});



app.get("/allorders", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate({
        path: "products.productId",
        select: "name price",
      });

    if (!orders || orders.length === 0) {
      console.error("No orders found");
      return res
        .status(404)
        .json({ success: false, message: "No orders found" });
    }

    const ordersWithDetails = orders.map((order) => {
      const validProducts = order.products.filter((product) => {
        if (!product.productId) {
          console.error(`Invalid product reference in order ${order.orderId}`);
        }
        return product.productId;
      });

      return {
        ...order.toObject(),
        products: validProducts.map((product) => ({
          ...product,
          name: product.productId ? product.productId.name : "Unknown",
          size: product.size,
          quantity: product.quantity,
        })),
        userName: order.userId ? order.userId.name : order.clientName,
        userEmail: order.userId ? order.userId.email : "N/A",
      };
    });

    console.log("Orders with details:", ordersWithDetails);
    res.status(200).json(ordersWithDetails);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// app.post('/createorder', fetchUser, async (req, res) => {
//     const { products, totalAmount, address  } = req.body;

//     try {
//         console.log("Received products:", products);

//         let lastOrder = await Order.findOne().sort({ orderId: -1 });
//         let orderId = lastOrder ? lastOrder.orderId + 1 : 1;

//         const convertedProducts = await Promise.all(products.map(async (product) => {
//             let productDetails = await Product.findById(product.productId);
//             if (!productDetails) {
//                 throw new Error(`Product with id ${product.productId} not found`);
//             }
//             return {
//                 productId: productDetails._id,
//                 name: productDetails.name,
//                 quantity: product.quantity,
//                 size: product.size
//             };
//         }));

//         console.log("Converted products:", convertedProducts);

//         const newOrder = new Order({
//             orderId,
//             userId: new mongoose.Types.ObjectId(req.user.id),
//             products: convertedProducts,
//             totalAmount,
//             address
//         });

//         await newOrder.save();
//         await User.findOneAndUpdate(
//             { _id: req.user.id },
//             { cartData: {} }
//         );
//         res.status(201).json({ success: true, order: newOrder });
//     } catch (error) {
//         console.error("Error creating order:", error);
//         res.status(500).json({ success: false, message: 'Internal Server Error', error });
//     }
// });
// app.get('/allorders', async (req, res) => {
//     try {
//         const orders = await Order.find()
//             .populate('userId', 'name email')
//             .populate({
//                 path: 'products.productId',
//                 select: 'name price'
//             });

//         const ordersWithDetails = orders.map(order => ({
//             ...order.toObject(),
//             products: order.products.map(product => ({
//                 ...product,
//                 name: product.productId ? product.productId.name : 'Unknown',  // تضمين اسم المنتج
//                 size: product.size,
//                 quantity: product.quantity,

//             }))
//         }));

//         console.log("Orders with details:", ordersWithDetails);
//         res.status(200).json(ordersWithDetails);
//     } catch (error) {
//         console.error("Error fetching orders:", error);
//         res.status(500).json({ success: false, error: "Internal Server Error" });
//     }
// });

//The code starts the Express.js server on port 4000, and checks whether the server started successfully or if there is an error.
app.listen(port, (error) => {
  if (!error) {
    console.log("Server is running on port " + port);
  } else {
    console.log("Error :" + error);
  }
});
