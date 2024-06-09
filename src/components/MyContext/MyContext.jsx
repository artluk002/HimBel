// MessageContext.js
import React, { createContext, useState } from 'react';

export const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [toggleState, setToggleState] = useState(false); // новое состояние
  const [orderToggleState, setOrderToggleState] = useState(false);
  const [registrationToggleState, setRegistrationToggleState] = useState(false);
  const [deletedProductsToggleState, setDeletedProductsToggleState] = useState(false);
  const toggle = () => {
    setToggleState(prevState => !prevState); // функция для переключения состояния
  };
  const orderToggle = () => {
    setOrderToggleState(prevState => !prevState);
  };
  const registrationToggle = () => {
    setRegistrationToggleState(prevState => !prevState);
  };
  const deletedProductsToggle = () => {
    setDeletedProductsToggleState(prevState => !prevState);
  };

  return (
    <MyContext.Provider value={{ toggleState, toggle , orderToggleState, orderToggle, registrationToggleState, registrationToggle, deletedProductsToggleState, deletedProductsToggle}}>
      {children}
    </MyContext.Provider>
  );
};
