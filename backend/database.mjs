// database.js
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://zaynassaf2001:mongoRawan2000@cluster0.0hiogxf.mongodb.net/', {
            useNewUrlParser: true,
            // useUnifiedTopology: true
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

export default connectDB;
//mongodb+srv://zaynassaf2001:vyQQdP34o46PqMYb@cluster0.0hiogxf.mongodb.net/