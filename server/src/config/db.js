import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/corner';

    try {
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('MongoDB Connected');
        return;
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        console.warn('Falling back to in-memory MongoDB for local development.');
    }

    try {
        mongoServer = await MongoMemoryServer.create();
        const memoryUri = mongoServer.getUri();
        await mongoose.connect(memoryUri);
        console.log('MongoDB in-memory fallback started');
    } catch (err) {
        console.error('Unable to start in-memory MongoDB:', err.message);
        process.exit(1);
    }
};

export default connectDB;
