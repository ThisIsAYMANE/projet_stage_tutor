import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as bcrypt from "bcryptjs";

admin.initializeApp();
const db = admin.firestore();

export const registerUser = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: "Missing fields" });
    return;
  }

  try {
    // Check if user already exists
    const usersRef = db.collection("users");
    const existing = await usersRef.where("email", "==", email).get();
    if (!existing.empty) {
      res.status(409).json({ error: "Email already in use" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user document
    const now = admin.firestore.FieldValue.serverTimestamp();
    const userDoc = {
      email,
      password: hashedPassword,
      Name: name,
      createdAt: now,
      updatedAt: now,
      profilePicture: "",
      userType: "student",
      isTutor: false,
    };

    const newUserRef = await usersRef.add(userDoc);

    res.status(201).json({ userId: newUserRef.id });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});