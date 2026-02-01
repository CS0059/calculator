import { useState } from "react";
import "./App.css";

interface ButtonProps {
    label: string;
    onClick: () => void;
    type?: "primary" | "secondary";
    isDigit?: boolean;
    isOperator?: boolean;
    isEmpty?: boolean;
}

const Button = (props: ButtonProps) => {
    function handleClick() {
        props.onClick();
    }

    return (
        <button className={`button ${props.type} ${props.isEmpty ? "empty" : ""}`} onClick={handleClick}>
            {props.label}
        </button>
    );
};

const Display = (props: { value: string }) => {
    return <div className="display">{props.value}</div>;
};

function App() {
    const [value, setValue] = useState<string>("0");
    const [operator, setOperator] = useState<string | null>(null);
    const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);
    const [previousValue, setPreviousValue] = useState<number>(0);

    function handleDigit(digit: number) {
        if (waitingForOperand) {
            setValue(String(digit));
            setWaitingForOperand(false);
        } else {
            setValue(value === "0" ? String(digit) : value + digit);
        }
    }

    function handleOperator(op: string) {
        const inputValue = parseFloat(value);

        if (previousValue === 0) {
            setPreviousValue(inputValue);
        } else if (operator) {
            const currentValue = previousValue || 0;
            let newValue = currentValue;

            switch (operator) {
                case "+":
                    newValue = currentValue + inputValue;
                    break;
                case "−":
                    newValue = currentValue - inputValue;
                    break;
                case "×":
                    newValue = currentValue * inputValue;
                    break;
                case "÷":
                    newValue = inputValue !== 0 ? currentValue / inputValue : currentValue;
                    break;
            }

            setValue(String(newValue));
            setPreviousValue(newValue);
        }

        setOperator(op);
        setWaitingForOperand(true);
    }

    function handleEquals() {
        const inputValue = parseFloat(value);

        if (operator && previousValue !== 0) {
            let newValue = previousValue;

            switch (operator) {
                case "+":
                    newValue = previousValue + inputValue;
                    break;
                case "−":
                    newValue = previousValue - inputValue;
                    break;
                case "×":
                    newValue = previousValue * inputValue;
                    break;
                case "÷":
                    newValue = inputValue !== 0 ? previousValue / inputValue : previousValue;
                    break;
            }

            setValue(String(newValue));
            setPreviousValue(0);
            setOperator(null);
            setWaitingForOperand(true);
        }
    }

    function handleClear() {
        setValue("0");
        setOperator(null);
        setWaitingForOperand(false);
        setPreviousValue(0);
    }

    function handleDecimal() {
        if (waitingForOperand) {
            setValue("0.");
            setWaitingForOperand(false);
        } else if (value.indexOf(".") === -1) {
            setValue(value + ".");
        }
    }

    return (
        <div className="container">
            <Display value={value} />
            <div className="button-grid">
                <Button label="C" onClick={() => handleClear()} type="secondary" />
                <Button label="±" onClick={() => setValue(String(-parseFloat(value)))} type="secondary"/>
                <Button label="%" onClick={() => setValue(String(parseFloat(value) / 100))} type="secondary"/>
                <Button label="÷" onClick={() => handleOperator("÷")} isOperator type="secondary" />
                <Button label="7" onClick={() => handleDigit(7)} isDigit />
                <Button label="8" onClick={() => handleDigit(8)} isDigit />
                <Button label="9" onClick={() => handleDigit(9)} isDigit />
                <Button label="×" onClick={() => handleOperator("×")} isOperator type="secondary" />
                <Button label="4" onClick={() => handleDigit(4)} isDigit />
                <Button label="5" onClick={() => handleDigit(5)} isDigit />
                <Button label="6" onClick={() => handleDigit(6)} isDigit />
                <Button label="−" onClick={() => handleOperator("−")} isOperator type="secondary" />
                <Button label="1" onClick={() => handleDigit(1)} isDigit />
                <Button label="2" onClick={() => handleDigit(2)} isDigit />
                <Button label="3" onClick={() => handleDigit(3)} isDigit />
                <Button label="+" onClick={() => handleOperator("+")} isOperator type="secondary" />
                <Button isEmpty label="" onClick={() => {}} />
                <Button label="0" onClick={() => handleDigit(0)} isDigit />
                <Button label="." onClick={() => handleDecimal()} />
                <Button label="=" onClick={() => handleEquals()} type="primary" />
            </div>
        </div>
    );
}

export default App;
