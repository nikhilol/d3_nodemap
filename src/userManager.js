import {createContext} from 'react'

export const UserManager = createContext(null)

export function setPopupState(property, newValue, currentstate){
    let state = {...currentstate};
    state[property] = newValue;
    console.log('NEW USER STATE: ', state)
    return state;
}