// Windows XP Portfolio JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Variables to track window states
    let activeWindow = null;
    let isDragging = false;
    let initialX, initialY, initialLeft, initialTop;
    let minimizedWindows = [];
    let taskbarItems = {};
    let soundsEnabled = true;
    let isMobile = window.innerWidth <= 768;

    // Elements
    const startMenuButton = document.querySelector('.start-menu-button');
    const startMenu = document.getElementById('start-menu');
    const windows = document.querySelectorAll('.window');
    const desktop = document.querySelector('.desktop');
    const openWindowsContainer = document.querySelector('.open-windows');
    const bootScreen = document.querySelector('.boot-screen');
    const loginScreen = document.querySelector('.login-screen');
    const shutdownScreen = document.querySelector('.shutdown-screen');
    const errorDialog = document.getElementById('error-dialog');
    const bootProgress = document.querySelector('.boot-progress');
    const loginButton = document.querySelector('.login-button');
    const shutdownBtn = document.getElementById('shutdown-btn');
    const logOffBtn = document.getElementById('log-off-btn');
    const tabs = document.querySelectorAll('.tab');
    const welcomeSoundBtn = document.querySelector('.welcome-sound-btn');
    const desktopIcons = document.querySelectorAll('.desktop-icon');

    // Audio elements
    const startupSound = document.getElementById('startup-sound');
    const errorSound = document.getElementById('error-sound');
    const clickSound = document.getElementById('click-sound');
    const notifySound = document.getElementById('notify-sound');
    const logoutSound = document.getElementById('logout-sound');

    // Create taskbar tooltip
    const tooltip = document.createElement('div');
    tooltip.classList.add('taskbar-tooltip');
    document.body.appendChild(tooltip);

    // Initialize Windows XP boot sequence
    initBootSequence();

    // Function to initialize boot sequence
    function initBootSequence() {
        // Show boot screen
        if (bootScreen) {
            bootScreen.classList.remove('hidden');

            // Start boot progress animation
            let progress = 0;
            const bootInterval = setInterval(() => {
                progress += Math.random() * 8 + 2; // More realistic random progress
                bootProgress.style.width = `${Math.min(progress, 100)}%`;

                if (progress >= 100) {
                    clearInterval(bootInterval);
                    setTimeout(() => {
                        bootScreen.classList.add('hidden');
                        showLoginScreen();
                    }, 800); // Slight delay after progress reaches 100%
                }
            }, 250);
        } else {
            // If boot screen doesn't exist, go straight to desktop
            showDesktop();
        }
    }

    // Function to show login screen
    function showLoginScreen() {
        if (loginScreen) {
            loginScreen.classList.remove('hidden');
            setTimeout(() => {
                if (soundsEnabled) {
                    startupSound.play().catch(e => console.log('Failed to play sound:', e));
                }
            }, 500);
        } else {
            // If login screen doesn't exist, go straight to desktop
            showDesktop();
        }
    }

    // Function to show desktop
    function showDesktop() {
        // Open About Window by default
        setTimeout(() => {
            openWindow('about-window');
        }, 800);
    }

    // Login button click
    if (loginButton) {
        loginButton.addEventListener('click', () => {
            loginScreen.classList.add('hidden');
            playSound('notify');

            // Open About Window by default
            setTimeout(() => {
                openWindow('about-window');
            }, 800);
        });
    }

    // Toggle sound button click
    if (welcomeSoundBtn) {
        welcomeSoundBtn.addEventListener('click', () => {
            soundsEnabled = !soundsEnabled;
            welcomeSoundBtn.textContent = soundsEnabled ? '🔊' : '🔇';
        });
    }

    // Play sound function
    function playSound(sound) {
        if (!soundsEnabled) return;

        try {
            switch(sound) {
                case 'startup':
                    startupSound.currentTime = 0;
                    startupSound.play();
                    break;
                case 'error':
                    errorSound.currentTime = 0;
                    errorSound.play();
                    break;
                case 'click':
                    clickSound.currentTime = 0;
                    clickSound.play();
                    break;
                case 'notify':
                    notifySound.currentTime = 0;
                    notifySound.play();
                    break;
                case 'logout':
                    logoutSound.currentTime = 0;
                    logoutSound.play();
                    break;
            }
        } catch (e) {
            console.log('Failed to play sound:', e);
        }
    }

    // Improved desktop icon click handling
    document.getElementById('about-me-icon').addEventListener('click', (e) => {
        playSound('click');
        // Deselect all other icons
        desktopIcons.forEach(i => i.classList.remove('selected'));
        // Select this icon
        e.currentTarget.classList.add('selected');

        // On mobile, open window on single click. On desktop, wait for double-click
        if (isMobile) {
            openWindow('about-window');
            e.stopPropagation();
        }
    });

    // Double-click opens the corresponding window on desktop
    document.getElementById('about-me-icon').addEventListener('dblclick', (e) => {
        if (!isMobile) {
            playSound('notify');
            openWindow('about-window');
            e.stopPropagation();
        }
    });

    document.getElementById('skills-icon').addEventListener('click', (e) => {
        playSound('click');
        // Deselect all other icons
        desktopIcons.forEach(i => i.classList.remove('selected'));
        // Select this icon
        e.currentTarget.classList.add('selected');

        // On mobile, open window on single click
        if (isMobile) {
            openWindow('skills-window');
            e.stopPropagation();
        }
    });

    document.getElementById('skills-icon').addEventListener('dblclick', (e) => {
        if (!isMobile) {
            playSound('notify');
            openWindow('skills-window');
            e.stopPropagation();
        }
    });

    document.getElementById('projects-icon').addEventListener('click', (e) => {
        playSound('click');
        // Deselect all other icons
        desktopIcons.forEach(i => i.classList.remove('selected'));
        // Select this icon
        e.currentTarget.classList.add('selected');

        // On mobile, open window on single click
        if (isMobile) {
            openWindow('projects-window');
            e.stopPropagation();
        }
    });

    document.getElementById('projects-icon').addEventListener('dblclick', (e) => {
        if (!isMobile) {
            playSound('notify');
            openWindow('projects-window');
            e.stopPropagation();
        }
    });

    document.getElementById('contact-icon').addEventListener('click', (e) => {
        playSound('click');
        // Deselect all other icons
        desktopIcons.forEach(i => i.classList.remove('selected'));
        // Select this icon
        e.currentTarget.classList.add('selected');

        // On mobile, open window on single click
        if (isMobile) {
            openWindow('contact-window');
            e.stopPropagation();
        }
    });

    document.getElementById('contact-icon').addEventListener('dblclick', (e) => {
        if (!isMobile) {
            playSound('notify');
            openWindow('contact-window');
            e.stopPropagation();
        }
    });

    // Special handling for the Recycle Bin icon
    document.getElementById('recycle-bin-icon').addEventListener('click', (e) => {
        playSound('click');
        // Deselect all other icons
        desktopIcons.forEach(i => i.classList.remove('selected'));
        // Select this icon
        e.currentTarget.classList.add('selected');

        // 50% chance of showing an error
        if (Math.random() < 0.5) {
            errorDialog.style.display = 'flex';
            playSound('error');
        }
    });

    // Special handling for the Portfolio icon
    document.getElementById('my-computer-icon').addEventListener('click', (e) => {
        playSound('click');
        // Deselect all other icons
        desktopIcons.forEach(i => i.classList.remove('selected'));
        // Select this icon
        e.currentTarget.classList.add('selected');

        // On mobile, open window on single click
        if (isMobile) {
            openWindow('my-computer-window');
            e.stopPropagation();
        }
    });

    document.getElementById('my-computer-icon').addEventListener('dblclick', (e) => {
        const ieWindow = document.getElementById('my-computer-window');
        playSound('notify');

        // If window is already open, just make it active
        if (ieWindow.style.display === 'flex') {
            setActiveWindow(ieWindow);
            return;
        }

        // Show the loading screen first
        openWindow('my-computer-window');
        const ieContent = ieWindow.querySelector('.ie-content');
        const ieLoading = ieWindow.querySelector('.ie-loading');
        const ieFrame = ieWindow.querySelector('.ie-frame');

        // Show loading, hide content
        if (ieLoading && ieFrame) {
            ieFrame.style.display = 'none';
            ieLoading.style.display = 'block';

            // Simulate loading
            setTimeout(() => {
                ieLoading.style.display = 'none';
                ieFrame.style.display = 'block';
                playSound('notify');
            }, 2000);
        }

        e.stopPropagation();
    });

    // Error dialog close button
    if (errorDialog) {
        const errorCloseBtn = errorDialog.querySelector('.close-btn');
        const errorOkBtn = errorDialog.querySelector('.ok-button');

        errorCloseBtn.addEventListener('click', () => {
            errorDialog.style.display = 'none';
        });

        errorOkBtn.addEventListener('click', () => {
            errorDialog.style.display = 'none';
        });
    }

    // Add navigation for the IE back/forward buttons
    const ieBackBtn = document.querySelector('.ie-back');
    const ieForwardBtn = document.querySelector('.ie-forward');
    const ieRefreshBtn = document.querySelector('.ie-refresh');
    const ieHomeBtn = document.querySelector('.ie-home');
    const ieStopBtn = document.querySelector('.ie-stop');

    if (ieBackBtn) ieBackBtn.addEventListener('click', () => playSound('click'));
    if (ieForwardBtn) ieForwardBtn.addEventListener('click', () => playSound('click'));
    if (ieRefreshBtn) ieRefreshBtn.addEventListener('click', () => {
        playSound('click');
        // Refresh the IE frame
        const ieWindow = document.getElementById('my-computer-window');
        const ieFrame = ieWindow.querySelector('.ie-frame');
        const ieLoading = ieWindow.querySelector('.ie-loading');

        if (ieFrame && ieLoading) {
            ieFrame.style.display = 'none';
            ieLoading.style.display = 'block';

            setTimeout(() => {
                ieLoading.style.display = 'none';
                ieFrame.style.display = 'block';
                playSound('notify');
            }, 1000);
        }
    });

    if (ieHomeBtn) ieHomeBtn.addEventListener('click', () => {
        playSound('click');
        document.getElementById('ie-address-bar').value = 'https://github.com/EugeneBoondock';
    });

    if (ieStopBtn) ieStopBtn.addEventListener('click', () => {
        playSound('click');
        // Stop the loading animation
        const ieWindow = document.getElementById('my-computer-window');
        const ieFrame = ieWindow.querySelector('.ie-frame');
        const ieLoading = ieWindow.querySelector('.ie-loading');

        if (ieLoading) {
            ieLoading.style.display = 'none';
        }

        if (ieFrame) {
            ieFrame.style.display = 'block';
        }
    });

    // Add global IE navigation function
    window.navigateIE = function() {
        const url = document.getElementById('ie-address-bar').value;

        if (!url) return;

        // Show the loading animation
        const ieWindow = document.getElementById('my-computer-window');
        const ieFrame = ieWindow.querySelector('.ie-frame');
        const ieLoading = ieWindow.querySelector('.ie-loading');

        if (ieFrame && ieLoading) {
            ieFrame.style.display = 'none';
            ieLoading.style.display = 'block';

            // Simulate loading, then open in new tab
            setTimeout(() => {
                ieLoading.style.display = 'none';
                ieFrame.style.display = 'block';
                playSound('notify');
                window.open(url, '_blank');
            }, 1500);
        } else {
            // If elements don't exist, just open the URL
            window.open(url, '_blank');
        }
    };

    // Function to open a window
    function openWindow(windowId) {
        const window = document.getElementById(windowId);
        if (!window) return;

        // If window was minimized, remove from minimized array
        const index = minimizedWindows.indexOf(windowId);
        if (index > -1) {
            minimizedWindows.splice(index, 1);
        }

        // Display the window and make it active
        window.style.display = 'flex';
        setActiveWindow(window);

        // Add to taskbar if not already there
        addToTaskbar(windowId);
    }

    // Function to set the active window
    function setActiveWindow(window) {
        if (!window) return;

        // Remove active class from all windows
        windows.forEach(w => {
            w.classList.remove('active');
            w.style.zIndex = 10;

            // Add inactive class to window headers and controls
            const header = w.querySelector('.window-header');
            const controls = w.querySelector('.window-controls');
            if (header) header.classList.add('inactive');
            if (controls) controls.classList.add('inactive');
        });

        // Add active class to this window and bring to front
        window.classList.add('active');
        window.style.zIndex = 100;

        // Remove inactive class from active window header
        const header = window.querySelector('.window-header');
        const controls = window.querySelector('.window-controls');
        if (header) header.classList.remove('inactive');
        if (controls) controls.classList.remove('inactive');

        activeWindow = window;

        // Update taskbar to show which window is active
        updateTaskbarActiveState(window.id);
    }

    // Function to add a window to the taskbar
    function addToTaskbar(windowId) {
        if (!taskbarItems[windowId]) {
            const window = document.getElementById(windowId);
            if (!window) return;

            const windowTitle = window.querySelector('.window-title').textContent;

            // Create taskbar item
            const taskbarItem = document.createElement('div');
            taskbarItem.className = 'taskbar-item';
            taskbarItem.dataset.windowId = windowId;
            taskbarItem.innerHTML = `<span>${windowTitle}</span>`;

            // Add active class if window is visible and active
            if (window.style.display !== 'none' && window.classList.contains('active')) {
                taskbarItem.classList.add('active');
            }

            // Add click behavior to toggle window
            taskbarItem.addEventListener('click', () => {
                playSound('click');
                const targetWindow = document.getElementById(windowId);

                if (targetWindow.style.display === 'none') {
                    // Window is minimized, restore it
                    openWindow(windowId);
                } else if (targetWindow.classList.contains('active')) {
                    // Window is active, minimize it
                    minimizeWindow(windowId);
                } else {
                    // Window is open but not active, make it active
                    setActiveWindow(targetWindow);
                }
            });

            // Add tooltip
            taskbarItem.addEventListener('mouseenter', () => {
                tooltip.textContent = windowTitle;
                tooltip.style.display = 'block';
                tooltip.style.left = `${taskbarItem.offsetLeft}px`;
            });

            taskbarItem.addEventListener('mouseleave', () => {
                tooltip.style.display = 'none';
            });

            // Add to taskbar and store reference
            openWindowsContainer.appendChild(taskbarItem);
            taskbarItems[windowId] = taskbarItem;
        }
    }

    // Function to update taskbar to show active window
    function updateTaskbarActiveState(activeWindowId) {
        // Remove active class from all taskbar items
        Object.keys(taskbarItems).forEach(windowId => {
            if (taskbarItems[windowId]) {
                taskbarItems[windowId].classList.remove('active');
            }
        });

        // Add active class to the active window's taskbar item
        if (taskbarItems[activeWindowId]) {
            taskbarItems[activeWindowId].classList.add('active');
        }
    }

    // Function to minimize a window
    function minimizeWindow(windowId) {
        const window = document.getElementById(windowId);
        if (!window) return;

        // Hide the window
        window.style.display = 'none';

        // Add to minimized windows array if not already there
        if (!minimizedWindows.includes(windowId)) {
            minimizedWindows.push(windowId);
        }

        // Add to taskbar if not already there
        addToTaskbar(windowId);
    }

    // Function to update the clock in the taskbar
    function updateClock() {
        const timeElement = document.querySelector('.time');
        if (!timeElement) return;

        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12; // Convert 0 to 12

        const timeString = `${hours}:${minutes} ${ampm}`;
        timeElement.textContent = timeString;
    }

    // Update the clock initially and then every minute
    updateClock();
    setInterval(updateClock, 60000);

    // Start menu toggle
    if (startMenuButton) {
        startMenuButton.addEventListener('click', () => {
            playSound('click');
            startMenu.classList.toggle('active');
        });
    }

    // Close start menu when clicking elsewhere
    document.addEventListener('click', (e) => {
        if (startMenu && !startMenu.contains(e.target) && startMenuButton && !startMenuButton.contains(e.target) && startMenu.classList.contains('active')) {
            startMenu.classList.remove('active');
        }
    });

    // Make window functions globally accessible for HTML onclick attributes
    window.openWindow = openWindow;
    window.playSound = playSound;
});
