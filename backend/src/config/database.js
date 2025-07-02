//const {MongoClient} = require('mongodb');
require('dotenv').config();
const {Pool} = require ('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});


pool.connect()
.then(() => {console.log('Connected to PostgreSQL database');})
.catch(err => {
    console.error('Error connecting to PostgreSQL database:', err);
});

module.exports = pool;

// let db = null;

// async function connectToDatabase() {
//     if(db){
//         console.log('Already connected to the database');
//         return db;
//     }
//     try{
//         const clinet = new MongoClient(process.env.MONGODB_URI);
//         await clinet.connect();
//         console.log('Connected to the database');

//         db = clinet.db(process.env.DB_NAME);
//         return db;
//     } catch (error) {
//         console.error('Error connecting to the database:', error);
//         throw error;    
//     }
// }

// module.exports = connectToDatabase;