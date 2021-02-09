import React from "react";
import {RootState} from "../rootReducer";
import {createSelector} from "@reduxjs/toolkit";
import CncCalculator from "../CncCalculator/CncCalculator";
import PrinterCalculator from "../PrinterCalculator/PrinterCalculator";

const counterState = (state: RootState) => {
    console.log("counterState", state)

    return state;
};

const counterSelector = createSelector(counterState, (counter) => {
    console.log("counterSelector", counter);
    return {
        count: counter.counter.count,
    }
})

function App() {
    return (
        <PrinterCalculator/>
    );
}

export default App;