import * as THREE from 'three';
import { onMount, onCleanup } from 'solid-js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

export default function ThreeScene() {
  let canvas: HTMLCanvasElement;

  onMount(() => {
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

    //Textures
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

    //scene
    const scene = new THREE.Scene();
    scene.add(spheresGroup);

    //geometry
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

      const activeColumns = debugParams.columns.slice(0, debugParams.columnCount);
      const totalUsers = activeColumns.reduce((sum, col) => sum + col.numUsers, 0);
      let globalIndex = 0;

      // Rebuild spheres based on debugParams
      activeColumns.forEach((column, colIndex) => {
        for (let i = 0; i < column.numUsers; i++) {
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
          sphereMesh.position.y = i * 0.5;
          spheresGroup.add(sphereMesh);
          globalIndex++;
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

    // Debug GUI
    const gui = new GUI();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'g') {
        gui._hidden ? gui.show() : gui.hide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    onCleanup(() => {
      window.removeEventListener('keydown', handleKeyDown);
      gui.destroy();
    });

    // Material debug
    const materialFolder = gui.addFolder('Materials');
    materialFolder.addColor(angryMaterial, 'color').name('Sphere Color').onChange((val: any) => {
      neutralMaterial.color.set(val);
      happyMaterial.color.set(val);
    });
    materialFolder.add(angryMaterial, 'wireframe').onChange((val: boolean) => {
      neutralMaterial.wireframe = val;
      happyMaterial.wireframe = val;
    });

    // Columns debug
    const columnsFolder = gui.addFolder('Columns');

    const refreshColumnControls = () => {
      // Clear previous column count controls if any
      const existing = columnsFolder.children.filter((c) => c._name.startsWith('Column '));
      existing.forEach((c) => c.destroy());

      // Add controls for current columns
      debugParams.columns.slice(0, debugParams.columnCount).forEach((col, index) => {
        columnsFolder
          .add(col, 'numUsers', 1, 100, 1)
          .name(`Column ${index + 1} Users`)
          .onChange(updateSpheres);
      });
    };

    columnsFolder
      .add(debugParams, 'columnCount', 1, 50, 1)
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

    //Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
    });
    renderer.setSize(sizes.width, sizes.height);

    //animation function
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }

    animate();
  });

  return <canvas ref={canvas!} />;
}
