/**
 * Exter Library v2.0 - Premium Modern UI Library
 * Zero dependencies - Pure Vanilla JavaScript
 * Smooth animations, micro-interactions, premium feel
 */

(() => {
    'use strict';

    // ==========================================
    // NOTIFICATION SYSTEM
    // ==========================================

    const notifyContainer = document.getElementById('notifyContainer');
    const activeNotifs = new Map();

    const NOTIFY_ICONS = {
        error: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
            <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        info: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
            <path d="M12 16V12M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        success: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
            <path d="M8 12L11 15L16 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        warning: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 20H22L12 2Z" stroke="currentColor" stroke-width="1.5" opacity="0.3" stroke-linejoin="round"/>
            <path d="M12 9V13M12 17H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`
    };

    const NOTIFY_TITLES = {
        error: 'Error',
        info: 'Information',
        success: 'Success',
        warning: 'Warning'
    };

    function createNotification(data) {
        const type = data.ntype || 'info';
        const text = data.ntext || '';
        const time = data.ntime || 5000;
        const id = data.dataid || Math.random().toString(36).substr(2, 9);

        const notifEl = document.createElement('div');
        notifEl.className = `notify-item ${type}`;
        notifEl.dataset.id = id;

        notifEl.innerHTML = `
            <div class="notify-icon">
                ${NOTIFY_ICONS[type] || NOTIFY_ICONS.info}
            </div>
            <div class="notify-content">
                <span class="notify-title">${NOTIFY_TITLES[type] || 'Notice'}</span>
                <span class="notify-text">${text}</span>
            </div>
            <div class="notify-timer" style="animation-duration: ${time}ms;"></div>
        `;

        return { element: notifEl, id, time };
    }

    function showNotification(data) {
        const { element, id, time } = createNotification(data);

        // If notification with same ID exists, remove it first
        if (data.id && activeNotifs.has(data.id)) {
            removeNotification(data.id);
        }

        // Add stagger delay based on existing notifications
        const existingCount = notifyContainer.children.length;
        if (existingCount > 0) {
            element.style.animationDelay = `${existingCount * 50}ms`;
        }

        notifyContainer.appendChild(element);

        const timer = setTimeout(() => {
            removeNotification(id);
        }, time);

        activeNotifs.set(id, { element, timer });
    }

    function removeNotification(id) {
        const notif = activeNotifs.get(id);
        if (!notif) return;

        notif.element.classList.add('removing');
        clearTimeout(notif.timer);

        setTimeout(() => {
            if (notif.element.parentNode) {
                notif.element.parentNode.removeChild(notif.element);
            }
            activeNotifs.delete(id);
        }, 350);
    }

    // ==========================================
    // PROGRESS BAR
    // ==========================================

    const progressWrapper = document.getElementById('progressbarWrapper');
    const progressFill = document.getElementById('progressFill');
    const progressGlow = document.getElementById('progressGlow');
    const progressLabel = document.getElementById('progressLabel');
    const progressPercent = document.getElementById('progressPercent');

    let progressActive = false;
    let progressAnimation = null;

    function startProgressBar(data) {
        if (progressActive) return;

        progressActive = true;
        const duration = data.mtime || 5000;
        const label = data.mtext || 'Loading...';

        // Reset
        progressFill.style.width = '0%';
        progressGlow.style.width = '0%';
        progressLabel.textContent = label;
        progressPercent.textContent = '0%';

        // Show with smooth entrance
        progressWrapper.classList.add('active');

        // Smooth animation using requestAnimationFrame
        const startTime = performance.now();
        let lastPercent = 0;

        function animate(currentTime) {
            if (!progressActive) return;

            const elapsed = currentTime - startTime;
            const rawProgress = Math.min(elapsed / duration, 1);
            
            // Apply easing for smoother visual
            const progress = rawProgress;
            const percent = Math.round(progress * 100);

            if (percent !== lastPercent) {
                progressFill.style.width = `${percent}%`;
                progressGlow.style.width = `${percent}%`;
                progressPercent.textContent = `${percent}%`;
                lastPercent = percent;
            }

            if (progress < 1) {
                progressAnimation = requestAnimationFrame(animate);
            } else {
                finishProgressBar();
            }
        }

        progressAnimation = requestAnimationFrame(animate);
    }

    function finishProgressBar() {
        progressActive = false;
        if (progressAnimation) {
            cancelAnimationFrame(progressAnimation);
            progressAnimation = null;
        }

        // Brief completion flash
        progressFill.style.width = '100%';
        progressGlow.style.width = '100%';
        progressPercent.textContent = '100%';

        setTimeout(() => {
            progressWrapper.classList.remove('active');
            // Notify FiveM
            fetch('https://exter-lib/FinishAction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            }).catch(() => {});
        }, 300);
    }

    function cancelProgressBar() {
        progressActive = false;
        if (progressAnimation) {
            cancelAnimationFrame(progressAnimation);
            progressAnimation = null;
        }
        progressWrapper.classList.remove('active');
    }

    // ==========================================
    // INFO PANEL
    // ==========================================

    const infoPanel = document.getElementById('infoPanel');
    const infoTitle = document.getElementById('infoTitle');
    const infoText = document.getElementById('infoText');

    function showInfoPanel(data) {
        infoTitle.textContent = data.toptext || 'Information';
        infoText.textContent = data.text || '';
        infoPanel.classList.add('active');
    }

    function hideInfoPanel() {
        infoPanel.classList.remove('active');
    }

    // ==========================================
    // MESSAGE HANDLER (FiveM NUI)
    // ==========================================

    window.addEventListener('message', (event) => {
        const data = event.data;

        switch (data.message) {
            case 'notify':
                showNotification(data);
                break;

            case 'progbar':
                startProgressBar(data);
                break;

            case 'cancel':
                cancelProgressBar();
                break;

            case 'info':
                showInfoPanel(data);
                break;

            case 'closeinfo':
                hideInfoPanel();
                break;
        }
    });

})();
