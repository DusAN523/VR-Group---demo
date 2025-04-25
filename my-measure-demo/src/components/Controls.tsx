// src/components/Controls.tsx
import React from 'react';

interface ControlsProps {
    distance: number;
    azimuth: number;
    angle: number;
    units: { length: string; angle: string };
    onUnitChange: (type: 'length' | 'angle', value: string) => void;
}

const Controls: React.FC<ControlsProps> = ({
    distance,
    azimuth,
    angle,
    units,
    onUnitChange,
}) => {
    return (
        <div className="controls">
            <div>
                <label>
                    Vzdialenosť ({units.length}):
                    <input type="text" value={distance} disabled />
                </label>
            </div>
            <div>
                <label>
                    Azimut ({units.length}):
                    <input type="text" value={azimuth} disabled />
                </label>
            </div>
            <div>
                <label>
                    Uhol ({units.angle}):
                    <input type="text" value={angle} disabled />
                </label>
            </div>
            <div>
                <label>
                    Jednotka vzdialenosti:
                    <select value={units.length} onChange={(e) => onUnitChange('length', e.target.value)}>
                        <option value="km">Kilometre</option>
                        <option value="mi">Míle</option>
                    </select>
                </label>
            </div>
            <div>
                <label>
                    Jednotka uhla:
                    <select value={units.angle} onChange={(e) => onUnitChange('angle', e.target.value)}>
                        <option value="deg">Stupne</option>
                        <option value="rad">Radiany</option>
                    </select>
                </label>
            </div>
        </div>
    );
};

export default Controls;
