import GUI from 'lil-gui';
import { onCleanup, onMount } from 'solid-js';
import * as THREE from 'three';

import type { ColorRepresentation } from 'three';

export function ThreeScene() {
  let canvas: HTMLCanvasElement;

  onMount(() => {
    const spheresGroup = new THREE.Group();

    const debugParameters = {
      columnCount: 5,
      columns: [
        { numUsers: 10 },
        { numUsers: 25 },
        { numUsers: 15 },
        { numUsers: 40 },
        { numUsers: 20 },
      ],
    };

    // Textures
    const textureLoader = new THREE.TextureLoader();
    const angryTexture = textureLoader.load('/angry_emoji_texture.jpg');
    const neutralTexture = textureLoader.load('/neutral_emoji_texture.jpg');
    const happyTexture = textureLoader.load('/happy_emoji_texture.jpg');
    angryTexture.colorSpace = THREE.SRGBColorSpace;
    neutralTexture.colorSpace = THREE.SRGBColorSpace;
    happyTexture.colorSpace = THREE.SRGBColorSpace;
    angryTexture.center.x = 0.5;
    angryTexture.center.y = 0.5;
    angryTexture.offset.x = 0.25;
    neutralTexture.center.x = 0.5;
    neutralTexture.center.y = 0.5;
    neutralTexture.offset.x = 0.25;
    happyTexture.center.x = 0.5;
    happyTexture.center.y = 0.5;
    happyTexture.offset.x = 0.25;

    // scene
    const scene = new THREE.Scene();
    scene.add(spheresGroup);

    // geometry
    const sphere1geometry = new THREE.SphereGeometry(0.25, 16, 16);

    // Materials
    const angryMaterial = new THREE.MeshBasicMaterial({ map: angryTexture });
    const neutralMaterial = new THREE.MeshBasicMaterial({ map: neutralTexture });
    const happyMaterial = new THREE.MeshBasicMaterial({ map: happyTexture });

    const updateSpheres = () => {
      // Clear existing spheres
      while (spheresGroup.children.length > 0) {
        const child = spheresGroup.children[0] as THREE.Mesh;
        child.geometry.dispose();
        spheresGroup.remove(child);
      }

      const activeColumns = debugParameters.columns.slice(0, debugParameters.columnCount);
      const totalUsers = activeColumns.reduce((sum, col) => sum + col.numUsers, 0);
      let globalIndex = 0;

      // Rebuild spheres based on debugParams
      for (const [colIndex, column] of activeColumns.entries()) {
        // eslint-disable-next-line no-plusplus -- intentional part of the algorithm
        for (let index = 0; index < column.numUsers; index++) {
          let currentMaterial;
          if (globalIndex < totalUsers / 3) {
            currentMaterial = angryMaterial;
          } else if (globalIndex < (totalUsers * 2) / 3) {
            currentMaterial = neutralMaterial;
          } else {
            currentMaterial = happyMaterial;
          }

          const sphereMesh = new THREE.Mesh(sphere1geometry, currentMaterial);
          sphereMesh.position.x = colIndex * 0.5;
          sphereMesh.position.y = index * 0.5;
          spheresGroup.add(sphereMesh);
          globalIndex++; // eslint-disable-line no-plusplus -- intentional part of the algorithm
        }
      }
    };

    // Initial build
    updateSpheres();

    // axes helper
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // "flood" grid
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    // Debug GUI
    const gui = new GUI();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'g') {
        // eslint-disable-next-line no-underscore-dangle -- internal API
        if (gui._hidden) {
          gui.show();
        } else {
          gui.hide();
        }
      }
    };

    globalThis.addEventListener('keydown', handleKeyDown);

    onCleanup(() => {
      globalThis.removeEventListener('keydown', handleKeyDown);
      gui.destroy();
    });

    // Material debug
    const materialFolder = gui.addFolder('Materials');
    materialFolder
      .addColor(angryMaterial, 'color')
      .name('Sphere Color')
      .onChange((value: ColorRepresentation) => {
        neutralMaterial.color.set(value);
        happyMaterial.color.set(value);
      });
    materialFolder.add(angryMaterial, 'wireframe').onChange((value: boolean) => {
      neutralMaterial.wireframe = value;
      happyMaterial.wireframe = value;
    });

    // Columns debug
    const columnsFolder = gui.addFolder('Columns');

    const refreshColumnControls = () => {
      // Clear previous column count controls if any
      // const existing = columnsFolder.children.filter((c) => c._name.startsWith('Column '));
      const existing = columnsFolder.children;
      for (const c of existing) c.destroy();

      // Add controls for current columns
      for (const [index, col] of debugParameters.columns
        .slice(0, debugParameters.columnCount)
        .entries()) {
        columnsFolder
          .add(col, 'numUsers', 1, 100, 1)
          .name(`Column ${index + 1} Users`)
          .onChange(updateSpheres);
      }
    };

    columnsFolder
      .add(debugParameters, 'columnCount', 1, 50, 1)
      .name('Number of Columns')
      .onChange(() => {
        // Ensure debugParams.columns has enough entries
        while (debugParameters.columns.length < debugParameters.columnCount) {
          debugParameters.columns.push({ numUsers: 10 });
        }
        refreshColumnControls();
        updateSpheres();
      });

    refreshColumnControls();

    // Sizes
    const sizes = {
      height: window.innerHeight * 0.5,
      width: window.innerWidth * 0.7,
    };

    // Camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
    camera.position.z = 3;
    camera.position.y = 2;
    scene.add(camera);

    // Controls
    // const controls = new OrbitControls(camera, canvas);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas: canvas! });
    renderer.setSize(sizes.width, sizes.height);

    // animation function
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }

    animate();
  });

  return <canvas ref={canvas!} />;
}
