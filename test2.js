import { PaperSize, Orientation } from 'penplot';
import { polylinesToSVG } from 'penplot/util/svg';
import { randomFloat, setSeed } from 'penplot/util/random';
import newArray from 'new-array';
import triangulate from 'delaunay-triangulate';

export const orientation = Orientation.LANDSCAPE;
export const dimensions = PaperSize.SQUARE_POSTER;

// Uncomment this for predictable randomness on each run
// setSeed(16);

const debug = false;

export default function createPlot (context, dimensions) {
  const [ width, height ] = dimensions;

  const pointCount = 1000;
  const positions = newArray(pointCount).map(() => {
    // Margin from print edge in centimeters
    const margin = 1;
    // Return a random 2D point inset by this margin
    return [
      randomFloat(Math.sin(margin),width - Math.sin(margin)),
      randomFloat(margin, height - margin)
    ];
  });
  function square (x, y, size){
    // Define rectangle vertices
    const path = [
      [ x - size, y - size ],
      [ x + size, y - size ],
      [ x + size, y + size ],
      [ x - size, y + size ]
    ];
    // Close the path
    path.push(path[0]);
    return path;
  };

  const cells = triangulate(positions);

  const lines = cells.map(cell => {
    // Get vertices for this cell
    const triangle = cell.map(i => positions[i]);
    // Close the path
    triangle.push(triangle[0]);
    return triangle;
  });

  return {
    draw,
    print,
    square,
    background: 'white'
  };

  function draw () {
    lines.forEach(points => {
      context.beginPath();
      points.forEach(p => context.square(p[0], p[1],10));
      context.stroke();
    });

    // Turn on debugging if you want to see the random points
    if (debug) {
      positions.forEach(p => {
        context.beginPath();
        context.arc(p[0], p[1], 0.01, 0, Math.PI * 2);
        context.strokeStyle = 'blue';
        context.stroke();
      });
    }
  }

  function print () {
    return polylinesToSVG(lines, {
      dimensions
    });
  }
}