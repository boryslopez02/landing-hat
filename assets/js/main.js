// Crear escena
const scene = new THREE.Scene();

// Cámara
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 5000); // Aumentar la distancia máxima
camera.position.set(-299.22436850596694, 1909.7414843782035, 652.1343015696802); // Posición inicial de la cámara

// Renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // Fondo transparente
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('container-scene').appendChild(renderer.domElement);

// Plano para recibir sombras (simulando una pared detrás del modelo)
const shadowWallGeometry = new THREE.PlaneGeometry(5000, 5000); // Tamaño grande para cubrir la escena
const shadowWallMaterial = new THREE.ShadowMaterial({ opacity: 0.5 }); // Material que sólo recibe sombras, ajusta la opacidad según lo necesites
const shadowWall = new THREE.Mesh(shadowWallGeometry, shadowWallMaterial);

// Colocar el plano verticalmente detrás del modelo
shadowWall.rotation.y = Math.PI; // Rotar 180 grados para que esté vertical en el eje Z
shadowWall.position.z = 100; // Ajusta la posición para que quede justo detrás del modelo
shadowWall.position.y = 0; // Centra el plano a la altura del modelo
shadowWall.receiveShadow = true; // El plano recibe sombras
scene.add(shadowWall);

// Controles de órbita
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.minDistance = 0.5; // Mínima distancia para acercar la cámara
controls.maxDistance = 5000; // Aumentar la distancia máxima para alejar
controls.maxPolarAngle = Math.PI;
controls.enableZoom = true;
controls.enableRotate = true;
controls.update();

// Iluminación ambiental
const ambientLight = new THREE.AmbientLight(0xA1C6C5, 0.8);
scene.add(ambientLight);

// Iluminaciones direccionales
// const light1 = new THREE.DirectionalLight(0xFF28C9, 0.8);
const light1 = new THREE.DirectionalLight(0xffcf99, 0.8);
light1.castShadow = true;
// light1.intensity = 2;
// light1.position.set(10, 7, -10);
light1.intensity = 10;
light1.position.set(9, 18.8, -18);
scene.add(light1);

const light2 = new THREE.DirectionalLight(0xffcf99, 0.6);
light2.castShadow = true;
// light2.intensity = 3.36;
// light2.position.set(63.2, 7, 10);
light2.intensity = 3.36;
light2.position.set(65.6, -100, -37.6);
scene.add(light2);

const light3 = new THREE.DirectionalLight(0x111d4a, 0.6);
// light3.intensity = 10;
light3.intensity = 5.08;
light3.castShadow = true;
// light3.position.set(-100, 23.8, 10);
// light3.position.set(-100, 9, -40.2);
light3.position.set(-100, -100, -100);
scene.add(light3);

// Cargar el modelo GLB
const loader = new THREE.GLTFLoader();
let model;

loader.load('/assets/models/3D.glb', function(gltf) {
    model = gltf.scene;
    model.castShadow = true;
    model.receiveShadow = true;

    // Añadir el modelo a la escena
    scene.add(model);

    // Obtener la caja delimitadora del modelo
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Ajustar manualmente el objetivo de la cámara para apuntar a la cabeza
    const headHeight = center.y + (size.y / 2.3); // Aproximamos la altura de la cabeza
    camera.lookAt(center.x, headHeight, center.z); // Apuntamos hacia la cabeza del modelo

    controls.target.set(center.x, headHeight, center.z);
    controls.update();

    // Añadir controles para la escala y posición del modelo
    const gui = new lil.GUI();

    const modelFolder = gui.addFolder('Modelo 3D');
    modelFolder.add(model.scale, 'x', 0.1, 20).name('Escala X').listen(); // Ampliar rango de escala
    modelFolder.add(model.scale, 'y', 0.1, 20).name('Escala Y').listen();
    modelFolder.add(model.scale, 'z', 0.1, 20).name('Escala Z').listen();
    modelFolder.add(model.position, 'x', -1000, 1000).name('Posición X').listen(); // Aumentar rango de movimiento
    modelFolder.add(model.position, 'y', -1000, 1000).name('Posición Y').listen();
    modelFolder.add(model.position, 'z', -1000, 1000).name('Posición Z').listen();
    modelFolder.open();

    // Añadir controles para la posición de la cámara
    const cameraFolder = gui.addFolder('Cámara');
    cameraFolder.add(camera.position, 'x', -5000, 5000).name('Posición X').listen(); // Aumentar rango para la cámara
    cameraFolder.add(camera.position, 'y', -5000, 5000).name('Posición Y').listen();
    cameraFolder.add(camera.position, 'z', -5000, 5000).name('Posición Z').listen();
    cameraFolder.open();

    // Añadir controles para las luces
    const lightFolder1 = gui.addFolder('Luz Direccional 1');
    lightFolder1.addColor(light1, 'color').name('Color').listen();
    lightFolder1.add(light1.position, 'x', -100, 100).name('Posición X').listen();
    lightFolder1.add(light1.position, 'y', -100, 100).name('Posición Y').listen();
    lightFolder1.add(light1.position, 'z', -100, 100).name('Posición Z').listen();
    lightFolder1.add(light1, 'intensity', 0, 10).name('Intensidad').listen();
    lightFolder1.open();

    const lightFolder2 = gui.addFolder('Luz Direccional 2');
    lightFolder2.addColor(light2, 'color').name('Color').listen();
    lightFolder2.add(light2.position, 'x', -100, 100).name('Posición X').listen();
    lightFolder2.add(light2.position, 'y', -100, 100).name('Posición Y').listen();
    lightFolder2.add(light2.position, 'z', -100, 100).name('Posición Z').listen();
    lightFolder2.add(light2, 'intensity', 0, 10).name('Intensidad').listen();
    lightFolder2.open();

    const lightFolder3 = gui.addFolder('Luz Direccional 3');
    lightFolder3.addColor(light3, 'color').name('Color').listen();
    lightFolder3.add(light3.position, 'x', -100, 100).name('Posición X').listen();
    lightFolder3.add(light3.position, 'y', -100, 100).name('Posición Y').listen();
    lightFolder3.add(light3.position, 'z', -100, 100).name('Posición Z').listen();
    lightFolder3.add(light3, 'intensity', 0, 10).name('Intensidad').listen();
    lightFolder3.open();

    animate(); // Iniciar la animación
}, undefined, function(error) {
    console.error('Error al cargar el modelo', error);
});

// Función de animación
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Redimensionar al cambiar el tamaño de la ventana
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
});
