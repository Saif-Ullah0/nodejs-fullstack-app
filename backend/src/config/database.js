const {MongoClient} = require('mongodb');
require('dotenv').config();

let db = null;

async function connectToDatabase() {
    if(db){
        console.log('Already connected to the database');
        return db;
    }
    try{
        const clinet = new MongoClient(process.env.MONGODB_URI);
        await clinet.connect();
        console.log('Connected to the database');

        db = clinet.db(process.env.DB_NAME);
        return db;
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;    
    }
}

module.exports = connectToDatabase;