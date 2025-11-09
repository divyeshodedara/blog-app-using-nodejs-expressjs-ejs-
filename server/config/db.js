import mongoose from "mongoose";

const connectDB= async ()=>{
   try {
    const connect=await mongoose.connect(process.env.MONGO_URL)
    console.log(`mongodb connected successufully, host name : ${connect.connection.host}`);
   } catch (error) {
    console.log(error);
   }
}
export default connectDB