import * as THREE from 'three';
import { onMount } from 'solid-js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function ThreeScene() {
  let canvas: HTMLCanvasElement;

  //scene
  const scene = new THREE.Scene();

  //geometry
  const sphere1geometry = new THREE.SphereGeometry(0.5, 16, 16);
  const material = new THREE.MeshBasicMaterial({ color: '#f5eace' });
  const sphere1mesh = new THREE.Mesh(sphere1geometry, material);

  const sphere2mesh = new THREE.Mesh(sphere1geometry, material);
  const sphere3mesh = new THREE.Mesh(sphere1geometry, material);

  sphere2mesh.position.x = 1;
  sphere3mesh.position.x = 2;

  scene.add(sphere1mesh);
  scene.add(sphere2mesh);
  scene.add(sphere3mesh);

  //axes helper
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  //"flood" grid
  const gridHelper = new THREE.GridHelper(10, 10);
  scene.add(gridHelper);

  onMount(() => {
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
