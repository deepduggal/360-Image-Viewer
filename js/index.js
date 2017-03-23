var img = 'res/panorama.jpg';
var camera, scene, renderer;
var geometry, texture, material;
var container, mesh;

var isUserInteracting = false,
onMouseDownMouseX = 0, onMouseDownMouseY = 0,
lon = 0, onMouseDownLon = 0,
lat = 0, onMouseDownLat = 0,
phi = 0, theta = 0;

init();
animate();

function init() {
  container = document.querySelector('.background')

  //scene and camera
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
  camera.target = new THREE.Vector3( 0, 0, 0 );

  scene = new THREE.Scene();

  //create sphere
  geometry = new THREE.SphereGeometry( 500, 60, 40 );
  geometry.scale( - 1, 1, 1 );

  //create texture from image
  texture = new THREE.TextureLoader().load(img);
  texture.minFilter = THREE.LinearFilter;

  //create material from texture
  material = new THREE.MeshBasicMaterial( {
    map: texture
  } );

  //add material to sphere
  mesh = new THREE.Mesh( geometry, material );

  //add sphere to scene
  scene.add( mesh );

  //setup renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  document.addEventListener( 'mousedown', onDocumentMouseDown, false );
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  document.addEventListener( 'mouseup', onDocumentMouseUp, false );
  document.addEventListener( 'dragover', function ( event ) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }, false );
  document.addEventListener( 'dragenter', function ( event ) {
    document.body.style.opacity = 0.5;
  }, false );
  document.addEventListener( 'dragleave', function ( event ) {
    document.body.style.opacity = 1;
  }, false );

  document.addEventListener( 'drop', function ( event ) {
    event.preventDefault();

    var reader = new FileReader();

    reader.addEventListener( 'load', function ( event ) {
      material.map.image.src = event.target.result;
      material.map.needsUpdate = true;
    }, false );

    reader.readAsDataURL( event.dataTransfer.files[ 0 ] );

    document.body.style.opacity = 1;

  }, false );

  window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
  //update window size-related values
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}
function onDocumentMouseDown( event ) {
  event.preventDefault();

  //start clicking and dragging
  isUserInteracting = true;

  //store location of click
  onPointerDownPointerX = event.clientX;
  onPointerDownPointerY = event.clientY;

  //store old longitude and latitude
  onPointerDownLon = lon;
  onPointerDownLat = lat;
}
function onDocumentMouseMove( event ) {
  //if clicking and dragging, update camera values
  if ( isUserInteracting === true ) {
    lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
    lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;
  }
}
function onDocumentMouseUp( event ) {
  //stopped clicking and dragging
  isUserInteracting = false;
}

function animate() {
  requestAnimationFrame( animate );
  update();
}
function update() {
  // Auto scroll image when user is doing nothing
  if (!isUserInteracting) {
    lon += 0.1;
  }

  lat = Math.max( - 85, Math.min( 85, lat ) );
  phi = THREE.Math.degToRad( 90 - lat );
  theta = THREE.Math.degToRad( lon );

  camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
  camera.target.y = 500 * Math.cos( phi );
  camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );

  camera.lookAt( camera.target );

  renderer.render( scene, camera );
}