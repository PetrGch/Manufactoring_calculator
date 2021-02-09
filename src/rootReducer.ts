import {combineReducers, createSlice, PayloadAction} from '@reduxjs/toolkit'

export interface CurrentDisplayState {
    count: number;
}

const initialState: CurrentDisplayState = {
    count: 0,
};

const counter = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increase(state: CurrentDisplayState, action: PayloadAction<number>) {
            state.count = ++state.count;
        },
        decrease(state, action: PayloadAction<number>) {
            state.count = --state.count;
        },
    }
})

export const {
    decrease,
    increase,
} = counter.actions

const rootReducer = combineReducers({
    counter: counter.reducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer