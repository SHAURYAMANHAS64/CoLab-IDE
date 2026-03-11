import React , { createContext, useState , useContext } from "react";

export const userContext = createContext();
export const UserContext = userContext;

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <userContext.Provider value={{ user, setUser }}>
      {children}
    </userContext.Provider>
  );
};
