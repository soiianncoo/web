const db = require("../config/db");

// models/userModel.js

class User {
  static async getAll() {
    const usersSnapshot = await db.collection("users").get();
    const usersList = [];
    usersSnapshot.forEach((doc) => {
      usersList.push({ id: doc.id, ...doc.data() });
    });
    return usersList;
  }

  static async getById(id) {
    const userDoc = await db.collection("users").doc(id).get();
    if (!userDoc.exists) {
      throw new Error("User not found");
    }
    return { id: userDoc.id, ...userDoc.data() };
  }

  static async create(userData) {
    const newUserRef = await db.collection("users").add(userData);
    return { id: newUserRef.id, ...userData };
  }

  static async update(id, userData) {
    await db.collection("users").doc(id).update(userData);
    return { id, ...userData };
  }

  static async delete(id) {
    await db.collection("users").doc(id).delete();
    return { id };
  }
}

module.exports = User;
