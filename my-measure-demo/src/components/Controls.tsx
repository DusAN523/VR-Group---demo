import React from "react";

interface ControlsProps {
    distance: number;
    azimuth: number;
    angle: number;
    units: { length: "km" | "mi"; angle: "deg" | "rad" };
    onUnitChange: (type: "length" | "angle", value: string) => void;
    onDistanceChange: (value: number) => void;
    onAzimuthChange: (value: number) => void;
    onAngleChange: (value: number) => void;
}

const Controls: React.FC<ControlsProps> = ({
    distance,
    azimuth,
    angle,
    units,
    onUnitChange,
    onDistanceChange,
    onAzimuthChange,
    onAngleChange,
}) => {
    const roundToTwoDecimalPlaces = (value: number) => {
        return parseFloat(value.toFixed(2));
    };

    const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (!isNaN(value)) {
            onDistanceChange(roundToTwoDecimalPlaces(value));
        }
    };

    const handleAzimuthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (!isNaN(value)) {
            onAzimuthChange(roundToTwoDecimalPlaces(value));
        }
    };

    const handleAngleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (!isNaN(value)) {
            onAngleChange(roundToTwoDecimalPlaces(value));
        }
    };

    const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>, type: "length" | "angle") => {
        onUnitChange(type, e.target.value);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: '8px' }}>
            <div>
                <label>
                    Distance:
                    <input
                        type="number"
                        value={distance.toFixed(2)}
                        onChange={handleDistanceChange}
                        step="any"
                    />
                    <select value={units.length} onChange={(e) => handleUnitChange(e, "length")}>
                        <option value="km">km</option>
                        <option value="mi">mi</option>
                    </select>
                </label>
            </div>
            <div>
                <label>
                    Azimuth:
                    <input
                        type="number"
                        value={azimuth.toFixed(2)}
                        onChange={handleAzimuthChange}
                        step="any"
                    />
                </label>
            </div>
            <div>
                <label>
                    Angle:
                    <input
                        type="number"
                        value={angle.toFixed(2)}
                        onChange={handleAngleChange}
                        step="any"
                    />
                    <select value={units.angle} onChange={(e) => handleUnitChange(e, "angle")}>
                        <option value="deg">deg</option>
                        <option value="rad">rad</option>
                    </select>
                </label>
            </div>
        </div>
    );
};

export default Controls;
