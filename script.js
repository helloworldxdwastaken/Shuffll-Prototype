// Mobile sidebar functionality
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const menuToggle = document.querySelector('.mobile-menu-btn');
    
    if (window.innerWidth <= 1024) {
        sidebar.classList.toggle('open');
        mobileOverlay.classList.toggle('active');
        
        // Update menu button icon
        const icon = menuToggle.querySelector('.menu-icon');
        if (sidebar.classList.contains('open')) {
            // Keep the same hamburger icon, just rotate it or change opacity
            icon.style.transform = 'rotate(90deg)';
        } else {
            icon.style.transform = 'rotate(0deg)';
        }
    }
}

// Handle window resize
window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const menuToggle = document.querySelector('.mobile-menu-btn');
    
    if (window.innerWidth > 1024) {
        sidebar.classList.remove('open');
        mobileOverlay.classList.remove('active');
        menuToggle.style.display = 'none';
    } else {
        menuToggle.style.display = 'block';
    }
});

// Initialize menu button visibility
window.addEventListener('load', function() {
    const menuToggle = document.querySelector('.mobile-menu-btn');
    if (window.innerWidth <= 1024) {
        menuToggle.style.display = 'block';
    }
});

// Expand/collapse section functionality
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.expand-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const content = this.closest('.section-card').querySelector('.section-content');
            const icon = this.querySelector('i');
            
            if (content.style.display === 'none') {
                content.style.display = 'block';
                icon.style.transform = 'rotate(0deg)';
            } else {
                content.style.display = 'none';
                icon.style.transform = 'rotate(-90deg)';
            }
        });
    });

    // Play/pause functionality
    const playPauseBtn = document.querySelector('.control-btn.primary');
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-pause')) {
                icon.className = 'fas fa-play';
                this.style.backgroundColor = '#10b981';
                this.title = 'Play (Space)';
            } else {
                icon.className = 'fas fa-pause';
                this.style.backgroundColor = '#3b82f6';
                this.title = 'Pause (Space)';
            }
        });
    }

    // Timeline interaction
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            document.querySelectorAll('.timeline-item').forEach(i => {
                i.querySelector('.timeline-block').classList.remove('active');
                i.querySelector('.timeline-time').classList.remove('active');
            });
            
            // Add active class to clicked item
            this.querySelector('.timeline-block').classList.add('active');
            this.querySelector('.timeline-time').classList.add('active');
            
            // Update progress bar
            const progressFill = document.querySelector('.progress-fill');
            const progress = (index / (document.querySelectorAll('.timeline-item').length - 1)) * 100;
            progressFill.style.width = progress + '%';
        });
    });

    // Render button functionality
    const renderBtn = document.querySelector('.render-btn');
    if (renderBtn) {
        renderBtn.addEventListener('click', function() {
            const button = this;
            const originalText = button.innerHTML;
            
            // Show loading state
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Rendering...';
            button.disabled = true;
            button.style.opacity = '0.7';
            
            // Simulate rendering process
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-check"></i> Render Complete!';
                button.style.backgroundColor = '#10b981';
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.disabled = false;
                    button.style.opacity = '1';
                    button.style.backgroundColor = '#9671ff';
                }, 3000);
            }, 5000);
        });
    }

    // Action button loading states
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const originalText = this.textContent;
            
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
            }, 1500);
        });
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Space bar for play/pause
    if (e.code === 'Space') {
        e.preventDefault();
        const playPauseBtn = document.querySelector('.control-btn.primary');
        if (playPauseBtn) {
            playPauseBtn.click();
        }
    }
    
    // Arrow keys for timeline navigation
    if (e.code === 'ArrowLeft') {
        e.preventDefault();
        const prevBtn = document.querySelector('.control-btn:first-child');
        if (prevBtn) {
            prevBtn.click();
            // Move to previous timeline item
            const activeItem = document.querySelector('.timeline-item .timeline-block.active');
            if (activeItem) {
                const currentItem = activeItem.closest('.timeline-item');
                const prevItem = currentItem.previousElementSibling;
                if (prevItem && prevItem.classList.contains('timeline-item')) {
                    prevItem.click();
                }
            }
        }
    }
    
    if (e.code === 'ArrowRight') {
        e.preventDefault();
        const nextBtn = document.querySelector('.control-btn:nth-child(3)');
        if (nextBtn) {
            nextBtn.click();
            // Move to next timeline item
            const activeItem = document.querySelector('.timeline-item .timeline-block.active');
            if (activeItem) {
                const currentItem = activeItem.closest('.timeline-item');
                const nextItem = currentItem.nextElementSibling;
                if (nextItem && nextItem.classList.contains('timeline-item')) {
                    nextItem.click();
                }
            }
        }
    }
    
    // Escape to close mobile menu
    if (e.code === 'Escape') {
        const sidebar = document.getElementById('sidebar');
        if (sidebar && sidebar.classList.contains('open')) {
            toggleSidebar();
        }
    }
});

// Progress bar animation
function animateProgress() {
    const progressFill = document.querySelector('.progress-fill');
    if (!progressFill) return;
    
    let width = parseInt(progressFill.style.width) || 42;
    const interval = setInterval(() => {
        width += 0.1;
        if (width >= 100) {
            width = 0;
        }
        progressFill.style.width = width + '%';
    }, 100);
    
    // Stop animation when page is hidden
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            clearInterval(interval);
        }
    });
}

// Start progress animation when page loads
window.addEventListener('load', animateProgress);

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Volume control simulation
document.querySelector('.control-btn[title="Volume"]')?.addEventListener('click', function() {
    const icon = this.querySelector('i');
    if (icon.classList.contains('fa-volume-up')) {
        icon.className = 'fas fa-volume-mute';
        this.title = 'Unmute';
    } else {
        icon.className = 'fas fa-volume-up';
        this.title = 'Volume';
    }
});

// Fullscreen toggle simulation
document.querySelector('.control-btn[title="Fullscreen"]')?.addEventListener('click', function() {
    const videoPlayer = document.querySelector('.video-player');
    const icon = this.querySelector('i');
    
    if (icon.classList.contains('fa-expand')) {
        icon.className = 'fas fa-compress';
        this.title = 'Exit Fullscreen';
        videoPlayer.style.position = 'fixed';
        videoPlayer.style.top = '0';
        videoPlayer.style.left = '0';
        videoPlayer.style.width = '100vw';
        videoPlayer.style.height = '100vh';
        videoPlayer.style.zIndex = '9999';
        videoPlayer.style.backgroundColor = '#000';
    } else {
        icon.className = 'fas fa-expand';
        this.title = 'Fullscreen';
        videoPlayer.style.position = 'relative';
        videoPlayer.style.top = 'auto';
        videoPlayer.style.left = 'auto';
        videoPlayer.style.width = '100%';
        videoPlayer.style.height = 'auto';
        videoPlayer.style.zIndex = 'auto';
        videoPlayer.style.backgroundColor = 'transparent';
    }
});

// Navigation item highlighting
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(navItem => {
            navItem.classList.remove('active');
        });
        
        // Add active class to clicked item
        this.classList.add('active');
        
        // Close mobile menu if open
        if (window.innerWidth <= 1024) {
            setTimeout(() => toggleSidebar(), 200);
        }
    });
});

// Add loading states for better UX
function showLoading(element) {
    element.style.opacity = '0.6';
    element.style.pointerEvents = 'none';
}

function hideLoading(element) {
    element.style.opacity = '1';
    element.style.pointerEvents = 'auto';
}

// Error handling for missing elements
function safeQuerySelector(selector) {
    try {
        return document.querySelector(selector);
    } catch (error) {
        console.warn(`Element not found: ${selector}`);
        return null;
    }
}

// Performance optimization: Debounce resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounced resize handler
window.addEventListener('resize', debounce(function() {
    const sidebar = document.getElementById('sidebar');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const menuToggle = document.querySelector('.mobile-menu-btn');
    
    if (window.innerWidth > 1024) {
        sidebar?.classList.remove('open');
        mobileOverlay?.classList.remove('active');
        if (menuToggle) menuToggle.style.display = 'none';
    } else {
        if (menuToggle) menuToggle.style.display = 'block';
    }
}, 250));

console.log('MyVideo App loaded successfully! 🎬');
