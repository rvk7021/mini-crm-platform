import mongoose from 'mongoose';
const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_DB_URL)
        console.log(`Database Connected Successfully`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}
export default connectDB;
