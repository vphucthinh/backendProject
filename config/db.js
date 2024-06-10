import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://foodproject:1234567890@cluster0.tfvzwht.mongodb.net/foodproject').then(()=>console.log("DB Connected"));
}