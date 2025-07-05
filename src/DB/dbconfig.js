import mongoose from 'mongoose';

export default async function connectDB(){
    try {
        
        await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)        

    } catch (error) {
        console.log("Something went wrong : ", error?.message)
        process.exit(1)
    }
}
