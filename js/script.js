document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('nav');
  const menuBtn = document.querySelector('#menu-toggle');
  const mobileMenu = document.querySelector('#mobile-menu');
  const yearEl = document.querySelector('#year');
  const page = document.body.dataset.page;

  const handleNav = () => {
    if (window.scrollY > 30) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
  };

  handleNav();
  window.addEventListener('scroll', handleNav);

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    revealElements.forEach((el) => observer.observe(el));
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (!mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
        }
      }
    });
  });


  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  if (page) {
    const active = document.querySelectorAll(`[data-page-link="${page}"]`);
    active.forEach((link) => link.classList.add('text-accent', 'font-semibold'));
  }
});

function toggleMainMenu() {
  const menu = document.getElementById("mobile-menu");
  if (!menu) {
    console.log("mobile-menu not found");
    return;
  }
  menu.classList.toggle("show");
}


// ================= SERVICE WORKER REGISTRATION =================
// Register Service Worker for image caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('[Service Worker] Registration successful:', registration.scope);
        
        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000); // Check for updates every hour
        
        // Trigger cache cleanup on page load
        if (registration.active) {
          registration.active.postMessage({ type: 'CLEANUP_CACHE' });
        }
      })
      .catch((error) => {
        console.error('[Service Worker] Registration failed:', error);
      });
  });
  
  // Listen for service worker updates
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('[Service Worker] New service worker activated');
    // Optionally reload the page to use the new service worker
    // window.location.reload();
  });
}

// Services page (optional)
const cards = document.querySelectorAll(".service-card");

window.addEventListener("scroll", () => {
  cards.forEach(card => {
    const pos = card.getBoundingClientRect().top;
    if(pos < window.innerHeight - 80){
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }
  });
});

const serviceData = {
  western:{
    title:"Western Dance Training",
    body:`
  <p><strong>Western Dance Classes</strong> focus on hip-hop, jazz, freestyle and modern techniques.</p>
  <p>Students develop rhythm, posture, coordination and performance confidence.</p>
  <p>Our professional trainers guide learners from beginner to advanced levels with structured practice sessions.</p>
  <p>These classes help improve body flexibility, stage performance skills, and overall physical fitness.</p>
  <p>Perfect for school events, competitions, auditions, and professional dance careers.</p>
  <p><b>Keywords:</b> western dance classes, modern dance academy, hip hop training, dance school near me, professional dance coaching</p>
`
  },
  
  bollywood:{
  title:"Bollywood Dance Program",
  body:`
    <p>Learn expressive Bollywood choreography inspired by Indian cinema.</p>
    <p>Perfect for weddings, stage shows and competitions.</p>
    <p>Our classes focus on facial expressions, body language, and energetic performance style.</p>
    <p>Students gain confidence, stage presence, and rhythm sense.</p>
    <p><b>Keywords:</b> bollywood dance class, indian dance academy, film dance training, dance school near me</p>
  `
},

folk:{
  title:"Folk Dance Training",
  body:`
    <p>Experience cultural dances like Bhangra, Garba & Kolattam.</p>
    <p>Builds discipline, teamwork and cultural pride.</p>
    <p>Students learn the history and tradition behind every dance form.</p>
    <p>Improves coordination, group performance, and stage confidence.</p>
    <p><b>Keywords:</b> folk dance classes, traditional dance academy, cultural dance training</p>
  `
},

hiphop:{
  title:"Hip Hop Dance Classes",
  body:`
    <p>Urban dance focusing on freestyle, popping and locking.</p>
    <p>Boosts stamina and stage presence.</p>
    <p>Students learn groove techniques, footwork, and freestyle battles.</p>
    <p>Perfect for competitions, reels, and performance stages.</p>
    <p><b>Keywords:</b> hip hop dance class, street dance training, urban dance academy</p>
  `
},

freestyle:{
  title:"Freestyle Dance Training",
  body:`
    <p>Encourages creativity and individual movement style.</p>
    <p>Improves confidence and musicality.</p>
    <p>Students learn how to express emotions through dance.</p>
    <p>Helps build a unique dance identity for performances.</p>
    <p><b>Keywords:</b> freestyle dance class, creative dance training, modern dance academy</p>
  `
},

contemporary:{
  title:"Contemporary Dance Program",
  body:`
    <p>Elegant dance style blending ballet and modern techniques.</p>
    <p>Great for storytelling and emotional performances.</p>
    <p>Improves flexibility, balance, and expressive movement.</p>
    <p>Ideal for stage shows, competitions, and choreography training.</p>
    <p><b>Keywords:</b> contemporary dance class, modern dance academy, expressive dance training</p>
  `
},

zumba:{
  title:"Zumba Fitness Classes",
  body:`
    <p>Fun cardio workout combining dance and fitness.</p>
    <p>Ideal for weight loss and stress relief.</p>
    <p>Burn calories while enjoying energetic music and movement.</p>
    <p>Improves stamina, flexibility, and overall body fitness.</p>
    <p><b>Keywords:</b> zumba classes near me, dance fitness program, weight loss workout</p>
  `
},

aerobics:{
  title:"Aerobics Training",
  body:`
    <p>High-energy sessions improving heart health and endurance.</p>
    <p>Boosts metabolism and increases daily energy levels.</p>
    <p>Helps in weight management and full-body toning.</p>
    <p>Suitable for all age groups and fitness levels.</p>
    <p><b>Keywords:</b> aerobics classes, fitness training center, cardio workout program</p>
  `
},

stick:{
  title:"Stick Workout Program",
  body:`
    <p>Improves coordination, reflex and strength.</p>
    <p>Fun group workout using rhythmic stick movements.</p>
    <p>Enhances focus, balance, and hand-eye coordination.</p>
    <p>Perfect for both fitness and stress relief.</p>
    <p><b>Keywords:</b> stick workout classes, coordination training, group fitness program</p>
  `
},

chair:{
  title:"Chair Workout Sessions",
  body:`
    <p>Low-impact workouts for beginners and seniors.</p>
    <p>Improves joint mobility and muscle flexibility.</p>
    <p>Safe fitness option for people with limited movement.</p>
    <p>Great for rehabilitation and daily activity support.</p>
    <p><b>Keywords:</b> chair exercises, senior fitness classes, low impact workout</p>
  `
},

ball:{
  title:"Ball Workout Training",
  body:`
    <p>Balance and core strengthening exercises.</p>
    <p>Improves posture and spinal support.</p>
    <p>Helps develop flexibility and muscle coordination.</p>
    <p>Fun and effective fitness method for all ages.</p>
    <p><b>Keywords:</b> ball workout training, core fitness program, balance exercises</p>
  `
},

leg:{
  title:"Leg Workout Program",
  body:`
    <p>Strengthens lower body and improves flexibility.</p>
    <p>Focuses on thighs, calves, and hip muscles.</p>
    <p>Enhances stamina for dancers and athletes.</p>
    <p>Helps prevent injuries and supports better movement.</p>
    <p><b>Keywords:</b> leg workout training, lower body fitness, dance strength program</p>
  `

  }
};

function openModal(key){
  document.getElementById("modalTitle").innerHTML = serviceData[key].title;
  document.getElementById("modalBody").innerHTML = serviceData[key].body;
  document.getElementById("serviceModal").style.display="flex";
}

function closeModal(){
  document.getElementById("serviceModal").style.display="none";
}
