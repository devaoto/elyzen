// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { MongoClient, MongoClientOptions } from 'mongodb';
import mongoose from 'mongoose';

const uri: string = process.env.MONGODB_URI ?? '';
const options: MongoClientOptions = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient> = new Promise((resolve) =>
  resolve(client)
);

if (!uri) {
  console.log('Please add your MongoDB URI to .env');
}

try {
  if (process.env.NODE_ENV === 'development') {
    if (!(global as any)._mongoClientPromise && uri) {
      client = new MongoClient(uri, options);
      (global as any)._mongoClientPromise = client.connect();
    }
    clientPromise = (global as any)._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
} catch (err) {
  console.log(err);
}

export const connectMongo = async (): Promise<void> => {
  if (!uri) return;
  try {
    await mongoose.connect(uri);
  } catch (err) {
    console.log(err);
  }
};

export default clientPromise;
