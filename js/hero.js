/* LifeOS – Hero: Three.js + Particles */
(function(){
  // Three.js particle field
  const canvas=document.getElementById('heroCanvas');
  if(!canvas||typeof THREE==='undefined') return;
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(60,1,0.1,1000);
  camera.position.z=5;

  function resize(){
    const w=canvas.clientWidth,h=canvas.clientHeight;
    renderer.setSize(w,h,false);
    camera.aspect=w/h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize',resize);

  // Particles
  const N=1200;
  const positions=new Float32Array(N*3);
  const colors=new Float32Array(N*3);
  const c1=new THREE.Color('#a78bfa'),c2=new THREE.Color('#06b6d4'),c3=new THREE.Color('#34d399');
  const palette=[c1,c2,c3];
  for(let i=0;i<N;i++){
    positions[i*3]=(Math.random()-0.5)*18;
    positions[i*3+1]=(Math.random()-0.5)*12;
    positions[i*3+2]=(Math.random()-0.5)*10;
    const col=palette[Math.floor(Math.random()*3)];
    colors[i*3]=col.r; colors[i*3+1]=col.g; colors[i*3+2]=col.b;
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.BufferAttribute(positions,3));
  geo.setAttribute('color',new THREE.BufferAttribute(colors,3));
  const mat=new THREE.PointsMaterial({size:0.045,vertexColors:true,transparent:true,opacity:0.7,sizeAttenuation:true});
  const points=new THREE.Points(geo,mat);
  scene.add(points);

  // Glowing orbs
  const orbGeo=new THREE.SphereGeometry(0.3,16,16);
  const orbs=[];
  [{c:'#a78bfa',x:-3,y:1,z:-2},{c:'#06b6d4',x:3,y:-1,z:-3},{c:'#34d399',x:0,y:2,z:-4}].forEach(o=>{
    const m=new THREE.MeshBasicMaterial({color:o.c,transparent:true,opacity:0.15});
    const mesh=new THREE.Mesh(orbGeo,m);
    mesh.position.set(o.x,o.y,o.z);
    mesh.scale.setScalar(Math.random()*2+2);
    scene.add(mesh);
    orbs.push({mesh,oy:o.y,speed:Math.random()*0.5+0.3});
  });

  // Mouse parallax
  let mx=0,my=0;
  document.addEventListener('mousemove',e=>{
    mx=(e.clientX/window.innerWidth-0.5)*2;
    my=(e.clientY/window.innerHeight-0.5)*2;
  });

  let t=0;
  function animate(){
    requestAnimationFrame(animate);
    t+=0.005;
    points.rotation.y=t*0.05+mx*0.08;
    points.rotation.x=my*0.05;
    orbs.forEach(o=>{ o.mesh.position.y=o.oy+Math.sin(t*o.speed)*0.4; o.mesh.rotation.y+=0.004; });
    renderer.render(scene,camera);
  }
  animate();

  // CSS particles
  const field=document.getElementById('particlesField');
  if(field){
    for(let i=0;i<30;i++){
      const p=document.createElement('div');
      p.className='particle';
      const sz=Math.random()*3+1;
      p.style.cssText=`width:${sz}px;height:${sz}px;left:${Math.random()*100}%;bottom:-10px;animation-duration:${Math.random()*15+8}s;animation-delay:${Math.random()*10}s;opacity:0;`;
      field.appendChild(p);
    }
  }

  // Greeting
  const greet=document.getElementById('greetingLine');
  if(greet){
    const h=new Date().getHours();
    const msg=h<12?'Good morning ☀️':h<17?'Good afternoon 🌤️':h<21?'Good evening 🌆':'Good night 🌙';
    greet.textContent=msg;
  }

  // Stat counters
  document.querySelectorAll('[data-count]').forEach(el=>{
    const target=+el.dataset.count; let cur=0;
    const step=target/60;
    const iv=setInterval(()=>{
      cur=Math.min(cur+step,target);
      el.textContent=Math.floor(cur);
      if(cur>=target) clearInterval(iv);
    },25);
  });
})();
