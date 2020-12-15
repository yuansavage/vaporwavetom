var renderer, scene, camera;
var group;
var el1, el2, el3;
var cameraControl;

function init(){
  scene = new THREE.Scene();
  //建立場景模糊(越遠越模糊)
  scene.fog = new THREE.Fog(0x090b33,5,50);
  
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth,window.innerHeight);
  //建立陰影
  renderer.shadowMap.enable = true;
  document.body.appendChild(renderer.domElement);
  
  camera = new THREE.PerspectiveCamera(40,window.innerWidth/window.innerHeight,0.1,100);
  camera.position.set(16,10,12);
  camera.lookAt(scene.position);
  
  group = new THREE.Object3D();
  scene.add(group);
  
  function generateBall(r,color,name,x,y,z){
    var sphereGeometry = new THREE.SphereGeometry(r,32,32);
    var sphereMaterial = new THREE.MeshLambertMaterial({
      color: color,
      envMaps: "reflection"
    });
    var sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);
    sphere.name = name;
    sphere.position.set(x || 0,y || 0,z || 0);
    group.add(sphere);
    return sphere;
  }
  /*generateBall(3,0x9633b,"test");
  generateBall(3,0x9633b,"test",-5);
  generateBall(3,0x9633b,"test",-5,0,-5);
  */
  var radius = 2;
  var stepdiv = 4;
  var dd = true;
  for(var angel1= 0; angel1<Math.PI*2; angel1+=Math.PI/stepdiv){
    for(var angel2= 0; angel2<Math.PI*2; angel2+=Math.PI/stepdiv){
      let layerRadius = Math.cos(angel1)*radius;
      let ballColor = dd? "#D90BCB":"#0339A6";
      
      generateBall(0.9,ballColor,"atom",
                  layerRadius*Math.cos(angel2),
                  radius*Math.sin(angel1),
                  layerRadius*Math.sin(angel2)
      )
      dd=!dd;
      
    }
    dd=!dd;
  }
  
  el1 = {
    orbit_r: 5,
    orbit_speed: 0.15,
    angel:Math.random()*Math.PI*2,
    obj: generateBall(0.2,0x9633b,"el1")
  }
  el2 = {
    orbit_r: 4,
    orbit_speed: 0.1,
    angel:Math.random()*Math.PI*2,
    obj: generateBall(0.2,0x9633b,"el2")
  }
  el3 = {
    orbit_r: 5,
    orbit_speed: 0.05,
    angel:Math.random()*Math.PI*2,
    obj: generateBall(0.2,0x9633b,"el3")
  }
  
  
  var ambientLight = new THREE.AmbientLight("#fff");
  //scene.add(ambientLight);
  
  var directionalLight = new THREE.DirectionalLight(0xffffff,1);
  scene.add(directionalLight);
  
  var spotLight = new THREE.SpotLight({color:"#fff"});
  spotLight.position.set(-20,10,20);
  spotLight.CastShadow = true;
  scene.add(spotLight);
  
  cameraControl = new THREE.OrbitControls(camera,renderer.domElement);
  
  
}
init();

function render(){
  renderer.render(scene,camera);
  cameraControl.update();
  
  el1.obj.position.x = el1.orbit_r*Math.cos(el1.angel);
  el1.obj.position.y = el1.orbit_r*Math.sin(el1.angel);
  el1.angel+=el1.orbit_speed;
  
  el2.obj.position.y = el2.orbit_r*Math.cos(el2.angel);
  el2.obj.position.z = el2.orbit_r*Math.sin(el2.angel);
  el2.angel+=el2.orbit_speed;
  
  el3.obj.position.z = el3.orbit_r*Math.cos(el3.angel);
  el3.obj.position.x = el3.orbit_r*Math.sin(el3.angel);
  el3.angel+=el3.orbit_speed;
  
  group.rotation.y+=0.02; 
  requestAnimationFrame(render);
}

render();

window.addEventListener('resize',function(){
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth,window.innerHeight);
})