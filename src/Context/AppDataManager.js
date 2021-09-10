import {createContext} from 'react'

export const AppDataManager = createContext(null)

export function setDataState(property, newValue, currentstate){
    let state = {...currentstate};
    state[property] = newValue;
    return state;
}

export function setMultiDataState(newObject, oldObject){
    let state = {...oldObject, ...newObject};
    return state;
}