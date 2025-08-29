// Smooth scrolling para links internos
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling para links de navegação
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // Form handling
    const form = document.getElementById('orcamento-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // File upload handling
    const fileInput = document.getElementById('documentos');
    const fileUploadText = document.querySelector('.file-upload-text span');
    
    if (fileInput && fileUploadText) {
        fileInput.addEventListener('change', function() {
            const files = this.files;
            if (files.length > 0) {
                if (files.length === 1) {
                    fileUploadText.textContent = `Arquivo selecionado: ${files[0].name}`;
                } else {
                    fileUploadText.textContent = `${files.length} arquivos selecionados`;
                }
            } else {
                fileUploadText.textContent = 'Clique ou arraste seus documentos aqui';
            }
        });
    }

    // Intersection Observer para animações
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

    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.service-card, .step, .testimonial-card, .advantage-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // WhatsApp mask
    const whatsappInput = document.getElementById('whatsapp');
    if (whatsappInput) {
        whatsappInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 11) {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 7) {
                value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
            }
            e.target.value = value;
        });
    }
});

// Função para scroll até o formulário
function scrollToForm() {
    const whatsappMessage = encodeURIComponent(
        `Olá! Gostaria de um orçamento para tradução. Meu nome é [Seu Nome] e meu e-mail é [Seu E-mail].`
    );
    window.open(`https://wa.me/5511999999999?text=${whatsappMessage}`, "_blank");
}

// Função para selecionar serviço
function selectService(serviceType) {
    const serviceSelect = document.getElementById('servico');
    if (serviceSelect) {
        serviceSelect.value = serviceType;
        scrollToForm();
        
        // Highlight do campo selecionado
        serviceSelect.style.borderColor = '#4CAF50';
        serviceSelect.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.1)';
        
        setTimeout(() => {
            serviceSelect.style.borderColor = '#e0e0e0';
            serviceSelect.style.boxShadow = 'none';
        }, 2000);
    }
}

// Função para lidar com o envio do formulário
function handleFormSubmit(e) {
    e.preventDefault();
    
    const submitBtn = document.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    
    // Mostrar loading
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
    submitBtn.disabled = true;
    
    // Coletar dados do formulário
    const formData = new FormData(e.target);
    const data = {
        nome: formData.get('nome'),
        email: formData.get('email'),
        whatsapp: formData.get('whatsapp'),
        servico: formData.get('servico'),
        documentos: formData.getAll('documentos')
    };
    
    // Validação básica
    if (!data.nome || !data.email || !data.whatsapp || !data.servico) {
        showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
        resetSubmitButton(submitBtn, originalText);
        return;
    }
    
    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Por favor, insira um email válido.', 'error');
        resetSubmitButton(submitBtn, originalText);
        return;
    }
    
    // Simular envio (em um caso real, enviaria para o servidor)
    setTimeout(() => {
        showNotification('Orçamento solicitado com sucesso! Entraremos em contato em breve.', 'success');
        e.target.reset();
        
        // Reset file upload text
        const fileUploadText = document.querySelector('.file-upload-text span');
        if (fileUploadText) {
            fileUploadText.textContent = 'Clique ou arraste seus documentos aqui';
        }
        
        resetSubmitButton(submitBtn, originalText);
        
        // Redirecionar para WhatsApp (opcional)
        const whatsappMessage = encodeURIComponent(
            `Olá! Gostaria de solicitar um orçamento para ${getServiceName(data.servico)}.\n\n` +
            `Nome: ${data.nome}\n` +
            `Email: ${data.email}\n` +
            `WhatsApp: ${data.whatsapp}`
        );
        
        setTimeout(() => {
            if (confirm('Deseja continuar a conversa pelo WhatsApp?')) {
                window.open(`https://wa.me/5511999999999?text=${whatsappMessage}`, '_blank');
            }
        }, 2000);
        
    }, 2000);
}

// Função para resetar o botão de submit
function resetSubmitButton(button, originalText) {
    button.innerHTML = originalText;
    button.disabled = false;
}

// Função para obter nome do serviço
function getServiceName(serviceType) {
    const services = {
        'juramentada': 'Tradução Juramentada',
        'tecnica': 'Tradução Técnica',
        'simples': 'Tradução Simples',
        'apostila': 'Apostila de Haia'
    };
    return services[serviceType] || serviceType;
}

// Função para mostrar notificações
function showNotification(message, type = 'info') {
    // Remover notificação existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Criar nova notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Adicionar estilos da notificação
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            animation: slideInRight 0.3s ease;
        }
        
        .notification-success {
            border-left: 4px solid #4CAF50;
        }
        
        .notification-error {
            border-left: 4px solid #f44336;
        }
        
        .notification-info {
            border-left: 4px solid #2196F3;
        }
        
        .notification-content {
            padding: 1rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .notification-content i:first-child {
            font-size: 1.2rem;
            color: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        }
        
        .notification-content span {
            flex: 1;
            color: #333;
            font-weight: 500;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: #999;
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 50%;
            transition: all 0.2s ease;
        }
        
        .notification-close:hover {
            background: #f0f0f0;
            color: #666;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Auto remover após 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Função para lazy loading de imagens
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Função para otimização de performance
function optimizePerformance() {
    // Debounce para scroll events
    let scrollTimeout;
    const originalScrollHandler = window.onscroll;
    
    window.onscroll = function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            if (originalScrollHandler) {
                originalScrollHandler();
            }
        }, 10);
    };
}

// Inicializar otimizações quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    lazyLoadImages();
    optimizePerformance();
});

// Service Worker para cache (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

