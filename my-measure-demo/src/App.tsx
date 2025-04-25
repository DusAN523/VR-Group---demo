import React, { useRef, useState, useEffect } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { fromLonLat } from "ol/proj";
import { Modify } from "ol/interaction";
import { LineString } from "ol/geom";
import { Feature } from "ol";
import DistanceTool from "./components/DistanceTool";
import AngleTool from "./components/AngleTool";
import Controls from "./components/Controls";
import { calculateAngle, calculateAzimuth, calculateLength } from "./utils/geometryUtils";

const vectorSource = new VectorSource();
const vectorLayer = new VectorLayer({ source: vectorSource });

const App: React.FC = () => {
  const [map, setMap] = useState<Map | null>(null);
  const [distance, setDistance] = useState(0);
  const [azimuth, setAzimuth] = useState(0);
  const [angle, setAngle] = useState(0);
  const [units, setUnits] = useState({ length: "km" as "km" | "mi", angle: "deg" as "deg" | "rad" });

  const mapElement = useRef<HTMLDivElement>(null);
  const lineFeatureRef = useRef<Feature | null>(null);
  const modifyInteractionRef = useRef<Modify | null>(null);

  const angleLinesRef = useRef<LineString[]>([]);

  useEffect(() => {
    if (!mapElement.current) return;

    const olMap = new Map({
      target: mapElement.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([16.6068, 49.1951]),
        zoom: 13,
      }),
    });

    setMap(olMap);
    return () => olMap.setTarget(undefined);
  }, []);

  useEffect(() => {
    calculateAndUpdateValues();
  }, [units, distance, azimuth]);

  const calculateAndUpdateValues = () => {
    if (angleLinesRef.current.length < 2) return;

    const [firstLine, secondLine] = angleLinesRef.current;

    const length = calculateLength(secondLine, units.length);
    const azimuth = calculateAzimuth(secondLine);
    const angle = calculateAngle(firstLine, secondLine, units.angle);

    setDistance(length);
    setAzimuth(azimuth);
    setAngle(angle);
  };

  const handleUnitChange = (type: "length" | "angle", value: string) => {
    setUnits((prev) => ({ ...prev, [type]: value as any }));
  };

  const handleClear = () => {
    vectorSource.clear();
    setDistance(0);
    setAzimuth(0);
    setAngle(0);
    if (modifyInteractionRef.current && map) {
      map.removeInteraction(modifyInteractionRef.current);
    }
    angleLinesRef.current = [];
  };

  const handleModifySetup = (feature: Feature) => {
    if (!map) return;

    if (modifyInteractionRef.current) {
      map.removeInteraction(modifyInteractionRef.current);
    }

    const modifyInteraction = new Modify({ source: vectorSource });
    map.addInteraction(modifyInteraction);
    modifyInteractionRef.current = modifyInteraction;

    modifyInteraction.on("modifyend", (event) => {
      const modifiedLine = event.features.getArray()[0].getGeometry() as LineString;

      if (angleLinesRef.current.length === 1) {
        angleLinesRef.current[1] = modifiedLine;
      } else {
        if (JSON.stringify(angleLinesRef.current[0].getCoordinates()) === JSON.stringify(modifiedLine.getCoordinates())) {
          angleLinesRef.current[0] = modifiedLine;
        } else {
          angleLinesRef.current[1] = modifiedLine;
        }
      }
      calculateAndUpdateValues();
    });

    if (angleLinesRef.current.length === 0) {
      angleLinesRef.current = [feature.getGeometry() as LineString];
    } else {
      angleLinesRef.current[1] = feature.getGeometry() as LineString;
    }

    lineFeatureRef.current = feature;
  };

  const createLineFromInput = () => {
    if (!map || distance <= 0 || azimuth < 0) return;

    const start = fromLonLat([16.6068, 49.1951]);
    const lengthInMeters = units.length === "km" ? distance * 1000 : distance * 1609.34;
    const angleRad = (azimuth * Math.PI) / 180;
    const endPointX = start[0] + lengthInMeters * Math.cos(angleRad);
    const endPointY = start[1] + lengthInMeters * Math.sin(angleRad);
    const line = new LineString([start, [endPointX, endPointY]]);

    vectorSource.clear();
    const feature = new Feature({ geometry: line });
    vectorSource.addFeature(feature);
    calculateAndUpdateValues();
    handleModifySetup(feature);
  };

  return (
    <div>
      <div ref={mapElement} style={{ height: "100vh", width: "100%" }} />
      {map && (
        <>
          <DistanceTool
            map={map}
            source={vectorSource}
            unit={units.length}
            onMeasure={(d, a) => {
              setDistance(d);
              setAzimuth(a);
            }}
            onDrawEnd={handleModifySetup}
          />
          <AngleTool
            map={map}
            source={vectorSource}
            unit={units.angle}
            onAngleMeasure={setAngle}
          />
        </>
      )}
      <div style={{ display: "flex", flexDirection: "column", position: "absolute", top: 0, right: 0, padding: '16px', gap: "12px", height: "100%", width: "300px", zIndex: 1000, backgroundColor: "white" }}>
        <Controls
          distance={distance}
          azimuth={azimuth}
          angle={angle}
          units={units}
          onUnitChange={handleUnitChange}
          onDistanceChange={setDistance}
          onAzimuthChange={setAzimuth}
          onAngleChange={setAngle}
        />
        <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
          <button className="button" onClick={handleClear}>Clear lines</button>
          <button onClick={createLineFromInput}>Create Line</button>
        </div>
      </div>
    </div>
  );
};

export default App;
