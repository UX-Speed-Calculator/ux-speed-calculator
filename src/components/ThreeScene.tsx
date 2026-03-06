import * as THREE from 'three';
import { onMount } from 'solid-js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

export default function ThreeScene() {
  let canvas: HTMLCanvasElement;
  const spheresGroup = new THREE.Group();

  const debugParams = {
    columnCount: 5,
    columns: [
      { numUsers: 10 },
      { numUsers: 25 },
      { numUsers: 15 },
      { numUsers: 40 },
      { numUsers: 20 },
    ],
  };

  //scene
  const scene = new THREE.Scene();
  scene.add(spheresGroup);

  //geometry
  const sphere1geometry = new THREE.SphereGeometry(0.25, 16, 16);
  const material = new THREE.MeshBasicMaterial({ color: '#f5eace' });

  const updateSpheres = () => {
    // Clear existing spheres
    while (spheresGroup.children.length > 0) {
      const child = spheresGroup.children[0] as THREE.Mesh;
      child.geometry.dispose();
      spheresGroup.remove(child);
    }

    // Rebuild spheres based on debugParams
    debugParams.columns.slice(0, debugParams.columnCount).forEach((column, colIndex) => {
      for (let i = 0; i < column.numUsers; i++) {
        const sphereMesh = new THREE.Mesh(sphere1geometry, material);
        sphereMesh.position.x = colIndex * 1;
        sphereMesh.position.y = i * 0.4;
        spheresGroup.add(sphereMesh);
      }
    });
  };

  // Initial build
  updateSpheres();

  //axes helper
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  //"flood" grid
  const gridHelper = new THREE.GridHelper(10, 10);
  scene.add(gridHelper);

  onMount(() => {
    // Debug GUI
    const gui = new GUI();

    // Material debug
    const materialFolder = gui.addFolder('Material');
    materialFolder.addColor(material, 'color').name('Sphere Color');
    materialFolder.add(material, 'wireframe');

    // Columns debug
    const columnsFolder = gui.addFolder('Columns');
    
    const refreshColumnControls = () => {
      // Clear previous column count controls if any
      const existing = columnsFolder.children.filter(c => c._name.startsWith('Column '));
      existing.forEach(c => c.destroy());

      // Add controls for current columns
      debugParams.columns.slice(0, debugParams.columnCount).forEach((col, index) => {
        columnsFolder.add(col, 'numUsers', 1, 100, 1)
          .name(`Column ${index + 1} Users`)
          .onChange(updateSpheres);
      });
    };

    columnsFolder.add(debugParams, 'columnCount', 1, 50, 1)
      .name('Number of Columns')
      .onChange(() => {
        // Ensure debugParams.columns has enough entries
        while (debugParams.columns.length < debugParams.columnCount) {
          debugParams.columns.push({ numUsers: 10 });
        }
        refreshColumnControls();
        updateSpheres();
      });

    refreshColumnControls();

    //Sizes
    const sizes = {
      width: window.innerWidth * 0.7,
      height: window.innerHeight * 0.5,
    };

    //Camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
    camera.position.z = 3;
    camera.position.y = 2;
    scene.add(camera);

    // Controls
    const controls = new OrbitControls(camera, canvas);

    //animation function
    function animate() {
      requestAnimationFrame(animate);

      // Rotate the cube for demonstration purposes
      // mesh.rotation.x += 0.01;
      // mesh.rotation.y += 0.01;

      // controls.update(); // Update the controls (required for damping)
      renderer.render(scene, camera);
    }

    //Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
    });
    renderer.setSize(sizes.width, sizes.height);
    animate();
  });

  return <canvas ref={canvas} />;
}
