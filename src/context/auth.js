import React, { createContext, useReducer, useState } from 'react';
import jwtDecode from 'jwt-decode';

let initialState = { user: null };

// check if token is expired
if (localStorage.getItem('jwtToken')) {
  // decode the expiration that is encoded in the token
  const decodedToken = jwtDecode(localStorage.getItem('jwtToken'));

  // get milliseconds
  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem('jwtToken');
  } else {
    console.log(decodedToken);
    initialState.user = decodedToken;
  }
}

const AuthContext = createContext({
  user: null,
  login: (userData) => {},
  logout: () => {},
});

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    default:
      return state;
  }
};
const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function login(userData) {
    localStorage.setItem('jwtToken', userData.token);
    dispatch({ type: 'LOGIN', payload: userData });
  }

  function logout() {
    localStorage.removeItem('jwtToken');
    dispatch({ type: 'LOGOUT' });
  }

  return (
    <AuthContext.Provider
      value={{ ...state, isModalOpen, setIsModalOpen, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
