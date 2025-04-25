import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { fromLonLat } from "ol/proj";
import { Modify } from "ol/interaction";

import DistanceTool from "./components/DistanceTool";
import AngleTool from "./components/AngleTool";
import Controls from "./components/Controls";

const App: React.FC = () => {
  const mapElement = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);

  const [distance, setDistance] = useState(0);
  const [azimuth, setAzimuth] = useState(0);
  const [angle, setAngle] = useState(0);
  const [units, setUnits] = useState({
    length: "km" as "km" | "mi",
    angle: "deg" as "deg" | "rad",
  });

  const vectorSource = useRef(new VectorSource()).current;
  const vectorLayer = useRef(new VectorLayer({ source: vectorSource })).current;

  useEffect(() => {
    if (!mapElement.current) return;

    const olMap = new Map({
      target: mapElement.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([16.6068, 49.1951]), // Brno
        zoom: 13,
      }),
    });

    const modify = new Modify({ source: vectorSource });
    olMap.addInteraction(modify);

    setMap(olMap);

    return () => {
      olMap.setTarget(undefined);
    };
  }, [vectorSource, vectorLayer]);

  const handleMeasure = (length: number, azimuth: number) => {
    setDistance(Number(length.toFixed(2)));
    setAzimuth(Number(azimuth.toFixed(2)));
    setAngle(0); // reset angle when doing distance measure
  };

  const handleAngle = (angleValue: number) => {
    setAngle(Number(angleValue.toFixed(2)));
    setDistance(0); // reset distance when doing angle measure
    setAzimuth(0);
  };

  const handleUnitChange = (type: "length" | "angle", value: string) => {
    setUnits((prev) => ({ ...prev, [type]: value as any }));
  };

  const handleClear = () => {
    vectorSource.clear();
    setDistance(0);
    setAzimuth(0);
    setAngle(0);
  };

  return (
    <div>
      <div ref={mapElement} style={{ height: "100vh", width: "100%" }} />

      {map && (
        <>
          <DistanceTool
            map={map}
            source={vectorSource}
            onMeasure={handleMeasure}
            unit={units.length}
          />
          <AngleTool
            map={map}
            source={vectorSource}
            onAngleMeasure={handleAngle}
            unit={units.angle}
          />
        </>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          top: 0,
          right: 0,
          height: "100%",
          width: "300px",
          zIndex: 1000,
          backgroundColor: "white",
          padding: "1rem",
          boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        }}
      >
        <Controls
          distance={distance}
          azimuth={azimuth}
          angle={angle}
          units={units}
          onUnitChange={handleUnitChange}
        />
        <button onClick={handleClear} style={{ marginTop: "10px" }}>
          Clear lines
        </button>
      </div>
    </div>
  );
};

export default App;
