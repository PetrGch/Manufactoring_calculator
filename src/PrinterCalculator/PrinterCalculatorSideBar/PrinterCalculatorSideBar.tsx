import React, {useState} from "react";
import {BufferGeometry} from "three";

import PrintFirstStep from "./PrintFirstStep/PrintFirstStep";
import PrintSecondStep from "./PrintSecondStep/PrintSecondStep";
import {getModelArea} from "../../utils/calculatorsUtils";
import PrintThirdStep from "./PrintThirdStep/PrintThirdStep";

import "./PrinterCalculatorSideBar.less";

export enum PRINTER_CALCULATOR_STEP {
    FIRST_STEP = "FIRST_STEP",
    SECOND_STEP = "SECOND_STEP",
}

interface PrinterCalculatorSideBarStepState {
    [PRINTER_CALCULATOR_STEP.FIRST_STEP]: boolean
    [PRINTER_CALCULATOR_STEP.SECOND_STEP]: boolean
}

export interface PrinterCalculatorSideBarParameterState {
    width: number,
    height: number,
    depth: number,
    area: number,
    selectedColor: string;
    selectedMaterial: string;
}

interface PrinterCalculatorSideBarProps {
    onColorSet: (color: string) => void;
    loadSTLGeometry: (path: string, loaded?: (geometry: BufferGeometry) => void, error?: (err: ErrorEvent) => void) => void;
}

export default function PrinterCalculatorSideBar(props: PrinterCalculatorSideBarProps) {
    const { loadSTLGeometry, onColorSet } = props;
    const [stepState, setStepState] = useState<PrinterCalculatorSideBarStepState>({
        [PRINTER_CALCULATOR_STEP.FIRST_STEP]: false,
        [PRINTER_CALCULATOR_STEP.SECOND_STEP]: false,
    });
    const [parameterState, setParameterState] = useState<PrinterCalculatorSideBarParameterState>({
        width: 0,
        height: 0,
        depth: 0,
        area: 0,
        selectedColor: "#ffffff",
        selectedMaterial: "abs"
    });

    const setStepStatus = (step: PRINTER_CALCULATOR_STEP, state: boolean) => {
        setStepState({
            ...stepState,
            [step]: state
        })
    }

    const onModelLoaded = (path: string) => {
        loadSTLGeometry(path, (geometry) => {
            geometry.computeBoundingBox();
            const boundingBox = geometry.boundingBox;

            setStepState({
                ...stepState,
                [PRINTER_CALCULATOR_STEP.FIRST_STEP]: true,
            })

            if (boundingBox) {
                const width = boundingBox.max.x - boundingBox.min.x;
                const height = boundingBox.max.z - boundingBox.min.z;
                const depth = boundingBox.max.y - boundingBox.min.y;

                setParameterState({
                    ...parameterState,
                    width,
                    height,
                    depth,
                    area: getModelArea(geometry),
                })
            }
        });
    }

    return (
        <div className="PrinterCalculatorSideBar">
            <div className="PrinterCalculatorSideBar__step">
                <PrintFirstStep
                    loadSTLGeometry={onModelLoaded}
                    setStepStatus={setStepStatus}
                />
            </div>

            <div className={`PrinterCalculatorSideBar__step PrinterCalculatorSideBar__step_topPadding PrinterCalculatorSideBar__step_valid-${stepState[PRINTER_CALCULATOR_STEP.FIRST_STEP]}`}>
                <PrintSecondStep
                    setStepStatus={setStepStatus}
                    parameters={parameterState}
                    onColorSet={onColorSet}
                    setParameters={setParameterState}
                />
            </div>

            <div className={`PrinterCalculatorSideBar__step PrinterCalculatorSideBar__step_topPadding PrinterCalculatorSideBar__step_valid-${stepState[PRINTER_CALCULATOR_STEP.SECOND_STEP]}`}>
                <PrintThirdStep
                    parameters={parameterState}
                />
            </div>
        </div>
    )
}