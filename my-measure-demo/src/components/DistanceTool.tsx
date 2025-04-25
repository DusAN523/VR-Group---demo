import React, { useEffect } from "react";
import { Draw } from "ol/interaction";
import { LineString } from "ol/geom";
import { Map } from "ol";
import { calculateAzimuth, calculateLength } from "../utils/geometryUtils";
import { Style, Stroke, Circle as CircleStyle, Fill } from "ol/style";
import VectorSource from "ol/source/Vector";

type Props = {
    map: Map;
    source: VectorSource;
    onMeasure: (length: number, azimuth: number) => void;
    unit: "km" | "mi";
};

const DistanceTool: React.FC<Props> = ({ map, source, onMeasure, unit }) => {
    useEffect(() => {
        const draw = new Draw({
            source,
            type: "LineString",
            maxPoints: 2,
            style: (feature, resolution) => {
                const styles = [];

                // Line style
                styles.push(
                    new Style({
                        stroke: new Stroke({
                            color: "rgba(0, 0, 255, 0.6)",
                            width: 3,
                        }),
                    })
                );

                // Circle (point) style
                const coordinates = (feature.getGeometry() as LineString).getCoordinates();
                for (const coord of coordinates) {
                    styles.push(
                        new Style({
                            image: new CircleStyle({
                                radius: 5,
                                fill: new Fill({ color: "blue" }),
                                stroke: new Stroke({ color: "white", width: 2 }),
                            }),
                            geometry: {
                                getCoordinates: () => coord,
                                getType: () => "Point",
                            } as any, // hacky trick to draw a point style for each vertex
                        })
                    );
                }

                return styles;
            },
        });

        map.addInteraction(draw);

        draw.on("drawend", (event) => {
            const line = event.feature.getGeometry() as LineString;
            const length = calculateLength(line, unit);
            const azimuth = calculateAzimuth(line);
            onMeasure(length, azimuth);
        });

        return () => {
            map.removeInteraction(draw);
        };
    }, [map, source, unit, onMeasure]);

    return null;
};

export default DistanceTool;
