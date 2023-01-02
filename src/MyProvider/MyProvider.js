import React, { createContext, useEffect, useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { app } from "../firebase/firebase.config";

const auth = getAuth(app);
export const MyContext = createContext();

const MyProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState("");
  const [isRoleLoading, setIsRoleLoading] = useState(true);

  const provider = new GoogleAuthProvider();
  const googleSignIn = () => {
    return signInWithPopup(auth, provider);
  };
  const emailPasswordSignIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  const createUserWithEmail = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };
  const updateUserProfile = (userInfo) => {
    return updateProfile(auth.currentUser, userInfo);
  };
  const handleSignOutUser = () => {
    return signOut(auth);
  };
  useEffect(() => {
    const unSUbscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });
    return () => unSUbscribe();
  }, []);
  const info = {
    googleSignIn,
    emailPasswordSignIn,
    createUserWithEmail,
    updateUserProfile,
    handleSignOutUser,
    currentUser,
    role,
    setRole,
    isRoleLoading,
    setIsRoleLoading,
    isLoading,
  };
  return <MyContext.Provider value={info}>{children}</MyContext.Provider>;
};

export default MyProvider;
