import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { setUser } from "../redux/auth";

const AuthGuard = () => {
  const [isLoading, setisLoading] = useState(true);
  const location = useLocation();
  const authState = useAppSelector((state) => state.auth);
  const isOnAuthPage = location.pathname.startsWith("/auth");

    const dispatch = useAppDispatch();
  useEffect(() => {
    if(!authState.user) {
        getUserFromLocalStorage();
    }
  }, [location.pathname, dispatch]);

  const getUserFromLocalStorage = () => {
    setisLoading(true);
    try {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (user) {
            dispatch(setUser(user));
        }
    } finally {
        setisLoading(false);
    }
  };

  if(isLoading) {
    return <div>Loading...</div>;
  }

  if(!authState.user && !isOnAuthPage) {
    return <Navigate to="/auth/login" state={{ from: location }} />;
  }

  if(authState.user && isOnAuthPage) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  return <Outlet />;
};

export default AuthGuard;
