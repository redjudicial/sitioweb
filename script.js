// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            // Solo scroll si es un anchor interno
            if (targetId && targetId.startsWith('#')) {
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                // Calcular offset para evitar que el header tape el contenido
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 40; // 40px extra de espacio
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                }
            } else {
                // Si es un enlace externo, redirige normalmente
                window.location.href = targetId;
            }
        });
    });

    // FAQ Accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinksContainer.classList.toggle('active');
        });
    }

    // Form submission handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            if (!data.nombres || !data.apellidos || !data.email || !data.celular || !data.profesion) {
                showNotification('Por favor completa todos los campos requeridos.', 'error');
                return;
            }
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Por favor ingresa un email válido.', 'error');
                return;
            }
            // Phone validation - el campo celular solo contiene números, el +56 está en el span
            const phoneRegex = /^\d{7,9}$/;
            if (!phoneRegex.test(data.celular)) {
                showNotification('Por favor ingresa un número de celular válido (7-9 dígitos).', 'error');
                return;
            }
            // Rut validation (opcional, si el campo existe)
            if (data.rut && data.rut.length < 7) {
                showNotification('Por favor ingresa un RUT válido.', 'error');
                return;
            }
            // Envío real a Supabase
            try {
                const res = await fetch('https://qfomiierchksyfhxoukj.supabase.co/rest/v1/postulantes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmb21paWVyY2hrc3lmaHhvdWtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMjgxNTYsImV4cCI6MjA2NjYwNDE1Nn0.HqlptdYXjd2s9q8xHEmgQPyf6a95fosb0YT5b4asMA8',
                        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmb21paWVyY2hrc3lmaHhvdWtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMjgxNTYsImV4cCI6MjA2NjYwNDE1Nn0.HqlptdYXjd2s9q8xHEmgQPyf6a95fosb0YT5b4asMA8'
                    },
                    body: JSON.stringify({
                        nombres: data.nombres,
                        apellidos: data.apellidos,
                        email: data.email,
                        celular: data.celular,
                        profesion: data.profesion,
                        profesion_otro: data.profesion_otro || null,
                        rut: data.rut || null
                    })
                });
                if (res.ok) {
                    showNotification('¡Formulario enviado con éxito! Te contactaremos pronto.', 'success');
            this.reset();
                    // Ocultar campo "otro" si está visible
                    const profesionOtroGroup = document.getElementById('profesion-otro-group');
                    if (profesionOtroGroup) {
                        profesionOtroGroup.style.display = 'none';
                    }
                } else {
                    const error = await res.json();
                    showNotification('Error al enviar el formulario: ' + (error.message || 'Intenta nuevamente.'), 'error');
                }
            } catch (err) {
                showNotification('Error de conexión. Intenta nuevamente.', 'error');
            }
        });
    }

    // Header scroll effect
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
        
        lastScrollTop = scrollTop;
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .faq-item, .contact-form');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#4299e1'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;

        notification.querySelector('.notification-content').style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
        `;

        notification.querySelector('.notification-close').style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        `;

        // Add to page
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', function() {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 5000);
    }

    // Add loading animation to buttons
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-submit');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.type === 'submit') return; // Skip for form submit buttons
            
            const originalText = this.textContent;
            this.textContent = 'Cargando...';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
            }, 2000);
        });
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        // Solo aplicar en desktop (ancho > 1024px)
        if (window.innerWidth > 1024) {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroVisual = document.querySelector('.hero-visual');
        if (heroVisual) {
            heroVisual.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        }
    });

    // Add hover effects to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Pricing toggle functionality
    const billingToggle = document.getElementById('billingToggle');
    const prices = document.querySelectorAll('.price[data-monthly]');
    const periods = document.querySelectorAll('.period');
    const originalPrices = document.querySelectorAll('.original-price');

    function setBillingState(isAnnual) {
        prices.forEach(price => {
            const monthlyPrice = price.getAttribute('data-monthly');
            const annualPrice = price.getAttribute('data-annual');
            if (isAnnual) {
                price.textContent = `$${annualPrice}`;
                price.style.color = '#48bb78';
            } else {
                price.textContent = `$${monthlyPrice}`;
                price.style.color = '#1a365d';
            }
        });
        periods.forEach(period => {
            if (isAnnual) {
                period.textContent = '/mes, facturado anualmente';
            } else {
                period.textContent = '/mes';
            }
        });
        originalPrices.forEach(originalPrice => {
            const monthlyOriginal = originalPrice.getAttribute('data-monthly');
            const annualOriginal = originalPrice.getAttribute('data-annual');
            if (isAnnual) {
                originalPrice.querySelector('.original-amount').textContent = `$${annualOriginal}`;
                originalPrice.querySelector('.original-period').textContent = '/año';
                originalPrice.classList.add('show');
            } else {
                originalPrice.classList.remove('show');
            }
        });
        const saveBadge = document.querySelector('.save-badge');
        if (saveBadge) {
            if (isAnnual) {
                saveBadge.style.background = '#48bb78';
                saveBadge.textContent = 'Ahorra 20%';
            } else {
                saveBadge.style.background = '#a0aec0';
                saveBadge.textContent = 'Ahorra 20%';
            }
        }
    }

    if (billingToggle) {
        // Activar anual por defecto al cargar
        setBillingState(true);
        billingToggle.addEventListener('change', function() {
            setBillingState(this.checked);
        });
    }

    // Pricing card interactions
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('freemium')) {
                this.style.transform = 'translateY(-8px)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (this.classList.contains('featured')) {
                this.style.transform = 'scale(1.05)';
            } else if (!this.classList.contains('freemium')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });

    // Plan button interactions
    const planButtons = document.querySelectorAll('.btn-plan');
    planButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.classList.contains('btn-freemium')) {
                e.preventDefault();
                showNotification('Ya tienes acceso al plan Freemium', 'info');
                return;
            }
            
            if (this.classList.contains('btn-enterprise')) {
                e.preventDefault();
                // Scroll to contact form
                const contactSection = document.querySelector('#contacto');
                if (contactSection) {
                    // Calcular offset para evitar que el header tape el contenido
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = contactSection.offsetTop - headerHeight - 40; // 40px extra de espacio
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
                showNotification('Te contactaremos pronto para discutir tu plan personalizado', 'success');
                return;
            }
            
            // For other plans, show success message
            const planName = this.textContent.replace('Comenzar ', '');
            showNotification(`¡Excelente elección! Te contactaremos pronto sobre el plan ${planName}`, 'success');
        });
    });
}); 

// --- Configuración de Supabase ---
const SUPABASE_URL = 'https://qfomiierchksyfhxoukj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmb21paWVyY2hrc3lmaHhvdWtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMjgxNTYsImV4cCI6MjA2NjYwNDE1Nn0.HqlptdYXjd2s9q8xHEmgQPyf6a95fosb0YT5b4asMA8';

// --- Lógica para mostrar campo 'Otro/a' ---
document.addEventListener('DOMContentLoaded', function() {
    const profesionSelect = document.getElementById('profesion');
    const profesionOtroGroup = document.getElementById('profesion-otro-group');
    profesionSelect.addEventListener('change', function() {
        if (profesionSelect.value === 'Otro/a') {
            profesionOtroGroup.style.display = 'block';
            document.getElementById('profesion_otro').required = true;
        } else {
            profesionOtroGroup.style.display = 'none';
            document.getElementById('profesion_otro').required = false;
        }
    });
});

// --- Validación de RUT ---
function validarRut(rut) {
    rut = rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();
    if (!/^\d{7,8}[0-9K]$/.test(rut)) return false;
    let cuerpo = rut.slice(0, -1);
    let dv = rut.slice(-1);
    let suma = 0, multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo[i]) * multiplo;
        multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }
    let dvEsperado = 11 - (suma % 11);
    dvEsperado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
    return dv === dvEsperado;
}

document.addEventListener('DOMContentLoaded', function() {
    const rutInput = document.getElementById('rut');
    const rutError = document.getElementById('rut-error');
    rutInput.addEventListener('input', function() {
        if (rutInput.value.length > 0 && !validarRut(rutInput.value)) {
            rutError.style.display = 'inline';
        } else {
            rutError.style.display = 'none';
        }
    });
});

// --- Envío a Supabase ---
// NOTA: El manejador de formulario principal ya está definido arriba en el archivo
// y maneja tanto la validación como el envío a Supabase 

// --- Scroll top button ---
document.addEventListener('DOMContentLoaded', function() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}); 

// Cambia color de la flecha cuando está sobre el footer
window.addEventListener('scroll', () => {
  const scrollBtn = document.getElementById('scrollTopBtn');
  const footer = document.querySelector('footer');
  if (!scrollBtn || !footer) return;
  const btnRect = scrollBtn.getBoundingClientRect();
  const footerRect = footer.getBoundingClientRect();
  if (btnRect.bottom > footerRect.top) {
    scrollBtn.classList.add('on-footer');
  } else {
    scrollBtn.classList.remove('on-footer');
  }
});

// Animación de conteo para stats-section
function animateStats() {
  const stats = document.querySelectorAll('.stats-section .stat-number');
  stats.forEach(stat => {
    const text = stat.textContent.trim();
    const isPlus = text.startsWith('+');
    const clean = text.replace(/[^\d]/g, '');
    const target = parseInt(clean, 10);
    if (!target || stat.dataset.animated) return;
    stat.dataset.animated = '1';
    let current = 1;
    const duration = 900;
    const steps = 40;
    const increment = Math.ceil(target / steps);
    function update() {
      current += increment;
      if (current >= target) {
        stat.textContent = (isPlus ? '+' : '') + target.toLocaleString('es-CL');
      } else {
        stat.textContent = (isPlus ? '+' : '') + current.toLocaleString('es-CL');
        requestAnimationFrame(update);
      }
    }
    update();
  });
}

function statsInView() {
  const section = document.querySelector('.stats-section');
  if (!section) return false;
  const rect = section.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

let statsAnimated = false;
window.addEventListener('scroll', () => {
  if (!statsAnimated && statsInView()) {
    animateStats();
    statsAnimated = true;
  }
}); 

// Animación de texto HERO: Conecta. Comparte. Crece. (acumulativa, sin glow, espacio siempre reservado)
document.addEventListener('DOMContentLoaded', function() {
    const palabras = ['Conecta.', 'Comparte.', 'Crece.'];
    const spans = [
        document.getElementById('word-0'),
        document.getElementById('word-1'),
        document.getElementById('word-2')
    ];
    const placeholder = document.getElementById('hero-anim-placeholder');
    if (spans.every(Boolean) && placeholder) {
        // Limpiar texto inicial y mostrar placeholder para reservar espacio
        spans.forEach(span => { span.textContent = ''; span.style.visibility = 'hidden'; });
        placeholder.style.display = 'inline-block';
        let i = 0;
        const animar = () => {
            if (i < palabras.length) {
                spans[i].textContent = palabras[i];
                spans[i].style.visibility = 'visible';
                i++;
                setTimeout(animar, 2000);
            }
        };
        setTimeout(animar, 2000); // Espera 2s antes de mostrar 'Conecta.'
    }
}); 