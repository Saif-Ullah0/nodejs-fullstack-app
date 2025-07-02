const connectToDatabase = require('../config/database');
const bcrypt = require('bcrypt');

const { ObjectId } = require('mongodb');

const COLLECTION_NAME = 'users';

async function getAllUsers() {
  try {
    const db = await connectToDatabase();
    const allUsers = await db.collection(COLLECTION_NAME).find({}).toArray();
    console.log('Found', allUsers.length, 'users');
    return allUsers;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const db = await connectToDatabase();
    const user = await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(userId) });
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    return user;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
}

async function getUserByEmail(email) {
  try {
    const db = await connectToDatabase();
    const user = await db.collection(COLLECTION_NAME).findOne({ email });
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }
    return user;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
}

async function addUser(userData) {
  try {
    const db = await connectToDatabase();
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      phone: userData.phone || '',
      city: userData.city || '',
      age: userData.age || '',
      role: userData.role || 'user',
      bio: userData.bio || '',
      createdAt: new Date(),
    };

    const result = await db.collection(COLLECTION_NAME).insertOne(newUser);
    console.log('Added user:', newUser.name, 'with ID:', result.insertedId);
    return { ...newUser, _id: result.insertedId };
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
}

async function updateUser(userId, updateData) {
  try {
    const db = await connectToDatabase();

    // Convert string to MongoDB ObjectId
    const objectId = new ObjectId(userId);

    const existingUser = await db.collection(COLLECTION_NAME).findOne({ _id: objectId });
    if (!existingUser) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const updatedFields = {
      ...updateData,
      updatedAt: new Date()
    };

    await db.collection(COLLECTION_NAME).updateOne(
      { _id: objectId },
      { $set: updatedFields }
    );

    const updatedUser = await db.collection(COLLECTION_NAME).findOne({ _id: objectId });
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error.message);
    throw error;
  }
}

async function deleteUser(userId) {
  try {
    const db = await connectToDatabase();

    const result = await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(userId) });

    if (result.deletedCount === 0) {
      throw new Error(`User with ID ${userId} not found`);
    }

    console.log('Deleted user with ID:', userId);
    return { message: `User ${userId} deleted successfully` };
  } catch (error) {
    console.error('Error deleting user:', error.message);
    throw error;
  }
}

module.exports = {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  getUserById
};
