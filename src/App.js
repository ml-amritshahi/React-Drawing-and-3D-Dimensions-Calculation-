import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import DrawingBoard from './DrawingBoard';
const App = () => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [shape, setShape] = useState([]);
  const [vertices, setVertices] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 2;
    const renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setSize(width, height);

    // Create box mesh
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Create line geometry
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(vertices);
    const line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);

    // Create text texture
    const textCanvas = document.createElement('canvas');
    const textContext = textCanvas.getContext('2d');
    textContext.font = '20px Arial';
    textContext.fillStyle = 'white';
    textContext.fillText('Hello, World!', 10, 30);

    const texture = new THREE.Texture(textCanvas);
    texture.needsUpdate = true;

    const textMaterial = new THREE.MeshBasicMaterial({ map: texture });
    const textGeometry = new THREE.PlaneGeometry(1, 0.2);
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(0, 0, 0.6);
    cube.add(textMesh);

    // Render function
    const render = () => {
      requestAnimationFrame(render);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    render();

    // Mouse event handlers
    const handleMouseDown = (event) => {
      setDrawing(true);
      const rect = canvas.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
      setVertices((prevVertices) => [...prevVertices, offsetX / width - 0.5, -offsetY / height + 0.5, 0]);
    };

    const handleMouseMove = (event) => {
      if (drawing) {
        const rect = canvas.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;
        setVertices((prevVertices) => [...prevVertices, offsetX / width - 0.5, -offsetY / height + 0.5, 0]);
      }
    };

    const handleMouseUp = () => {
      setDrawing(false);
      setShape((prevShape) => [...prevShape, vertices]);
      setVertices([]);
    };

    // Attach event listeners
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);

    // Clean up Three.js scene and event listeners
    return () => {
      scene.remove(cube);
      scene.remove(line);
      scene.clear();
      renderer.dispose();
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [vertices]);

  return (
    <div>
      <DrawingBoard/>
      <canvas
        ref={canvasRef}
        style={{ width: '500px', height: '500px', border: '1px solid black' }}
      />
      <div>
        <h3>Vertices:</h3>
        {shape.map((vertices, index) => (
          <p key={index}>{`Shape ${index + 1}: ${vertices.join(', ')}`}</p>
        ))}
      </div>
    </div>
  );
};

export default App;
