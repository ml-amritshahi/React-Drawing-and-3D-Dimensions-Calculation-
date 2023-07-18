import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const App = () => {
  const canvasRef = useRef(null);
  const [shape, setShape] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setSize(width, height);

    // Create cube mesh
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Update 3D preview when shape changes
    const updateShape = () => {
      const vertices = shape.map(({ x, y, z }) => new THREE.Vector3(x, y, z));
      const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
      const line = new THREE.Line(geometry, lineMaterial);
      scene.add(line);
    };

    updateShape();

    // Render function
    const render = () => {
      requestAnimationFrame(render);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    render();

    // Clean up Three.js scene
    return () => {
      scene.remove(cube);
      scene.dispose();
      renderer.dispose();
    };
  }, [shape]);

  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    setShape((prevShape) => [...prevShape, { x: offsetX, y: offsetY, z: 0 }]);
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        style={{ width: '500px', height: '500px', border: '1px solid black' }}
      />
      <div>
        <h3>Vertices:</h3>
        {shape.map(({ x, y, z }, index) => (
          <p key={index}>{`Vertex ${index + 1}: (${x}, ${y}, ${z})`}</p>
        ))}
      </div>
    </div>
  );
};

export default App;
