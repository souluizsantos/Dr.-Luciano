document.addEventListener('DOMContentLoaded', () => {

    // ================================================
    // NAVBAR — sombra ao rolar
    // ================================================
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.style.boxShadow = '0 8px 30px rgba(0,0,0,0.07)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    }, { passive: true });


    // ================================================
    // MENU MOBILE — hamburguer
    // ================================================
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    function openMenu() {
        hamburger.classList.add('active');
        mobileMenu.classList.add('open');
        document.body.classList.add('menu-open');
        hamburger.setAttribute('aria-expanded', 'true');
        mobileMenu.setAttribute('aria-hidden', 'false');
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.classList.remove('menu-open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
    }

    hamburger.addEventListener('click', () => {
        if (mobileMenu.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    document.querySelectorAll('.mobile-link, .mobile-cta').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
            closeMenu();
        }
    });


    // ================================================
    // SMOOTH SCROLL — âncoras internas
    // ================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetSelector = this.getAttribute('href');
            if (targetSelector === '#') return;
            const target = document.querySelector(targetSelector);
            if (target) {
                e.preventDefault();
                closeMenu();
                window.scrollTo({
                    top: target.offsetTop - 88,
                    behavior: 'smooth'
                });
            }
        });
    });


    // ================================================
    // SCROLL REVEAL — seções entram suavemente
    // ================================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    document.querySelectorAll('section > .container').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(28px)';
        el.style.transition = 'opacity 0.85s cubic-bezier(0.165, 0.84, 0.44, 1), transform 0.85s cubic-bezier(0.165, 0.84, 0.44, 1)';
        revealObserver.observe(el);
    });




    // ================================================
    // STICKY CTA — aparece após o hero sair do viewport (mobile)
    // ================================================
    const stickyCta = document.getElementById('stickyCta');
    const heroSection = document.querySelector('.hero');

    if (stickyCta && heroSection) {
        const stickyObserver = new IntersectionObserver(
            ([entry]) => {
                stickyCta.style.display = entry.isIntersecting ? 'none' : '';
            },
            { threshold: 0.1 }
        );
        stickyObserver.observe(heroSection);
    }


    // ================================================
    // RASTREAMENTO — cliques em links WhatsApp
    // Dispara fbq Lead/Contact e gtag event quando
    // o Meta Pixel / GA4 estiverem ativos
    // ================================================
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
        link.addEventListener('click', () => {
            var href = link.href || '';
            var category = 'consulta';
            var value = 350;

            if (href.includes('implantes')) { category = 'implante'; value = 3500; }
            else if (href.includes('ortodontico') ||
                href.includes('ortodontia')) { category = 'ortodontia'; value = 2500; }
            else if (href.includes('estetica') ||
                href.includes('est%C3%A9tica')) { category = 'estetica'; value = 1500; }
            else if (href.includes('proteses') ||
                href.includes('pr%C3%B3teses')) { category = 'protese'; value = 2000; }

            if (typeof fbq === 'function') {
                fbq('track', 'Lead', { content_category: category, currency: 'BRL', value: value });
                fbq('track', 'Contact');
            }

            if (typeof gtag === 'function') {
                gtag('event', 'whatsapp_click', {
                    event_category: 'engagement',
                    event_label: link.textContent.trim() || 'whatsapp_button',
                    value: value
                });
            }
        });
    });


    // ================================================
    // FAQ — acordeão
    // ================================================
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isOpen = item.classList.contains('active');

            document.querySelectorAll('.faq-item.active').forEach(openItem => {
                openItem.classList.remove('active');
                openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            if (!isOpen) {
                item.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });


    // ================================================
    // DEPOIMENTOS — dots + scroll-sync mobile
    // ================================================
    const wrapper = document.getElementById('testimonialsWrapper');
    const dots = document.querySelectorAll('.testimonial-dot');

    if (wrapper && dots.length) {
        const testimonials = wrapper.querySelectorAll('.testimonial');

        function activateDot(index) {
            dots.forEach(d => d.classList.remove('active'));
            if (dots[index]) dots[index].classList.add('active');
        }

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.dataset.index, 10);
                const target = testimonials[index];
                if (target) {
                    wrapper.scrollTo({
                        left: target.offsetLeft - 20,
                        behavior: 'smooth'
                    });
                }
                activateDot(index);
            });
        });

        let scrollTimer;
        wrapper.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                const scrollLeft = wrapper.scrollLeft;
                let closest = 0;
                let minDist = Infinity;
                testimonials.forEach((t, i) => {
                    const dist = Math.abs(t.offsetLeft - scrollLeft);
                    if (dist < minDist) {
                        minDist = dist;
                        closest = i;
                    }
                });
                activateDot(closest);
            }, 80);
        }, { passive: true });
    }

});
