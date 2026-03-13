/* =========================================
   CosmoServices — Main JavaScript
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ── Custom Cursor ──────────────────────────────────────────────
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');

  if (cursor && follower && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    const animateFollower = () => {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
      requestAnimationFrame(animateFollower);
    };
    animateFollower();

    const hoverEls = document.querySelectorAll('a, button, .service-card, .portfolio-item, .filter-btn');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => { cursor.classList.add('hovering'); follower.classList.add('hovering'); });
      el.addEventListener('mouseleave', () => { cursor.classList.remove('hovering'); follower.classList.remove('hovering'); });
    });
  }

  // ── Star Canvas Background ─────────────────────────────────────
  const canvas = document.getElementById('starCanvas');
  const ctx = canvas.getContext('2d');
  let stars = [], nebulas = [];
  const STAR_COUNT = 220;

  let mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  
  window.addEventListener('mousemove', (e) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
  });

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        originX: Math.random() * canvas.width,
        originY: Math.random() * canvas.height,
        radius: Math.random() * 1.8 + 0.2,
        opacity: Math.random() * 0.8 + 0.1,
        speedX: (Math.random() - 0.5) * 0.6,
        speedY: (Math.random() - 0.5) * 0.6,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
        hue: Math.random() * 60 + 220, // blue-purple range
      });
    }

    nebulas = [
      { x: canvas.width * 0.2, y: canvas.height * 0.3, vx: 0.5, vy: 0.3, radius: 350, color: 'rgba(124,58,237,0.06)' },
      { x: canvas.width * 0.8, y: canvas.height * 0.6, vx: -0.4, vy: 0.4, radius: 400, color: 'rgba(236,72,153,0.05)' },
      { x: canvas.width * 0.5, y: canvas.height * 0.15, vx: 0.3, vy: -0.5, radius: 450, color: 'rgba(59,130,246,0.04)' },
      { x: canvas.width * 0.1, y: canvas.height * 0.8, vx: 0.6, vy: -0.3, radius: 300, color: 'rgba(168,85,247,0.05)' },
      { x: canvas.width * 0.9, y: canvas.height * 0.1, vx: -0.5, vy: 0.5, radius: 350, color: 'rgba(6,182,212,0.04)' }
    ];
  }

  function drawNebulas() {
    nebulas.forEach(n => {
      // Move nebulas
      n.x += n.vx;
      n.y += n.vy;
      
      // Bounce off edges
      if (n.x < -n.radius || n.x > canvas.width + n.radius) n.vx *= -1;
      if (n.y < -n.radius || n.y > canvas.height + n.radius) n.vy *= -1;

      const dx = (mousePos.x - window.innerWidth/2) * 0.02;
      const dy = (mousePos.y - window.innerHeight/2) * 0.02;
      const gradient = ctx.createRadialGradient(n.x + dx, n.y + dy, 0, n.x + dx, n.y + dy, n.radius);
      gradient.addColorStop(0, n.color);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(n.x + dx, n.y + dy, n.radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawNebulas();

    // Mouse parallax offset
    const mx = (mousePos.x - window.innerWidth/2) * 0.05;
    const my = (mousePos.y - window.innerHeight/2) * 0.05;

    // Draw connecting lines first
    ctx.lineWidth = 0.5;
    for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
            const dx = stars[i].x - stars[j].x;
            const dy = stars[i].y - stars[j].y;
            const dist = dx * dx + dy * dy;

            if (dist < 12000) {
                const opacity = (1 - dist / 12000) * 0.15;
                ctx.strokeStyle = `rgba(124, 58, 237, ${opacity})`;
                ctx.beginPath();
                ctx.moveTo(stars[i].x - mx * (stars[i].radius*0.5), stars[i].y - my * (stars[i].radius*0.5));
                ctx.lineTo(stars[j].x - mx * (stars[j].radius*0.5), stars[j].y - my * (stars[j].radius*0.5));
                ctx.stroke();
            }
        }
    }

    stars.forEach(star => {
      // Twinkle
      star.opacity += star.twinkleSpeed * star.twinkleDir;
      if (star.opacity > 0.9 || star.opacity < 0.1) star.twinkleDir *= -1;

      // Constant fluid motion
      star.x += star.speedX;
      star.y += star.speedY;

      // Screen wrapping
      if (star.x < 0) star.x = canvas.width;
      if (star.x > canvas.width) star.x = 0;
      if (star.y < 0) star.y = canvas.height;
      if (star.y > canvas.height) star.y = 0;

      // Draw Star with parallax
      const renderX = star.x - mx * (star.radius * 0.8);
      const renderY = star.y - my * (star.radius * 0.8);

      ctx.beginPath();
      ctx.arc(renderX, renderY, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${star.hue}, 70%, 80%, ${star.opacity})`;
      ctx.fill();

      // Glow for larger stars
      if (star.radius > 1.2) {
        ctx.beginPath();
        ctx.arc(renderX, renderY, star.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${star.hue}, 70%, 80%, ${star.opacity * 0.12})`;
        ctx.fill();
      }
    });

    requestAnimationFrame(animateStars);
  }

  resizeCanvas();
  createStars();
  animateStars();

  window.addEventListener('resize', () => { resizeCanvas(); createStars(); });

  // ── Scroll Progress Bar ─────────────────────────────────────────
  const progressBar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = (scrollTop / docHeight) * 100;
    progressBar.style.width = percent + '%';
  }, { passive: true });

  // ── Navbar Scroll Effect ────────────────────────────────────────
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  // ── Mobile Hamburger ────────────────────────────────────────────
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ── Typing Effect (Hero) ─────────────────────────────────────────
  const typingEl = document.getElementById('typing-text');
  if (typingEl) {
    const phrases = ['Web Design', 'Branding', 'UI/UX', 'E-Commerce', 'SEO', 'Digital Strategy'];
    let phraseIndex = 0, charIndex = 0, deleting = false;

    const typeStep = () => {
      const current = phrases[phraseIndex];
      if (!deleting) {
        typingEl.textContent = current.slice(0, ++charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(typeStep, 1800);
          return;
        }
      } else {
        typingEl.textContent = current.slice(0, --charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }
      setTimeout(typeStep, deleting ? 60 : 100);
    };
    setTimeout(typeStep, 800);
  }

  // ── Counter Animation ───────────────────────────────────────────
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'));
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1800;
      const start = performance.now();

      const animate = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.7 });

  counters.forEach(c => counterObserver.observe(c));

  // ── Scroll Reveal ───────────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // ── Timeline Scroll Progress ─────────────────────────────────────
  const servicesTimeline = document.getElementById('servicesTimeline');
  const timelineProgress = document.getElementById('timelineProgress');
  
  if (servicesTimeline && timelineProgress) {
    window.addEventListener('scroll', () => {
      const rect = servicesTimeline.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      const start = viewportHeight / 2;
      const end = rect.height;
      
      let progress = (start - rect.top) / end;
      progress = Math.max(0, Math.min(1, progress));
      
      timelineProgress.style.height = `${progress * 100}%`;
    }, { passive: true });
  }

  // ── 3D Tilt on Service Cards ─────────────────────────────────────
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -10;
      const rotY = ((x - cx) / cx) * 10;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
    });
  });

  // ── Portfolio Filter ─────────────────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
          item.style.pointerEvents = 'auto';
        } else {
          item.style.opacity = '0.2';
          item.style.transform = 'scale(0.95)';
          item.style.pointerEvents = 'none';
        }
      });
    });
  });

  // ── Smooth Scroll for Nav links ──────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Contact Form ─────────────────────────────────────────────────
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('✅', 'Messaggio inviato! Ti risponderemo presto.');
      contactForm.reset();
    });
  }

  // ── Newsletter ───────────────────────────────────────────────────
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('🚀', 'Iscritto con successo alla newsletter!');
      newsletterForm.reset();
    });
  }

  // ── Toast Notification ───────────────────────────────────────────
  function showToast(icon, msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.querySelector('.toast-icon').textContent = icon;
    toast.querySelector('.toast-msg').textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  // ── Parallax on scroll (hero badge) ─────────────────────────────
  const heroBadge = document.querySelector('.hero-badge');
  if (heroBadge) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroBadge.style.transform = `translateY(${y * 0.1}px)`;
    }, { passive: true });
  }

  // ── 3D Globe (About Section) ────────────────────────────────────
  const about3dContainer = document.getElementById('about3dContainer');
  if (about3dContainer && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, about3dContainer.clientWidth / about3dContainer.clientHeight, 0.1, 1000);
    camera.position.z = 18;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(about3dContainer.clientWidth, about3dContainer.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    about3dContainer.appendChild(renderer.domElement);

    // Group to hold globe and ribbons
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 1. Core Globe (Dark/Tech style)
    const globeGeometry = new THREE.SphereGeometry(5, 64, 64);
    const globeMaterial = new THREE.MeshPhongMaterial({
      color: 0x050510,
      emissive: 0x220044,
      specular: 0x7c3aed,
      shininess: 50,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    globeGroup.add(globe);

    // Inner solid core to hide back wireframes slightly
    const coreMaterial = new THREE.MeshBasicMaterial({ color: 0x020205 });
    const core = new THREE.Mesh(new THREE.SphereGeometry(4.9, 32, 32), coreMaterial);
    globeGroup.add(core);

    // 2. Ribbon Cage (Orbiting lines)
    const ribbonCount = 8;
    for (let i = 0; i < ribbonCount; i++) {
      const ribbonGeo = new THREE.TorusGeometry(5.8, 0.05, 16, 100);
      const ribbonMat = new THREE.MeshBasicMaterial({ 
        color: i % 2 === 0 ? 0x7c3aed : 0xec4899,
        transparent: true,
        opacity: 0.8
      });
      const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
      
      // Randomize initial rotations
      ribbon.rotation.x = Math.random() * Math.PI;
      ribbon.rotation.y = Math.random() * Math.PI;
      
      // Store custom rotation speeds
      ribbon.userData = {
        speedX: (Math.random() - 0.5) * 0.01,
        speedY: (Math.random() - 0.5) * 0.01,
        speedZ: (Math.random() - 0.5) * 0.01
      };
      
      globeGroup.add(ribbon);
    }

    // 3. Floating Particles (Data nodes)
    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 150;
    const posArray = new Float32Array(particleCount * 3);
    
    for(let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 20;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.08,
      color: 0x3bb2f6,
      transparent: true,
      opacity: 0.6
    });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    globeGroup.add(particles);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x7c3aed, 2);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xec4899, 2);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
      mouseX = (event.clientX - windowHalfX);
      mouseY = (event.clientY - windowHalfY);
    });

    // Resize Handler
    window.addEventListener('resize', () => {
      if(!about3dContainer) return;
      camera.aspect = about3dContainer.clientWidth / about3dContainer.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(about3dContainer.clientWidth, about3dContainer.clientHeight);
    });

    // Animation Loop
    const clock = new THREE.Clock();
    function animate3D() {
      requestAnimationFrame(animate3D);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      targetX = mouseX * .001;
      targetY = mouseY * .001;
      
      globeGroup.rotation.y += 0.005;
      globeGroup.rotation.x += 0.05 * (targetY - globeGroup.rotation.x);
      globeGroup.rotation.y += 0.05 * (targetX - globeGroup.rotation.y);
      
      // Floating effect
      globeGroup.position.y = Math.sin(elapsedTime * 0.5) * 0.5;

      // Animate Ribbons
      globeGroup.children.forEach(child => {
        if(child.geometry.type === 'TorusGeometry') {
          child.rotation.x += child.userData.speedX;
          child.rotation.y += child.userData.speedY;
          child.rotation.z += child.userData.speedZ;
        }
      });
      
      // Animate Particles
      particles.rotation.y = -elapsedTime * 0.05;

      renderer.render(scene, camera);
    }
    animate3D();
  }

  // ── 3D Schematic Icons (Homepage) ───────────────────────────────
  const schematicIcons = [
    document.getElementById('schematicIcon1'),
    document.getElementById('schematicIcon2'),
    document.getElementById('schematicIcon3'),
    document.getElementById('schematicIcon4')
  ];

  if (schematicIcons.every(icon => icon !== null) && typeof THREE !== 'undefined') {
    const iconScenes = [];

    schematicIcons.forEach((container, index) => {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
      camera.position.z = 8; // Closer zoom for icons

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);
      
      const dirLight = new THREE.DirectionalLight(0xffffff, 1);
      dirLight.position.set(5, 5, 5);
      scene.add(dirLight);

      const modelGroup = new THREE.Group();
      scene.add(modelGroup);

      // Generate specific model based on index
      if (index === 0) { // Discovery
        const icoGeo = new THREE.IcosahedronGeometry(2, 1);
        const icoMat = new THREE.MeshPhongMaterial({ color: 0x7c3aed, wireframe: true });
        const icoMesh = new THREE.Mesh(icoGeo, icoMat);
        modelGroup.add(icoMesh);
      } else if (index === 1) { // Prototyping
        const boxGeo = new THREE.BoxGeometry(1, 1, 1);
        const boxMat = new THREE.MeshPhongMaterial({ color: 0x3bb2f6 });
        [[0,0,0], [1.1,0,0], [0,1.1,0]].forEach(pos => {
          const box = new THREE.Mesh(boxGeo, boxMat);
          box.position.set(...pos);
          modelGroup.add(box);
        });
        modelGroup.position.set(-0.5, -0.5, 0); // Center the group
      } else if (index === 2) { // Tuning
        const ringMat = new THREE.MeshPhongMaterial({ color: 0x06b6d4, side: THREE.DoubleSide });
        for(let i=0; i<3; i++) {
          const ring = new THREE.Mesh(new THREE.TorusGeometry(1.5 + i*0.5, 0.1, 16, 50), ringMat);
          ring.userData = { speedX: (Math.random()-0.5)*0.05, speedY: (Math.random()-0.5)*0.05 };
          ring.rotation.x = Math.random() * Math.PI;
          modelGroup.add(ring);
        }
        const centerSphere = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 16), new THREE.MeshPhongMaterial({color: 0x7c3aed}));
        modelGroup.add(centerSphere);
      } else if (index === 3) { // Go Live
        const rocketBody = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.8, 2, 16), new THREE.MeshPhongMaterial({color: 0xec4899}));
        const rocketNose = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1, 16), new THREE.MeshPhongMaterial({color: 0x7c3aed}));
        rocketNose.position.y = 1.5;
        modelGroup.add(rocketBody);
        modelGroup.add(rocketNose);
        modelGroup.rotation.z = -Math.PI / 4;
      }

      iconScenes.push({ scene, camera, renderer, modelGroup, index });
    });

    const clock = new THREE.Clock();
    function animateSchematicIcons() {
      requestAnimationFrame(animateSchematicIcons);
      const elapsedTime = clock.getElapsedTime();

      iconScenes.forEach(({ scene, camera, renderer, modelGroup, index }) => {
        if (index === 0) {
          modelGroup.rotation.x += 0.01;
          modelGroup.rotation.y += 0.01;
        } else if (index === 1) {
          modelGroup.rotation.y += 0.02;
          modelGroup.rotation.x = Math.sin(elapsedTime) * 0.5;
        } else if (index === 2) {
          modelGroup.children.forEach(child => {
            if (child.geometry.type === 'TorusGeometry') {
              child.rotation.x += child.userData.speedX;
              child.rotation.y += child.userData.speedY;
            }
          });
          modelGroup.rotation.y += 0.01;
        } else if (index === 3) {
          modelGroup.position.y = Math.sin(elapsedTime * 3) * 0.2;
          modelGroup.position.x = Math.cos(elapsedTime * 3) * 0.1;
        }
        renderer.render(scene, camera);
      });
    }

    animateSchematicIcons();

    // Resize handler
    window.addEventListener('resize', () => {
      schematicIcons.forEach((container, i) => {
        if(!container) return;
        const info = iconScenes[i];
        info.camera.aspect = container.clientWidth / container.clientHeight;
        info.camera.updateProjectionMatrix();
        info.renderer.setSize(container.clientWidth, container.clientHeight);
      });
    });
  }

  // ── 3D Sticky Scroll Logic (Metodo Page) ────────────────────────
  const scrollSteps = document.querySelectorAll('.scroll-step');
  const method3dContainer = document.getElementById('method3dContainer');
  const method3dTitle = document.getElementById('method3dTitle');

  if (scrollSteps.length > 0 && method3dContainer && typeof THREE !== 'undefined') {
    
    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, method3dContainer.clientWidth / method3dContainer.clientHeight, 0.1, 1000);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(method3dContainer.clientWidth, method3dContainer.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    method3dContainer.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const pointLight1 = new THREE.PointLight(0x7c3aed, 2, 50);
    pointLight1.position.set(-5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xec4899, 2, 50);
    pointLight2.position.set(5, -5, 5);
    scene.add(pointLight2);

    // Group to hold all models
    const modelsGroup = new THREE.Group();
    scene.add(modelsGroup);

    // Array to store the 4 models
    const stepModels = [];

    // --- Model 1: Discovery (Data node / Icosahedron) ---
    const m1Group = new THREE.Group();
    const icoGeo = new THREE.IcosahedronGeometry(2.5, 1);
    const icoMat = new THREE.MeshPhongMaterial({ color: 0x7c3aed, wireframe: true, transparent: true, opacity: 0.8 });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    const coreGeo = new THREE.IcosahedronGeometry(1.5, 0);
    const coreMat = new THREE.MeshPhongMaterial({ color: 0xec4899 });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    m1Group.add(icoMesh);
    m1Group.add(coreMesh);
    stepModels.push(m1Group);

    // --- Model 2: Prototyping (Building blocks) ---
    const m2Group = new THREE.Group();
    const boxGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const boxMat = new THREE.MeshPhongMaterial({ color: 0x3bb2f6, shininess: 80 });
    const positions = [ [0,0,0], [1.3,0,0], [0,1.3,0], [0,0,1.3], [-1.3,0,0], [0,-1.3,0] ];
    positions.forEach(pos => {
      const box = new THREE.Mesh(boxGeo, boxMat);
      box.position.set(...pos);
      m2Group.add(box);
    });
    stepModels.push(m2Group);

    // --- Model 3: Tuning (Gyroscopic Rings) ---
    const m3Group = new THREE.Group();
    const ringMat = new THREE.MeshPhongMaterial({ color: 0x06b6d4, side: THREE.DoubleSide });
    for(let i=0; i<3; i++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(2 + i*0.8, 0.15, 16, 100), ringMat);
      ring.userData = { speedX: Math.random()*0.02, speedY: Math.random()*0.02 };
      ring.rotation.x = Math.random() * Math.PI;
      ring.rotation.y = Math.random() * Math.PI;
      m3Group.add(ring);
    }
    const sphereCenter = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshPhongMaterial({color: 0x7c3aed}));
    m3Group.add(sphereCenter);
    stepModels.push(m3Group);

    // --- Model 4: Go Live! (Rocket Shape) ---
    const m4Group = new THREE.Group();
    const rocketBody = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 1, 3, 32), new THREE.MeshPhongMaterial({color: 0xec4899}));
    const rocketNose = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.5, 32), new THREE.MeshPhongMaterial({color: 0x7c3aed}));
    rocketNose.position.y = 2.25;
    const rocketFin1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1, 1), new THREE.MeshPhongMaterial({color: 0x3bb2f6}));
    rocketFin1.position.set(1, -1, 0);
    const rocketFin2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1, 1), new THREE.MeshPhongMaterial({color: 0x3bb2f6}));
    rocketFin2.position.set(-1, -1, 0);
    m4Group.add(rocketBody);
    m4Group.add(rocketNose);
    m4Group.add(rocketFin1);
    m4Group.add(rocketFin2);
    // Add particle thrust
    const thrustGeo = new THREE.BufferGeometry();
    const tPos = new Float32Array(100 * 3);
    for(let i=0; i<300; i++) tPos[i] = (Math.random()-0.5)*1.5;
    thrustGeo.setAttribute('position', new THREE.BufferAttribute(tPos, 3));
    const thrust = new THREE.Points(thrustGeo, new THREE.PointsMaterial({color: 0xffaa00, size: 0.1}));
    thrust.position.y = -2;
    m4Group.add(thrust);
    m4Group.rotation.z = -Math.PI / 6; // Angle it upwards to the right
    stepModels.push(m4Group);

    // Add all models to scene but hide them initially
    stepModels.forEach((model, index) => {
      model.visible = false;
      model.scale.set(0.01, 0.01, 0.01);
      modelsGroup.add(model);
    });

    const stepTitles = ["Fase 1: Discovery", "Fase 2: Prototipazione", "Fase 3: Sviluppo & Tuning", "Fase 4: Go Live!"];
    let activeIndex = -1;

    // Handle Scroll
    const handleScroll = () => {
      const viewportCenter = window.innerHeight / 2;
      let closestStepIndex = 0;
      let minDistance = Infinity;

      scrollSteps.forEach((step, index) => {
        const rect = step.getBoundingClientRect();
        // Calculate the center of the step element
        const stepCenter = rect.top + rect.height / 2;
        const distance = Math.abs(viewportCenter - stepCenter);
        
        if (distance < minDistance) {
          minDistance = distance;
          closestStepIndex = index;
        }
      });

      if (closestStepIndex !== activeIndex) {
        activeIndex = closestStepIndex;
        // Update HTML classes
        scrollSteps.forEach(step => step.classList.remove('active'));
        scrollSteps[activeIndex].classList.add('active');
        
        // Update Title
        if (method3dTitle) {
          method3dTitle.style.opacity = 0;
          setTimeout(() => {
            method3dTitle.textContent = stepTitles[activeIndex];
            method3dTitle.style.opacity = 1;
          }, 300);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on load
    handleScroll();

    // Resize Handler
    window.addEventListener('resize', () => {
      if(!method3dContainer) return;
      camera.aspect = method3dContainer.clientWidth / method3dContainer.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(method3dContainer.clientWidth, method3dContainer.clientHeight);
    });

    // Mouse Interaction for 3D
    let mouseX = 0, mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    method3dContainer.addEventListener('mousemove', (event) => {
      const rect = method3dContainer.getBoundingClientRect();
      mouseX = (event.clientX - rect.left - rect.width/2);
      mouseY = (event.clientY - rect.top - rect.height/2);
    });

    // Animation Loop
    const clock = new THREE.Clock();
    function animateMethod3D() {
      requestAnimationFrame(animateMethod3D);
      const elapsedTime = clock.getElapsedTime();

      // Smooth switch models
      stepModels.forEach((model, index) => {
        if (index === activeIndex) {
          model.visible = true;
          // Lerp scale to 1
          model.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
          
          // Custom animations per model
          if(index === 0) { // Discovery
            model.rotation.y += 0.005;
            model.rotation.x += 0.005;
          } else if(index === 1) { // Prototyping
            model.rotation.y += 0.01;
            model.children.forEach((child, i) => {
               child.rotation.x += 0.01 * (i%2 ? 1 : -1);
               child.rotation.y += 0.01;
            });
          } else if(index === 2) { // Tuning
             model.children.forEach(child => {
                if(child.geometry.type === 'TorusGeometry') {
                   child.rotation.x += child.userData.speedX;
                   child.rotation.y += child.userData.speedY;
                }
             });
             model.rotation.y += 0.005;
          } else if(index === 3) { // Launch
             model.position.y = Math.sin(elapsedTime * 2) * 0.2;
             const thrust = model.children[model.children.length-1];
             if(thrust) {
                const pos = thrust.geometry.attributes.position.array;
                for(let i=1; i<pos.length; i+=3) {
                   pos[i] -= 0.1;
                   if(pos[i] < -2) pos[i] = 0;
                }
                thrust.geometry.attributes.position.needsUpdate = true;
             }
          }
          
        } else {
          // Lerp scale to 0
          model.scale.lerp(new THREE.Vector3(0.01, 0.01, 0.01), 0.1);
          if (model.scale.x < 0.05) model.visible = false;
        }
      });

      // Interactive rotation based on mouse
      const targetX = mouseX * 0.001;
      const targetY = mouseY * 0.001;
      modelsGroup.rotation.y += 0.05 * (targetX - modelsGroup.rotation.y);
      modelsGroup.rotation.x += 0.05 * (targetY - modelsGroup.rotation.x);

      renderer.render(scene, camera);
    }
    
    animateMethod3D();
  }

}); // end DOMContentLoaded
