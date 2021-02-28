import React, {useState} from "react";
import {Button, Dropdown, Menu} from "antd";
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import {MenuClickEventHandler, MenuInfo} from "rc-menu/lib/interface";
import {CirclePicker, ColorResult} from "react-color";
import {PRINTER_CALCULATOR_STEP} from "../PrinterCalculatorSideBar";
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
    selectedMaterial: string;
    selectedColor: string;
    selectedColors: string[];
}

const initialState: PrintSecondStepState = {
    selectedColor: "",
    isMaterialOpen: false,
    selectedColors: [],
    selectedMaterial: "Select material",
}

interface PrintSecondStepProps {
    onColorSet: (color: string) => void;
    setStepStatus: (step: PRINTER_CALCULATOR_STEP, stepState: boolean) => void;
    parameters: {
        width: number,
        height: number,
        depth: number,
        area: number,
    }
}

export default function PrintSecondStep(props: PrintSecondStepProps) {
    const [state, setState] = useState<PrintSecondStepState>(initialState);
    const { setStepStatus, onColorSet, parameters } = props;
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
                selectedMaterial: selectedMaterial.name,
                selectedColors: selectedMaterial.colors.map((color) => color.code),
            })
        }
    }

    const onColorSelected = (color: ColorResult, event: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            selectedColor: color.hex,
        })
        onColorSet(color.hex);
    }

    return (
        <div className="PrintSecondStep">
            <h3 className="PrintSecondStep__title">Model properties:</h3>

            <div className="PrintSecondStep__parameter">
                <strong>Dimension (mm):</strong>
                <span>{roundNumber(parameters.width)} x {roundNumber(parameters.height)} x {roundNumber(parameters.depth)}</span>
            </div>

            <div className="PrintSecondStep__parameter">
                <strong>Area (<span>mm&nbsp;&nbsp;</span>):</strong>
                <span>{roundNumber(parameters.area)}</span>
            </div>

            <div className="PrintSecondStep__parameter">
                <strong>Material:</strong>

                <Dropdown
                    overlay={<DropDownMenu onMaterialSelected={onMaterialSelected} />}
                    disabled={!isParameterExists}
                    onVisibleChange={onMaterialToggled}
                >
                    <Button>{state.selectedMaterial} {state.isMaterialOpen ? <UpOutlined/> : <DownOutlined/>}</Button>
                </Dropdown>
            </div>

            <div className="PrintSecondStep__parameter PrintSecondStep__parameter_center-false">
                <strong>Color:</strong>

                <div className="PrintSecondStep__parameterColor">
                    <CirclePicker colors={state.selectedColors} onChange={onColorSelected}/>
                </div>
                {/*<Dropdown overlay={<DropDownMenu/>} disabled={!isParameterExists}>*/}
                {/*    <Button>*/}
                {/*        Select color <DownOutlined />*/}
                {/*    </Button>*/}
                {/*</Dropdown>*/}
            </div>

        </div>
    );
}