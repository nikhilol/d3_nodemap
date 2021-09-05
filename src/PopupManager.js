import {createContext} from 'react'

export const PopupManager = createContext(null)

export function setPopupState(property, newValue, currentstate){
    console.log('Changing Popup state')
    let state = {...currentstate};
    state[property] = newValue;
    console.log('NEW POPUP STATE: ', state)
    return state;
}