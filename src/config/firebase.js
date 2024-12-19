// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, setDoc, doc, collection, query, where, getDocs } from "firebase/firestore";
import { useContext } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCEuBou4HnlwewDR7Df_EBE8Kb8V-rQw2k",
    authDomain: "linkup-c94af.firebaseapp.com",
    projectId: "linkup-c94af",
    storageBucket: "linkup-c94af.firebasestorage.app",
    messagingSenderId: "857642121978",
    appId: "1:857642121978:web:55a3428e7878a23a36a743"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username, email, password) =>
{
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;

        // Create user document in Firestore
        await setDoc(doc(db, "users", user.uid), {
            id: user.uid,
            username: username.toLowerCase(),
            email,
            name: "",
            avatar: "",
            bio: "Hey, I am using Linkup",
            lastSeen: Date.now(),
        });

        // Create chats document for the user
        await setDoc(doc(db, "chats", user.uid), {
            chatsData: []
        });
        toast.success("Account created successfully!");

        return user; // Optionally return the user object
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
        throw error; // Re-throw the error for handling in the calling function
    }
}

const login = async (email, password) =>
{
    try {

        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Login Successfull !!!");
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
        throw error;
    }
}
const logout = async () =>
{
    try {
        await signOut(auth);
        toast.success("Logout Successfully !!!");


    } catch (error) {
        toast.error(error.code.split('/')[1].split('-').join(" "));
        throw error;
    }
}

const resetPass = async (email) =>
{
    if (!email) {
        toast.error("Enter your email");
        return null;
    }
    try {
        const userRef = collection(db, 'users');
        const q = query(userRef, where("email", "==", email));
        const querySnap = await getDocs(q);
        if (!querySnap.empty) {
            await sendPasswordResetEmail(auth, email);
            toast.success("ResetEmail Sent")

        }
        else {
            toast.error("Email not found")
        }
    } catch (error) {
        toast.error(error.message);
    }
}
export { signup, login, logout, auth, db,resetPass };