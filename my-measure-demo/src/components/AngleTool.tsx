import React, { useEffect, useRef } from "react";
import { Draw, Modify } from "ol/interaction";
import VectorSource from "ol/source/Vector";
import { Map } from "ol";
import { Feature } from "ol";
import { LineString } from "ol/geom";
import { calculateAngle } from "../utils/geometryUtils";
import { Style, Stroke, Circle as CircleStyle, Fill } from "ol/style";

type Props = {
    map: Map;
    source: VectorSource;
    onAngleMeasure: (angle: number) => void;
    unit: "deg" | "rad";
};

const AngleTool: React.FC<Props> = ({ map, source, onAngleMeasure, unit }) => {
    const featuresRef = useRef<Feature<LineString>[]>([]);

    useEffect(() => {
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
            const feature = event.feature as Feature<LineString>;
            featuresRef.current.push(feature);

            if (featuresRef.current.length === 2) {
                const [f1, f2] = featuresRef.current;
                const angleDeg = calculateAngle(
                    f1.getGeometry()!,
                    f2.getGeometry()!, unit
                );
                const angle = unit === "rad" ? (angleDeg * Math.PI) / 180 : angleDeg;
                onAngleMeasure(angle);
            }
        });

        const modify = new Modify({ source });

        modify.on("modifyend", () => {
            if (featuresRef.current.length === 2) {
                const [f1, f2] = featuresRef.current;
                const angleDeg = calculateAngle(
                    f1.getGeometry()!,
                    f2.getGeometry()!, unit
                );
                const angle = unit === "rad" ? (angleDeg * Math.PI) / 180 : angleDeg;
                onAngleMeasure(angle);
            }
        });

        map.addInteraction(modify);

        return () => {
            map.removeInteraction(draw);
            map.removeInteraction(modify);
        };
    }, [map, source, unit, onAngleMeasure]);

    return null;
};

export default AngleTool;
