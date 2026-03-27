import * as THREE from 'three';
import { onMount, createEffect } from 'solid-js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { distribution } from '../lib/store';

export default function ThreeScene() {
  let canvas: HTMLCanvasElement;
  const spheresGroup = new THREE.Group();

  //scene
  const scene = new THREE.Scene();
  scene.add(spheresGroup);

  //geometry
  const sphere1geometry = new THREE.SphereGeometry(0.1, 8, 8);
  const material = new THREE.MeshBasicMaterial({ color: '#f5eace' });
  const convertedMaterial = new THREE.MeshBasicMaterial({ color: '#10b981' }); // emerald-500
  const bouncedMaterial = new THREE.MeshBasicMaterial({ color: '#f43f5e' }); // rose-500

  const updateSpheres = () => {
    // Clear existing spheres
    while (spheresGroup.children.length > 0) {
      const child = spheresGroup.children[0] as THREE.Mesh;
      child.geometry.dispose();
      spheresGroup.remove(child);
    }

    const dist = distribution();
    const scaleFactor = 10000; // Render 1 sphere per 10,000 users

    // We only show up to a certain time for performance
    const maxBuckets = 50; 
    
    dist.totalPopulation.slice(0, maxBuckets).forEach((population, colIndex) => {
      const converted = dist.convertedDistribution[colIndex];
      const bounced = dist.bouncedDistribution[colIndex];
      const others = population - converted - bounced;

      const numConverted = Math.round(converted / scaleFactor);
      const numBounced = Math.round(bounced / scaleFactor);
      const numOthers = Math.round(others / scaleFactor);

      let currentY = 0;

      for (let i = 0; i < numConverted; i++) {
        const sphereMesh = new THREE.Mesh(sphere1geometry, convertedMaterial);
        sphereMesh.position.x = colIndex * 0.3 - (maxBuckets * 0.3) / 2;
        sphereMesh.position.y = currentY;
        spheresGroup.add(sphereMesh);
        currentY += 0.2;
      }

      for (let i = 0; i < numOthers; i++) {
        const sphereMesh = new THREE.Mesh(sphere1geometry, material);
        sphereMesh.position.x = colIndex * 0.3 - (maxBuckets * 0.3) / 2;
        sphereMesh.position.y = currentY;
        spheresGroup.add(sphereMesh);
        currentY += 0.2;
      }

      for (let i = 0; i < numBounced; i++) {
        const sphereMesh = new THREE.Mesh(sphere1geometry, bouncedMaterial);
        sphereMesh.position.x = colIndex * 0.3 - (maxBuckets * 0.3) / 2;
        sphereMesh.position.y = currentY;
        spheresGroup.add(sphereMesh);
        currentY += 0.2;
      }
    });
  };

  // Initial build
  updateSpheres();

  //axes helper
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  //"flood" grid
  const gridHelper = new THREE.GridHelper(20, 20);
  scene.add(gridHelper);

  onMount(() => {
    //Sizes
    const sizes = {
      width: window.innerWidth,
      height: 400,
    };

    //Camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
    camera.position.z = 10;
    camera.position.y = 5;
    scene.add(camera);

    // Controls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    //animation function
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }

    //Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    animate();

    // Resize handler
    const handleResize = () => {
      sizes.width = window.innerWidth;
      renderer.setSize(sizes.width, sizes.height);
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    createEffect(() => {
      updateSpheres();
    });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  return <canvas ref={canvas} class="w-full h-[400px]" />;
}
