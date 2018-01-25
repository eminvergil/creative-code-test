import { PaperSize, Orientation } from 'penplot';
import { randomFloat } from 'penplot/util/random';
import newArray from 'new-array';
import clustering from 'density-clustering';
import convexHull from 'convex-hull';

export const orientation = Orientation.LANDSCAPE;
export const dimensions = PaperSize.SQUARE_POSTER;

export default function createPlot (context, dimensions) {
  const [ width, height ] = dimensions;
  // A large point count will produce more defined results
  const pointCount = 4000;
  let points = newArray(pointCount).map(() => {
    const margin = 2;
    return [
      randomFloat(margin, width - margin),
      randomFloat(margin, width - margin)
    ];
  });
  // We will add to this over time
  const lines = [];
  // The N value for k-means clustering
  // Lower values will produce bigger chunks
  const clusterCount = 11;
  // Run our generative algorithm at 30 FPS
  setInterval(update, 1000 / 30);
  return {
    draw,
    background: 'white',
    animate: true // start a render loop
  };
  function update () {
    if(points.length <= clusterCount) return;

    const scan = new clustering.KMEANS();
    const clusters = scan.run(points,clusterCount)
      .filter(c => c.length >= 3);
    
    if(clusters.length === 0) return;
    clusters.sort((a,b) => a.length -b.length);

    const cluster = clusters[0];
    const positions = cluster.map(i => points[i]);

    const edges = convexHull(positions);

    if(edges.length <= 2) return;

    let path = edges.map(c => positions[c[0]]);
    path.push(path[0]);

    lines.push(path);

    points = points.filter(p => !positions.includes(p));    
  }
  function draw() {
    lines.forEach(points => {
      context.beginPath();
      points.forEach(p => rect(p[0],p[1],4));
      points.forEach(p => context.lineTo(p[0],p[1]));
      context.stroke();
    });
  }
  function rect(x,y,size) {
      const path =[
        [x - size,y - size],
        [x + size,y - size],
        [x + size,y + size],
        [x - size,y + size]
      ];
      path.push(path[0]);
      return path;
  }
}