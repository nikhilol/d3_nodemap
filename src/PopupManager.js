import {createContext} from 'react'

export const PopupManager = createContext(null)

export function setPopupState(property, newValue, currentstate){
    let state = {...currentstate};
    state[property] = newValue;
    return state;
}