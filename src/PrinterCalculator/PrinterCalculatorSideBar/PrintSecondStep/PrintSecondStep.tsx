import React, {useEffect, useState} from "react";
import {Button, Dropdown, Menu} from "antd";
import {DownOutlined, UpOutlined} from '@ant-design/icons';
import {MenuClickEventHandler, MenuInfo} from "rc-menu/lib/interface";
import {CirclePicker, ColorResult} from "react-color";

import {PRINTER_CALCULATOR_STEP, PrinterCalculatorSideBarParameterState} from "../PrinterCalculatorSideBar";
import {roundNumber} from "../../../utils/formatter";
import materialConfig from "./materialConfig";

import "./PrintSecondStep.less";

function DropDownMenu({ onMaterialSelected }: { onMaterialSelected: MenuClickEventHandler }) {
    const menuItems = materialConfig.map((material) => (
        <Menu.Item key={material.id} disabled={material.disabled} >
            {material.name} - {material.cost} zloty
        </Menu.Item>
    ))

    return (
        <Menu onClick={onMaterialSelected}>
            {menuItems}
        </Menu>
    )
}

interface PrintSecondStepState {
    isMaterialOpen: boolean;
    selectedColors: string[];
}

const initialState: PrintSecondStepState = {
    isMaterialOpen: false,
    selectedColors: [],
}

interface PrintSecondStepProps {
    onColorSet: (color: string) => void;
    setParameters: (parameters: PrinterCalculatorSideBarParameterState) => void;
    setStepStatus: (step: PRINTER_CALCULATOR_STEP, stepState: boolean) => void;
    parameters: PrinterCalculatorSideBarParameterState;
}

export default function PrintSecondStep(props: PrintSecondStepProps) {
    const [state, setState] = useState<PrintSecondStepState>(initialState);
    const { setStepStatus, onColorSet, parameters, setParameters } = props;
    const isParameterExists = parameters.width && parameters.height && parameters.depth;

    const onMaterialToggled = (visible: boolean) => {
        setState({
            ...state,
            isMaterialOpen: visible,
        })
    }

    const onMaterialSelected = (info: MenuInfo) => {
        const selectedMaterial = materialConfig.find((material) => material.id === info.key);

        if (selectedMaterial) {
            setState({
                ...state,
                selectedColors: selectedMaterial.colors.map((color) => color.code),
            })

            setParameters({
                ...parameters,
                selectedMaterial: selectedMaterial.id,
            });
        }
    }

    const onColorSelected = (color: ColorResult, event: React.ChangeEvent<HTMLInputElement>) => {
        setParameters({
            ...parameters,
            selectedColor: color.hex,
        });
        onColorSet(color.hex);
    }

    const getMaterialById = (materialId: string) => {
        const selectedMaterial = materialConfig.find((material) => material.id === materialId);

        return selectedMaterial?.name || "";
    }

    const getColorsByMaterialId = (materialId: string) => {
        const selectedMaterial = materialConfig.find((material) => material.id === materialId);

        if (selectedMaterial && selectedMaterial.colors) {
            return selectedMaterial.colors.map((color) => color.code);
        }

        return [];
    }

    useEffect(() => {
        if (parameters.area) {
            setStepStatus(PRINTER_CALCULATOR_STEP.SECOND_STEP, true);
        }
    }, [parameters.width, parameters.height, parameters.depth])

    return (
        <div className="PrintSecondStep">
            <h3 className="PrintSecondStep__title">Model properties:</h3>

            <div className="PrintSecondStep__parameter">
                <strong>Dimension (mm):</strong>
                <span>{roundNumber(parameters.width)} x {roundNumber(parameters.height)} x {roundNumber(parameters.depth)}</span>
            </div>

            <div className="PrintSecondStep__parameter">
                <strong>Area (<span>mm&nbsp;&nbsp;</span>):</strong>
                <span>{roundNumber(parameters.area, "≈")}</span>
            </div>

            <div className="PrintSecondStep__parameter">
                <strong>Materials:</strong>

                <Dropdown
                    overlay={<DropDownMenu onMaterialSelected={onMaterialSelected} />}
                    disabled={!isParameterExists}
                    onVisibleChange={onMaterialToggled}
                >
                    <Button>{getMaterialById(parameters.selectedMaterial)} {state.isMaterialOpen ? <UpOutlined/> : <DownOutlined/>}</Button>
                </Dropdown>
            </div>

            <div className="PrintSecondStep__parameter PrintSecondStep__parameter_center-false">
                <strong>Colors:</strong>

                <div className="PrintSecondStep__parameterColor">
                    <CirclePicker colors={getColorsByMaterialId(parameters.selectedMaterial)} onChange={onColorSelected}/>
                </div>
            </div>
        </div>
    );
}