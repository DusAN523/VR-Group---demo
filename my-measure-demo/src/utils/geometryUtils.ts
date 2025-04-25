import { getLength } from "ol/sphere";
import { LineString } from "ol/geom";

export function calculateLength(line: LineString, unit: "km" | "mi") {
  const length = getLength(line);
  return unit === "km" ? length / 1000 : length * 0.000621371;
}

export function calculateAzimuth(line: LineString): number {
  const coords = line.getCoordinates();
  if (coords.length < 2) return 0;

  const [x1, y1] = coords[0];
  const [x2, y2] = coords[1];
  const dx = x2 - x1;
  const dy = y2 - y1;
  const rad = Math.atan2(dx, dy);
  return (rad * 180) / Math.PI;
}

export function calculateAngle(line1: LineString, line2: LineString): number {
  const coords1 = line1.getCoordinates();
  const coords2 = line2.getCoordinates();

  if (coords1.length < 2 || coords2.length < 2) return 0;

  const shared = coords1[coords1.length - 1];
  const prev = coords1[coords1.length - 2];
  const next = coords2[1];

  const v1 = [prev[0] - shared[0], prev[1] - shared[1]];
  const v2 = [next[0] - shared[0], next[1] - shared[1]];

  const dot = v1[0] * v2[0] + v1[1] * v2[1];
  const mag1 = Math.hypot(v1[0], v1[1]);
  const mag2 = Math.hypot(v2[0], v2[1]);

  if (mag1 === 0 || mag2 === 0) return 0;

  const angleRad = Math.acos(dot / (mag1 * mag2));
  return (angleRad * 180) / Math.PI;
}
