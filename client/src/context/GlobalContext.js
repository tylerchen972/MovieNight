import React, {createContext, useContext, useReducer, useEffect} from 'react';
import axios from 'axios';

const initialState = {
    user: null,
    fetchingUser: true,
    completeToDos: [],
    incompleteToDos: [],
}

const globalReducer = (state, action) => {
    switch (action.type) {
        case "SET_USER":
            return {
                ...state,
                user: action.payload,
                fetchingUser: false,
            };
        case "SET_COMPLETE_TODOS":
            return {
                ...state,
                completeToDos: action.payload
            };
        case "SET_INCOMPLETE_TODOS":
            return {
                ...state,
                incompleteToDos: action.payload
            };
        case "RESET_USER":
            return {
                ...state,
                user: null,
                completeToDos: [],
                incompleteToDos: [],
                fetchingUser: false,
            }
        default: 
        return state;
    }
}

export const GlobalContext = createContext(initialState);

export const GlobalProvider = (props) => {
    const [state, dispatch] = useReducer(globalReducer, initialState);

    useEffect(() => {
        getCurrentUser();
    }, [])

    const getCurrentUser = async() => {
        try {
            const res = await axios.get("api/auth/current");
            if(res.data) {
                const toDoRes = await axios.get("api/todos/current");
                if(toDoRes.data) {
                    dispatch({type: "SET_USER", payload: res.data});
                    dispatch({type: "SET_COMPLETE_TODOS", payload: toDoRes.data.complete});
                    dispatch({type: "SET_INCOMPLETE_TODOS", payload: toDoRes.data.incomplete});
                }
            }
            else {
                dispatch({type: "RESET_USER"});
            }
        }
        catch(error) {
            console.log(error);
            dispatch({type: "RESET_USER"});
        }
    }

    const logout = async () => {
        try {
            await axios.put("api/auth/logout");
            dispatch({type: "RESET_USER"});
        }
        catch(error) {
            console.log(error);
            dispatch({type: "RESET_USER"});
        }
    }
    const addToDo = (toDo) => {
        dispatch({type: "SET_INCOMPLETE_TODOS", payload: [toDo, ...state.incomplete]})
    }

    const toDoComplete = toDo => {
        dispatch({
            type: "SET_INCOMPLETE_TODOS",
            payload: state.incompleteToDos.filter((incompleteToDo) => incompleteToDo._id !== toDo._id)
        });
        dispatch({
            type: "SET_COMPLETE_TODOS",
            payload: [toDo, ...state.completeToDos]
        })
    }

    const toDoIncomplete = toDo => {
        dispatch({
            type: "SET_COMPLETE_TODOS",
            payload: state.completeToDos.filter((completeToDo) => completeToDo._id !== toDo._id)
        });

        const newIncompleteToDos = [toDo, ...state.incompleteToDos]
        dispatch({
            type: "SET_INCOMPLETE_TODOS",
            payload: newIncompleteToDos.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            )
        })
    }

    const value = {
        ...state,
        getCurrentUser,
        logout,
        addToDo,
        toDoComplete,
        toDoIncomplete
    }
    return (
        <GlobalContext.Provider value = {value}>{props.children}</GlobalContext.Provider>
    )
}

export function useGlobalContext() {
    return useContext(GlobalContext);
}