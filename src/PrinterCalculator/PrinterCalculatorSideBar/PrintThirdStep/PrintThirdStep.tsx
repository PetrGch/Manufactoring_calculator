import React from "react";
import {Button, InputNumber} from "antd";

import {roundNumber} from "../../../utils/formatter";
import {PrinterCalculatorSideBarParameterState} from "../PrinterCalculatorSideBar";

import "./PrintThirdStep.less";

interface PrintThirdStepProps {
    parameters: PrinterCalculatorSideBarParameterState;
}

function PrintThirdStep(props: PrintThirdStepProps) {
    return (
        <div className="PrintThirdStep">
            <div className="PrintThirdStep__parameters">
                <strong>Amount:</strong>
                <InputNumber min={1} max={100} onChange={(value) => {console.log(value)}} defaultValue={1}/>
            </div>

            <div className="PrintThirdStep__parameters">
                <strong>Total price:</strong>
                <span>{roundNumber(0)} zloty</span>
            </div>

            <div className="PrintThirdStep__orderButton">
                <Button type="primary">Order</Button>
            </div>
        </div>
    )
}

export default PrintThirdStep;