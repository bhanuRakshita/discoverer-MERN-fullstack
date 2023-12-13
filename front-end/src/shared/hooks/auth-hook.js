import React, { useState, useCallback, useEffect } from "react";

let logoutTimer ;

export const useAuth = () => {
    const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();

  const login = useCallback((uid, utoken, expirationDate) => {
    setToken(utoken);
    setUserId(uid);
    const tokenExpDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
      setTokenExpirationDate(tokenExpDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: utoken,
        expiration: tokenExpDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    localStorage.removeItem("userData");
  }, [setUserId]);

  useEffect(()=>{
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration));
    }
  }, [login]);

  return { token, userId, login, logout};
}

