import { doc, getDoc, updateDoc } from "firebase/firestore";
import { createContext, useState } from "react";
import { auth, db } from "../config/firebase";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [userData, setUserData] = useState(null);
    const [chatData, setChatData] = useState(null);
    
    const loadUserData = async (uid) => {
        try {
            const userRef = doc(db, "users", uid);
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data();

            setUserData(userData);
            
            await updateDoc(userRef, {
                lastSeen: Date.now()
            });

            setInterval(async () => { 
                if (auth.currentUser) {
                    await updateDoc(userRef, {
                        lastSeen: Date.now()
                    });
                }
            }, 60000);
            
            return !!(userData.avatar && userData.name);
        } catch (error) {
            console.error("Error loading user data:", error);
            return false;
        }
    };

    const value = {
        userData,
        setUserData,
        chatData,
        setChatData,
        loadUserData,
    };

    return (
        <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
    );
};

export default AppContextProvider;

