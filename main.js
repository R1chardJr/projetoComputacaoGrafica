import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';



function main() {



  
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({
    canvas : document.getElementById('glCanvas'),
    antialias: true,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x94d0f2);
  document.body.appendChild(renderer.domElement);

  //posição da camera
  camera.position.set(0,6, 8);
  camera.lookAt(0, 0, -2);

  

  
  // Iluminação
  const ambientLight = new THREE.AmbientLight(0xffffff, -0.7);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1 );
  directionalLight.position.set(0, 5, 10);
  directionalLight.castShadow = true;
  scene.add(directionalLight);
  scene.innerHeight

  
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Optional: for softer shadows

  // carro
  let model
  const loader = new GLTFLoader();
  loader.load('carro.glb', (gltf) => {
    model = gltf.scene;
    model.position.set(0, 0.12, -10);  // Posição inicial do carro
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true; // Enable shadow casting
        child.receiveShadow = true; // Enable shadow receiving
      }
    });
    scene.add(model)
    console.log('model loaded', model)
  }, undefined, (error) => {
    console.error('deu erro', error)
  });
  function atualizarFarol() {
    if (model) {
      // Pegar a posição atual do carro
      const posX = model.position.x;
      const posY = model.position.y;
      const posZ = model.position.z;
  
      // Atualiza a posição dos faróis com base na posição do carro
      // Ajuste os valores para os faróis, por exemplo, posição no carro
      adicionarFarol(posX + 1, posY + 1, posZ - 4);  // Farol direito
      adicionarFarol(posX - 1, posY + 1, posZ - 4);  // Farol esquerdo
    }
  }
  function adicionarFarol(x, y, z) {
    const farol = new THREE.PointLight(0xffffff, 1, 10); // Cor branca, intensidade 1, alcance de 10 unidades
    farol.position.set(x, y, z); // Posição do farol, no caso, posição no modelo do carro
    scene.add(farol);
  }

  // Criar estrada
  const roadGeometry = new THREE.PlaneGeometry(10,  400);
  const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const road = new THREE.Mesh(roadGeometry, roadMaterial);
  road.position.set(0, 0.1, 0)
  road.rotation.x = -Math.PI / 2;
  scene.add(road);
  // criar gramas
  const grassGeometry = new THREE.PlaneGeometry(400,400);
  const grassMaterial = new THREE.MeshBasicMaterial({color: 0x228B22});

  const grassLeft = new THREE.Mesh(grassGeometry, grassMaterial);
  grassLeft.position.set(-15, 0, 0);
  grassLeft.rotation.x = -Math.PI /2;
  scene.add(grassLeft);

  const grassRight = new THREE.Mesh(grassGeometry, grassMaterial);
  grassRight.position.set(15, 0, 0);
  grassRight.rotation.x = -Math.PI /2;
  scene.add(grassRight);

  // cidade
  function criarPredio(x, z, scene) {
    const altura = Math.random() * 10 + 5; // Altura aleatória para o prédio
    const largura = Math.random() * 5 + 3; // Largura aleatória
    const profundidade = Math.random() * 5 + 3; // Profundidade aleatória
  
    const geometria = new THREE.BoxGeometry(largura, altura, profundidade);
    const material = new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 0.7 });
    const predio = new THREE.Mesh(geometria, material);
  
    predio.position.set(x, altura / 2, z); // Posicionar o prédio
    scene.add(predio);
  }
  let x = -250
  for (let i = 0; i < 100; i++) {
    criarPredio(x, -200, scene);
    x += 5
  }

  //faixa
  let z = 5
  for (let i = 0; i < 100; i++) {
    criarFaixas(z, scene);
    z = z-15;
  }


  // arvores
  const distancia = 20; // Distância entre as árvores
  const offsetdireito = 15;
  const offsetesquerdo = -15;
  let zarv = -5
  for (let i = 0; i < 20; i++) {
    let b = 0
    for (let j = 0; j < 50; j++){
      zarv-= 1
      criarArvores(offsetdireito + b, 0, zarv, scene); // Criar árvore na posição (x, 0, z)
      b += distancia
      zarv+= 1
    }
    let a = 0
    for( let k = 0; k < 50; k++){
      criarArvores(offsetesquerdo + a, 0,  zarv, scene); // Criar árvore na posição (x, 0, z)
      a -= distancia
    }
    zarv -= distancia
  }

  let pontos = 0;
  function atualizarPontos() {
    pontos += 0.1; // Aumenta 1 ponto a cada chamada
    document.getElementById("score").innerText = `Pontos: ${Math.floor(pontos)}`;
}


function criarCone(x, z) {
  const coneGeometry = new THREE.ConeGeometry(1, 2, 20);
  const coneMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const cone = new THREE.Mesh(coneGeometry, coneMaterial);
  cone.position.set(x, 1, z);
  cone.castShadow = true;
  scene.add(cone);
  return cone;
}

let cone = null;
let gameOver = false;
const posicoesPista = [-3, 0, 3]; // Esquerda, centro e direita

function criarCone(x, z) {
    const coneGeometry = new THREE.ConeGeometry(1, 2, 20);
    const coneMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const novoCone = new THREE.Mesh(coneGeometry, coneMaterial);
    novoCone.position.set(x, 1, z);
    novoCone.castShadow = true;
    scene.add(novoCone);
    return novoCone;
}

function gerarCone() {
    if (!cone) {
        let x = posicoesPista[Math.floor(Math.random() * posicoesPista.length)]; // Escolhe posição aleatória
        let z = -50 - Math.random() * 30;
        cone = criarCone(x, z);
    }
}

function verificarColisao() {
    if (model && cone) {
        const distancia = model.position.distanceTo(cone.position);
        if (distancia < 2) { 
            gameOver = true;
            exibirMensagemFimDeJogo();
        }
    }
}

function exibirMensagemFimDeJogo() {
    const gameOverText = document.createElement("div");
    gameOverText.innerHTML = `  
        <h1>Fim de Jogo</h1>  
        <p>Pontuação final: ${Math.floor(pontos)}</p>  
    `;
    gameOverText.style.position = "absolute";
    gameOverText.style.top = "50%";
    gameOverText.style.left = "50%";
    gameOverText.style.transform = "translate(-50%, -50%)";
    gameOverText.style.background = "rgba(0, 0, 0, 0.8)";
    gameOverText.style.color = "white";
    gameOverText.style.padding = "20px";
    gameOverText.style.fontSize = "24px";
    gameOverText.style.borderRadius = "10px";
    document.body.appendChild(gameOverText);
}

function animate() {
    if (gameOver) return; 

    requestAnimationFrame(animate);
    
    if (cone) {
        cone.position.z += 0.5;
        if (cone.position.z > 10) {
            scene.remove(cone);
            cone = null;
            atualizarPontos(); 
        }
    }

    atualizarPontos();
    verificarColisao();
    gerarCone();
    //atualizarFarol();
    
    renderer.render(scene, camera);
}

let posicoes = [-3, 0, 3]; // Posições possíveis na pista
let indicePosicao = 1; // Começa no meio (índice 1)

function moverCarro() {
  if (model) {
    model.position.set(posicoes[indicePosicao], model.position.y, model.position.z);
  }
}

  function keyDown(event){
    switch(event.key){
      case "1":
        camera.position.set(0,5, -5);
        camera.lookAt(0, 0, -12);
        break;
      case "2":      
        camera.position.set(3.5,6, 4);
        camera.lookAt(0, 0, -12);
        break;
      case "3":      
          camera.position.set(0, 2.5, -10); 
          camera.lookAt(0, 0.5, -18)
        break;
      case "a": // Teleporta para a extremidade esquerda
      case "A":
        if (indicePosicao > 0) {
          indicePosicao--;
          moverCarro();
        }
        break;
      case "d": // Teleporta para a extremidade direita
      case "D":
        if (indicePosicao < posicoes.length - 1) {
          indicePosicao++;
          moverCarro();
        }
        break;
    }
  }
  window.addEventListener("keydown", keyDown);
  animate();

}



function criarFaixas(z, scene) {
  let x = 1;
  const faixaGeometry = new THREE.PlaneGeometry(0.8, 6);
  const faixaMaterial = new THREE.MeshBasicMaterial({color : 0xfcba03 })
  const faixadir = new THREE.Mesh(faixaGeometry, faixaMaterial)

  faixadir.position.set(x, 0.11, z); // Posicionar o prédio
  faixadir.rotation.x = -Math.PI /2
  scene.add(faixadir);
  const faixaesq = new THREE.Mesh(faixaGeometry, faixaMaterial)
  faixaesq.position.set(-x, 0.11, z); // Posicionar o prédio
  faixaesq.rotation.x = -Math.PI /2
  scene.add(faixaesq);
}

function criarArvores(x,y, z, scene){
  //tronco
  const troncoGeometry = new THREE.CylinderGeometry(0.1, 0.2, 8, 8)
  const troncoMaterial = new THREE.MeshStandardMaterial({color: 0x8B4513});
  const tronco = new THREE.Mesh(troncoGeometry, troncoMaterial)
  
  //copa
  const copaGeometry = new THREE.SphereGeometry(2, 16, 16);
  const copaMaterial = new THREE.MeshStandardMaterial({color: 0x228B22});
  const copa = new THREE.Mesh(copaGeometry, copaMaterial);

  tronco.position.set(x, y, z);
  copa.position.set(x, y+4, z);
  
  scene.add(tronco);
  scene.add(copa);
}
main();