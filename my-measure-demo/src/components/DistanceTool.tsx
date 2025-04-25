import React, { useEffect } from "react";
import { Draw } from "ol/interaction";
import VectorSource from "ol/source/Vector";
import { LineString, Geometry } from "ol/geom";
import { calculateAzimuth, calculateLength } from "../utils/geometryUtils";
import { Map } from "ol";
import { Feature } from "ol";
import { Style, Stroke, Circle as CircleStyle, Fill } from "ol/style";

type Props = {
    map: Map;
    source: VectorSource;
    onMeasure: (length: number, azimuth: number) => void;
    onDrawEnd?: (feature: Feature) => void;
    unit: "km" | "mi";
};

const DistanceTool: React.FC<Props> = ({ map, source, onMeasure, unit, onDrawEnd }) => {
    useEffect(() => {
        const draw = new Draw({
            source,
            type: "LineString",
            maxPoints: 2,
            style: new Style({
                stroke: new Stroke({
                    color: "rgba(0, 0, 255, 0.6)",
                    width: 3,

                }),
                image: new CircleStyle({
                    radius: 5,
                    fill: new Fill({ color: "blue" }),
                    stroke: new Stroke({ color: "white", width: 3 }),
                }),
            }),
        });

        map.addInteraction(draw);

        draw.on("drawend", (event) => {
            const feature = event.feature;
            const line = feature.getGeometry() as LineString;

            const simplifiedLine: Geometry = line.simplify(0.01);
            if (simplifiedLine instanceof LineString) {
                const length = calculateLength(simplifiedLine, unit);
                const azimuth = calculateAzimuth(simplifiedLine);
                onMeasure(length, azimuth);
                onDrawEnd?.(feature);
            }
        });

        return () => {
            map.removeInteraction(draw);
        };
    }, [map, source, unit, onMeasure, onDrawEnd]);

    return null;
};

export default DistanceTool;
