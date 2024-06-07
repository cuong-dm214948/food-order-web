import React, {Children, createContext, useContext,useReducer} from "react";
import { initialState } from "./initialState";

export const StateContext = createContext();

export const StateProvider = ({reducer, initialState, children}) =>{
    <StateContext.Provider value = {useReducer(reducer, initialState)}>
        {children}
    </StateContext.Provider>
}

export const useStateValue = () => useContext(StateContext);
