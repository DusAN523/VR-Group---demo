# **VR-Group---demo**  
**Demo project**

---

## **Step-by-step Installation**

1. **Clone the repository**:
   ```bash
   git clone https://github.com/DusAN523/VR-Group---demo.git
2. **Navigate to the project directory:**:
cd VR-Group---demo/my-measure-demo/
3. **Install dependencies:**:
npm install
4. **Start the development server:**:
npm start
This will start the app, and you can access it at http://localhost:3000.

## **Application Usage**
Once the app is running, here's how you can interact with it:

## **Map Interaction**
Right-click to set the first point: Right-click anywhere on the map to place the first point of the line.

Click and drag to determine direction: After the first point is set, click and hold the mouse button to drag and set the direction of the line.

Right-click again to place the second point: Right-click again to place the second point, which will draw a line between the two points.

## **Controls**
On the right side of the screen, you'll find a Control Panel with several options:

Clear Lines: This button clears all lines that have been drawn on the map.

Create Line: This option allows you to manually create a line by entering the Length and Azimuth values in the provided input fields.

## **How "Create Line" Works**
Input Length and Azimuth: In the Control Panel, enter the desired length (in kilometers or miles) and azimuth (angle in degrees).

Click "Create Line": After filling in the required fields, click on the Create Line button. The app will generate a line starting from a fixed point on the map (default starting point is at coordinates [16.6068, 49.1951]) using the given length and azimuth.

## **Map Navigation**
Move around the map: You can move around the map by clicking and dragging with the left mouse button.

## **Measuring Tools**
Distance: The app calculates and displays the length of the line between the two points.

Azimuth: The angle between the two points, measured in degrees.

Angle: If two lines are drawn, the angle between them is calculated.
