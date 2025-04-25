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

export function calculateAngle(line1: LineString, line2: LineString, unit: "deg" | "rad"): number {
  const coords1 = line1.getCoordinates();
  const coords2 = line2.getCoordinates();

  if (coords1.length < 2 || coords2.length < 2) return 0;
  const shared = coords1.find(c1 =>
    coords2.some(c2 => c1[0] === c2[0] && c1[1] === c2[1])
  );

  if (!shared) return 0;

  const prev = coords1.find(c => c !== shared && !(c[0] === shared[0] && c[1] === shared[1]));
  const next = coords2.find(c => c !== shared && !(c[0] === shared[0] && c[1] === shared[1]));

  if (!prev || !next) return 0;

  const v1 = [prev[0] - shared[0], prev[1] - shared[1]];
  const v2 = [next[0] - shared[0], next[1] - shared[1]];

  const dot = v1[0] * v2[0] + v1[1] * v2[1];
  const mag1 = Math.hypot(v1[0], v1[1]);
  const mag2 = Math.hypot(v2[0], v2[1]);

  if (mag1 === 0 || mag2 === 0) return 0;

  const angleRad = Math.acos(dot / (mag1 * mag2));
  if (unit === "deg") {
    return (angleRad * 180) / Math.PI;
  }

  return angleRad;
}
