import * as THREE from 'three';
import { onMount } from 'solid-js';

export default function ThreeScene() {
  let canvas: HTMLCanvasElement;

  //scene
  const scene = new THREE.Scene();

  //geometry
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: '#ff0000' });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  onMount(() => {
    //Sizes
    const sizes = {
      width: window.innerWidth * 0.7,
      height: window.innerHeight * 0.5,
    };

    //Camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
    camera.position.z = 3;
    scene.add(camera);

    //animation function
    function animate() {
      requestAnimationFrame(animate);

      // Rotate the cube for demonstration purposes
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;

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
