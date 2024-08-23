import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true
    },
    password: {
      type: String,
    },
    cartData: {
      type: Object
    },
    isVerified: { 
      type: Boolean, 
      default: false 
    },
    confirmationToken: String,
    date: {
      type: Date,
      default: Date.now,
    }
  });
  
  
  
//mongoose.model(): This method is used to compile a Mongoose schema into a model. It takes two parameters:The first parameter is the singular name of the collection your model is for. In this case, it's 'User', which means Mongoose will look for (or create) a collection named 'users' (MongoDB automatically pluralizes collection names).The second parameter is the schema you want to use for this model. In this case, it's UserSchema, which is defined earlier in the code.
const User = mongoose.model('User', UserSchema);
export default User;
// // confirmationToken: {
//     type: String,
// },
// isConfirmed: {
//   type: Boolean,
//   default: false
// },