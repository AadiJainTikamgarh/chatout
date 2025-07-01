import mongoose from 'mongoose';

export default async function connectDB(){
    try {
        
        const connection = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)

        connection.on('connect', () => {
            console.log("MongoDB Connected Successfully!")
        })

        connection.on('error', (err) => {
            console.log("Failed in connecting to db : ", err)
            process.exit()
        })

    } catch (error) {
        console.log("Something went wrong : ", error?.message)
        process.exit(1)
    }
}
