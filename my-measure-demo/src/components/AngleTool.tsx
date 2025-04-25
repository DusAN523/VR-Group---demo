import React, { useEffect } from "react";
import { Draw } from "ol/interaction";
import { LineString } from "ol/geom";
import { Map } from "ol";
import { calculateAngle } from "../utils/geometryUtils";
import { Style, Stroke, Circle as CircleStyle, Fill } from "ol/style";
import VectorSource from "ol/source/Vector";

type Props = {
    map: Map;
    source: VectorSource;
    onAngleMeasure: (angle: number) => void;
    unit: "deg" | "rad";
};

const AngleTool: React.FC<Props> = ({ map, source, onAngleMeasure, unit }) => {
    useEffect(() => {
        let tempLines: LineString[] = [];

        const draw = new Draw({
            source,
            type: "LineString",
            maxPoints: 2,
            style: new Style({
                stroke: new Stroke({
                    color: "rgba(255, 0, 0, 0.6)",
                    width: 3,
                }),
                image: new CircleStyle({
                    radius: 5,
                    fill: new Fill({ color: "red" }),
                    stroke: new Stroke({ color: "white", width: 2 }),
                }),
            }),
        });

        map.addInteraction(draw);

        draw.on("drawend", (event) => {
            const line = event.feature.getGeometry() as LineString;
            tempLines.push(line);
            if (tempLines.length === 2) {
                const angleDeg = calculateAngle(tempLines[0], tempLines[1]);
                const angle = unit === "rad" ? (angleDeg * Math.PI) / 180 : angleDeg;
                onAngleMeasure(angle);
                tempLines = []; // reset after angle calculated
            }
        });

        return () => {
            map.removeInteraction(draw);
        };
    }, [map, source, unit, onAngleMeasure]);

    return null;
};

export default AngleTool;
