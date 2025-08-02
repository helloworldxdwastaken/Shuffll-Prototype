// Desktop-only functionality

// Volume and fullscreen functionality is now handled in DOMContentLoaded event

// Initialize accordion sections - now open by default
window.addEventListener('load', function() {
    // Mark sections as expanded by default
    document.querySelectorAll('.section-card').forEach(card => {
        if (!card.classList.contains('transparent-header')) {
            card.classList.add('expanded');
        }
    });
});

// Expand/collapse section functionality
document.addEventListener('DOMContentLoaded', function() {
    // Enhanced accordion functionality
    document.querySelectorAll('.expand-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const content = this.closest('.section-card').querySelector('.section-content');
            const icon = this.querySelector('i');
            const sectionCard = this.closest('.section-card');
            
            if (content.classList.contains('hidden')) {
                // Show content with smooth animation
                content.classList.remove('hidden');
                content.style.display = 'block';
                content.style.opacity = '0';
                
                // Temporarily set height to auto to measure content
                content.style.height = 'auto';
                const height = content.scrollHeight;
                content.style.height = '0px';
                
                // Force a reflow then animate to full height
                requestAnimationFrame(() => {
                    content.style.height = height + 'px';
                    content.style.opacity = '1';
                    content.style.transform = 'translateY(0)';
                });
                
                // After animation completes, set to auto for responsive behavior
                setTimeout(() => {
                    content.style.height = 'auto';
                }, 300);
                
                icon.className = 'fas fa-chevron-down';
                sectionCard.classList.add('expanded');
            } else {
                // Hide content with smooth animation
                const height = content.scrollHeight;
                content.style.height = height + 'px';
                
                // Force reflow then animate to 0
                requestAnimationFrame(() => {
                    content.style.height = '0px';
                    content.style.opacity = '0';
                    content.style.transform = 'translateY(-5px)';
                });
                
                // Add hidden class after animation
                setTimeout(() => {
                    content.classList.add('hidden');
                }, 300);
                
                icon.className = 'fas fa-chevron-right';
                sectionCard.classList.remove('expanded');
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

    // Progress bar interaction for scene navigation
    const progressBar = document.querySelector('.progress-bar');
    const progressFill = document.querySelector('.progress-fill');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timeline = document.querySelector('.timeline');
    
    if (progressBar && progressFill) {
        progressBar.addEventListener('click', function(e) {
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = (clickX / rect.width) * 100;
            
            // Update progress bar
            progressFill.style.width = percentage + '%';
            
            // Show timeline when clicking
            if (timeline) {
                timeline.classList.add('show');
            }
            
            // Find corresponding timeline item
            const itemIndex = Math.floor((percentage / 100) * timelineItems.length);
            const clampedIndex = Math.max(0, Math.min(itemIndex, timelineItems.length - 1));
            
            // Update timeline active state
            timelineItems.forEach(item => {
                item.querySelector('.timeline-block').classList.remove('active');
                item.querySelector('.timeline-time').classList.remove('active');
            });
            
            if (timelineItems[clampedIndex]) {
                timelineItems[clampedIndex].querySelector('.timeline-block').classList.add('active');
                timelineItems[clampedIndex].querySelector('.timeline-time').classList.add('active');
            }
        });
        
        // Add hover effect to show scene preview with persistence
        let hoverTimeout;
        progressBar.addEventListener('mouseenter', function() {
            clearTimeout(hoverTimeout);
            if (timeline) {
                timeline.classList.add('show');
                timeline.style.opacity = '1';
                timeline.style.transform = 'scaleY(1.1)';
            }
        });
        
        // Keep timeline visible when hovering over it
        if (timeline) {
            timeline.addEventListener('mouseenter', function() {
                clearTimeout(hoverTimeout);
                this.classList.add('show');
            });
            
            timeline.addEventListener('mouseleave', function() {
                hoverTimeout = setTimeout(() => {
                    this.classList.remove('show');
                    this.style.opacity = '0.8';
                    this.style.transform = 'scaleY(1)';
                }, 300); // 300ms delay before hiding
            });
        }
        
        progressBar.addEventListener('mouseleave', function() {
            hoverTimeout = setTimeout(() => {
                if (timeline) {
                    timeline.classList.remove('show');
                    timeline.style.opacity = '0.8';
                    timeline.style.transform = 'scaleY(1)';
                }
            }, 300); // 300ms delay before hiding
        });
    }

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
    
    // Escape to exit fullscreen
    if (e.code === 'Escape') {
        const fullscreenBtn = document.querySelector('.control-btn[title="Exit Fullscreen"]');
        
        if (fullscreenBtn) {
            fullscreenBtn.click();
        }
    }
    
    // F key for fullscreen toggle
    if (e.code === 'KeyF') {
        e.preventDefault();
        const fullscreenBtn = document.querySelector('.control-btn[title="Fullscreen"], .control-btn[title="Exit Fullscreen"]');
        if (fullscreenBtn) {
            fullscreenBtn.click();
        }
    }
    
    // M key for mute/unmute
    if (e.code === 'KeyM') {
        e.preventDefault();
        const volumeBtn = document.querySelector('.control-btn[title="Volume"], .control-btn[title="Unmute"]');
        if (volumeBtn) {
            volumeBtn.click();
        }
    }
});

// Progress bar animation
function animateProgress() {
    // Removed auto-animation - progress bar should stay static
    // Only update when user interacts with it
}

// Keep progress static when page loads
window.addEventListener('load', function() {
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        // Set initial position and stop any animation
        progressFill.style.width = '42%';
    }
});

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

    // Volume control functionality
    const volumeBtn = document.querySelector('.control-btn[title="Volume"]');
    if (volumeBtn) {
        volumeBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-volume-up')) {
                icon.className = 'fas fa-volume-mute';
                this.title = 'Unmute';
                this.classList.add('muted');
            } else {
                icon.className = 'fas fa-volume-up';
                this.title = 'Volume';
                this.classList.remove('muted');
            }
        });
    }

    // Fullscreen toggle functionality
    const fullscreenBtn = document.querySelector('.control-btn[title="Fullscreen"]');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', function() {
            const videoPlayer = document.querySelector('.video-player');
            const icon = this.querySelector('i');
            
            if (icon.classList.contains('fa-expand')) {
                // Enter fullscreen
                icon.className = 'fas fa-compress';
                this.title = 'Exit Fullscreen';
                this.classList.add('fullscreen-active');
                
                // Apply fullscreen styles
                videoPlayer.style.position = 'fixed';
                videoPlayer.style.top = '0';
                videoPlayer.style.left = '0';
                videoPlayer.style.width = '100vw';
                videoPlayer.style.height = '100vh';
                videoPlayer.style.zIndex = '9999';
                videoPlayer.style.backgroundColor = '#000';
                videoPlayer.classList.add('fullscreen-mode');
                
                // Hide other UI elements
                document.body.style.overflow = 'hidden';
            } else {
                // Exit fullscreen
                icon.className = 'fas fa-expand';
                this.title = 'Fullscreen';
                this.classList.remove('fullscreen-active');
                
                // Remove fullscreen styles
                videoPlayer.style.position = 'relative';
                videoPlayer.style.top = 'auto';
                videoPlayer.style.left = 'auto';
                videoPlayer.style.width = '100%';
                videoPlayer.style.height = 'auto';
                videoPlayer.style.zIndex = 'auto';
                videoPlayer.style.backgroundColor = 'transparent';
                videoPlayer.classList.remove('fullscreen-mode');
                
                // Restore UI elements
                document.body.style.overflow = 'auto';
            }
        });
    }

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
        
        // Close mobile menu if open - removed for desktop only
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

// Desktop-only - resize handling removed

console.log('MyVideo App loaded successfully! 🎬');
