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
    }

    // Function to show login screen
    function showLoginScreen() {
        loginScreen.classList.remove('hidden');
        setTimeout(() => {
            if (soundsEnabled) {
                startupSound.play().catch(e => console.log('Failed to play sound:', e));
            }
        }, 500);
    }

    // Login button click
    loginButton.addEventListener('click', () => {
        loginScreen.classList.add('hidden');
        playSound('notify');

        // Open About Window by default
        setTimeout(() => {
            openWindow('about-window');
        }, 800);
    });

    // Toggle sound button click
    welcomeSoundBtn.addEventListener('click', () => {
        soundsEnabled = !soundsEnabled;
        welcomeSoundBtn.textContent = soundsEnabled ? '🔊' : '🔇';
    });

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

    // Shutdown computer
    shutdownBtn.addEventListener('click', () => {
        startMenu.classList.remove('active');
        playSound('logout');

        // Close all windows first
        windows.forEach(window => {
            window.style.display = 'none';
        });

        // Show shutdown screen
        shutdownScreen.style.display = 'flex';
        setTimeout(() => {
            // Refresh the page after 3 seconds
            window.location.reload();
        }, 3000);
    });

    // Log off
    logOffBtn.addEventListener('click', () => {
        startMenu.classList.remove('active');
        playSound('logout');

        // Close all windows first
        windows.forEach(window => {
            window.style.display = 'none';
        });

        Object.keys(taskbarItems).forEach(windowId => {
            removeFromTaskbar(windowId);
        });

        // Show login screen again
        setTimeout(() => {
            loginScreen.classList.remove('hidden');
        }, 1000);
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

    // Show error dialog occasionally when clicking on recycle bin
    document.getElementById('recycle-bin-icon').addEventListener('click', () => {
        if (Math.random() < 0.5) { // 50% chance of showing error
            errorDialog.style.display = 'flex';
            playSound('error');
        }
    });

    // Initialize tab navigation in projects window
    initTabs();

    // Set current time in the taskbar
    updateClock();
    setInterval(updateClock, 60000); // Update every minute

    // Track window that is currently maximized
    let maximizedWindow = null;

    // Make desktop icons selectable with Windows XP behavior
    desktopIcons.forEach(icon => {
        // Single click selects the icon
        icon.addEventListener('click', (e) => {
            // Deselect all other icons
            desktopIcons.forEach(i => i.classList.remove('selected'));
            // Select this icon
            icon.classList.add('selected');
            playSound('click');
        });

        // Double click opens the corresponding window
        icon.addEventListener('dblclick', (e) => {
            playSound('notify');
            const id = icon.id;
            if (id.includes('icon')) {
                const windowId = id.replace('-icon', '-window');
                if (document.getElementById(windowId)) {
                    openWindow(windowId);
                }
            }
        });
    });

    // Click on desktop background to deselect all icons
    desktop.addEventListener('click', (e) => {
        if (e.target === desktop) {
            desktopIcons.forEach(icon => icon.classList.remove('selected'));
        }
    });

    // Desktop icons click handling - simplified for mobile
    document.getElementById('about-me-icon').addEventListener('click', (e) => {
        if (isMobile) {
            playSound('click');
            openWindow('about-window');
            e.stopPropagation();
        }
    });

    document.getElementById('skills-icon').addEventListener('click', (e) => {
        if (isMobile) {
            playSound('click');
            openWindow('skills-window');
            e.stopPropagation();
        }
    });

    document.getElementById('projects-icon').addEventListener('click', (e) => {
        if (isMobile) {
            playSound('click');
            openWindow('projects-window');
            e.stopPropagation();
        }
    });

    document.getElementById('contact-icon').addEventListener('click', (e) => {
        if (isMobile) {
            playSound('click');
            openWindow('contact-window');
            e.stopPropagation();
        }
    });

    // Add IE window animation
    document.getElementById('my-computer-icon').addEventListener('click', (e) => {
        if (isMobile) {
            playSound('click');
            openWindow('my-computer-window');
            e.stopPropagation();
        } else {
            playSound('click');
            const ieWindow = document.getElementById('my-computer-window');

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
        }
    });

    // Start menu toggle
    startMenuButton.addEventListener('click', () => {
        playSound('click');
        startMenu.classList.toggle('active');
    });

    // Close start menu when clicking elsewhere
    document.addEventListener('click', (e) => {
        if (!startMenu.contains(e.target) && !startMenuButton.contains(e.target) && startMenu.classList.contains('active')) {
            startMenu.classList.remove('active');
        }
    });

    // Initialize windows with draggable behavior
    initializeWindows();

    // Initialize window buttons (minimize, maximize, close)
    initializeWindowButtons();

    // Function to initialize tab navigation
    function initTabs() {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Play click sound
                playSound('click');

                // Get the tab target
                const targetId = tab.dataset.tab;

                // Hide all tab contents
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.style.display = 'none';
                });

                // Show the selected tab content
                document.getElementById(targetId).style.display = 'block';

                // Update active tab state
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
            });
        });
    }

    // Function to initialize windows
    function initializeWindows() {
        windows.forEach(window => {
            const header = window.querySelector('.window-header');

            // Make window active when clicked
            window.addEventListener('mousedown', () => {
                if (window.style.display !== 'none') {
                    setActiveWindow(window);
                }
            });

            window.addEventListener('touchstart', () => {
                if (window.style.display !== 'none') {
                    setActiveWindow(window);
                }
            });

            // Set up dragging behavior for window headers
            header.addEventListener('mousedown', (e) => {
                if (e.target.tagName !== 'BUTTON' && !window.classList.contains('maximized')) {
                    isDragging = true;
                    activeWindow = window;

                    initialX = e.clientX;
                    initialY = e.clientY;
                    initialLeft = parseInt(window.style.left || window.offsetLeft);
                    initialTop = parseInt(window.style.top || window.offsetTop);

                    // Add a dragging class for styling
                    window.classList.add('dragging');

                    // Prevent text selection during drag
                    e.preventDefault();
                }
            });

            // Touch support for dragging
            header.addEventListener('touchstart', (e) => {
                if (e.target.tagName !== 'BUTTON' && !window.classList.contains('maximized')) {
                    isDragging = true;
                    activeWindow = window;

                    initialX = e.touches[0].clientX;
                    initialY = e.touches[0].clientY;
                    initialLeft = parseInt(window.style.left || window.offsetLeft);
                    initialTop = parseInt(window.style.top || window.offsetTop);

                    // Add a dragging class for styling
                    window.classList.add('dragging');

                    // Prevent default touch behavior
                    e.preventDefault();
                }
            }, { passive: false });

            // Double-click on header to maximize/restore
            header.addEventListener('dblclick', (e) => {
                if (e.target.tagName !== 'BUTTON') {
                    const windowId = window.id;
                    if (window.classList.contains('maximized')) {
                        restoreWindow(windowId);
                    } else {
                        maximizeWindow(windowId);
                    }
                    playSound('click');
                }
            });
        });

        // Window dragging behavior
        document.addEventListener('mousemove', (e) => {
            if (isDragging && activeWindow) {
                const newLeft = initialLeft + (e.clientX - initialX);
                const newTop = initialTop + (e.clientY - initialY);

                // Keep window within viewport boundaries
                const maxLeft = window.innerWidth - activeWindow.offsetWidth;
                const maxTop = window.innerHeight - activeWindow.offsetHeight;

                activeWindow.style.left = Math.min(Math.max(0, newLeft), maxLeft) + 'px';
                activeWindow.style.top = Math.min(Math.max(0, newTop), maxTop) + 'px';
            }
        });

        // Touch support for dragging
        document.addEventListener('touchmove', (e) => {
            if (isDragging && activeWindow) {
                const newLeft = initialLeft + (e.touches[0].clientX - initialX);
                const newTop = initialTop + (e.touches[0].clientY - initialY);

                // Keep window within viewport boundaries
                const maxLeft = window.innerWidth - activeWindow.offsetWidth;
                const maxTop = window.innerHeight - activeWindow.offsetHeight;

                activeWindow.style.left = Math.min(Math.max(0, newLeft), maxLeft) + 'px';
                activeWindow.style.top = Math.min(Math.max(0, newTop), maxTop) + 'px';
            }
        }, { passive: false });

        document.addEventListener('mouseup', () => {
            if (isDragging && activeWindow) {
                activeWindow.classList.remove('dragging');
                isDragging = false;
            }
        });

        document.addEventListener('touchend', () => {
            if (isDragging && activeWindow) {
                activeWindow.classList.remove('dragging');
                isDragging = false;
            }
        });
    }

    // Function to initialize window control buttons
    function initializeWindowButtons() {
        windows.forEach(window => {
            const windowId = window.id;
            const closeBtn = window.querySelector('.close-btn');
            const minimizeBtn = window.querySelector('.minimize-btn');
            const maximizeBtn = window.querySelector('.maximize-btn');

            // Close button
            closeBtn.addEventListener('click', () => {
                playSound('click');
                closeWindow(windowId);
            });

            // Minimize button
            minimizeBtn.addEventListener('click', () => {
                playSound('click');
                minimizeWindow(windowId);
            });

            // Maximize button
            maximizeBtn.addEventListener('click', () => {
                playSound('click');
                if (window.classList.contains('maximized')) {
                    restoreWindow(windowId);
                } else {
                    maximizeWindow(windowId);
                }
            });
        });
    }

    // Function to open a window
    function openWindow(windowId) {
        const window = document.getElementById(windowId);

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

    // Function to close a window
    function closeWindow(windowId) {
        const window = document.getElementById(windowId);
        window.style.display = 'none';

        // If window was maximized, update the maximized window reference
        if (window.classList.contains('maximized')) {
            maximizedWindow = null;
            window.classList.remove('maximized');
        }

        // Remove from minimized windows if it was minimized
        const index = minimizedWindows.indexOf(windowId);
        if (index > -1) {
            minimizedWindows.splice(index, 1);
        }

        // Remove from taskbar
        removeFromTaskbar(windowId);
    }

    // Function to minimize a window
    function minimizeWindow(windowId) {
        const window = document.getElementById(windowId);

        // Hide the window
        window.style.display = 'none';

        // Add to minimized windows array if not already there
        if (!minimizedWindows.includes(windowId)) {
            minimizedWindows.push(windowId);
        }

        // Add to taskbar if not already there
        addToTaskbar(windowId);
    }

    // Function to maximize a window
    function maximizeWindow(windowId) {
        const window = document.getElementById(windowId);

        // If there's already a maximized window, restore it first
        if (maximizedWindow && maximizedWindow !== window) {
            maximizedWindow.classList.remove('maximized');
            maximizedWindow.style.width = maximizedWindow.dataset.prevWidth;
            maximizedWindow.style.height = maximizedWindow.dataset.prevHeight;
            maximizedWindow.style.top = maximizedWindow.dataset.prevTop;
            maximizedWindow.style.left = maximizedWindow.dataset.prevLeft;
        }

        // Save current size and position
        window.dataset.prevWidth = window.style.width || window.offsetWidth + 'px';
        window.dataset.prevHeight = window.style.height || window.offsetHeight + 'px';
        window.dataset.prevTop = window.style.top || window.offsetTop + 'px';
        window.dataset.prevLeft = window.style.left || window.offsetLeft + 'px';

        // Maximize
        if (isMobile) {
            window.style.width = '100%';
            window.style.height = 'calc(100% - 35px)'; // Adjust for taskbar
            window.style.top = '0';
            window.style.left = '0';
        } else {
            window.style.width = 'calc(100% - 6px)';
            window.style.height = 'calc(100% - 36px)'; // Adjust for taskbar
            window.style.top = '0';
            window.style.left = '0';
        }

        window.classList.add('maximized');
        maximizedWindow = window;

        // Make sure the window is visible and active
        window.style.display = 'flex';
        setActiveWindow(window);
    }

    // Function to restore a window from maximized state
    function restoreWindow(windowId) {
        const window = document.getElementById(windowId);

        if (window.classList.contains('maximized')) {
            // Restore previous size and position
            window.style.width = window.dataset.prevWidth;
            window.style.height = window.dataset.prevHeight;
            window.style.top = window.dataset.prevTop;
            window.style.left = window.dataset.prevLeft;
            window.classList.remove('maximized');
            maximizedWindow = null;
        }

        // Make sure the window is visible and active
        window.style.display = 'flex';
        setActiveWindow(window);
    }

    // Function to set the active window
    function setActiveWindow(window) {
        // Add inactive class to all window headers
        windows.forEach(w => {
            w.classList.remove('active');
            w.style.zIndex = 10;
            w.querySelector('.window-header').classList.add('inactive');
            w.querySelector('.window-controls').classList.add('inactive');
        });

        // Remove inactive class from active window header
        window.classList.add('active');
        window.style.zIndex = 100;
        window.querySelector('.window-header').classList.remove('inactive');
        window.querySelector('.window-controls').classList.remove('inactive');
        activeWindow = window;

        // Update taskbar to show which window is active
        updateTaskbarActiveState(window.id);
    }

    // Function to add a window to the taskbar
    function addToTaskbar(windowId) {
        if (!taskbarItems[windowId]) {
            const window = document.getElementById(windowId);
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

    // Function to remove a window from the taskbar
    function removeFromTaskbar(windowId) {
        if (taskbarItems[windowId]) {
            openWindowsContainer.removeChild(taskbarItems[windowId]);
            delete taskbarItems[windowId];
        }
    }

    // Function to update taskbar to show active window
    function updateTaskbarActiveState(activeWindowId) {
        // Remove active class from all taskbar items
        Object.keys(taskbarItems).forEach(windowId => {
            taskbarItems[windowId].classList.remove('active');
        });

        // Add active class to the active window's taskbar item
        if (taskbarItems[activeWindowId]) {
            taskbarItems[activeWindowId].classList.add('active');
        }
    }

    // Function to update the clock in the taskbar
    function updateClock() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12; // Convert 0 to 12

        const timeString = `${hours}:${minutes} ${ampm}`;
        document.querySelector('.time').textContent = timeString;
    }

    // Let's add some typewriter effect for the intro text
    const welcomeMessages = [
        "Welcome to my Windows XP portfolio!",
        "Browsing with Internet Explorer?",
        "You've got mail!",
        "No viruses detected... yet.",
        "System running smoothly."
    ];

    let currentMessageIndex = 0;
    let charIndex = 0;
    const typingSpeed = 50; // ms per character
    const pauseDuration = 3000; // pause between messages

    function typeMessage() {
        const message = welcomeMessages[currentMessageIndex];

        if (charIndex < message.length) {
            // Continue typing current message
            if (document.getElementById('about-window').style.display !== 'none') {
                const typingArea = document.querySelector('.about-me-content p');
                if (typingArea) {
                    typingArea.innerHTML = `A junior web developer, who builds web wonders and tinkers with AI marvels.<br><span style="color: #0078d7; font-style: italic;">${message.substring(0, charIndex + 1)}</span>`;
                }
            }
            charIndex++;
            setTimeout(typeMessage, typingSpeed);
        } else {
            // Finished typing, wait before erasing
            setTimeout(eraseMessage, pauseDuration);
        }
    }

    function eraseMessage() {
        const message = welcomeMessages[currentMessageIndex];

        if (charIndex > 0) {
            // Erase the message character by character
            if (document.getElementById('about-window').style.display !== 'none') {
                const typingArea = document.querySelector('.about-me-content p');
                if (typingArea) {
                    typingArea.innerHTML = `A junior web developer, who builds web wonders and tinkers with AI marvels.<br><span style="color: #0078d7; font-style: italic;">${message.substring(0, charIndex)}</span>`;
                }
            }
            charIndex--;
            setTimeout(eraseMessage, typingSpeed / 2); // Erase faster than type
        } else {
            // Move to next message
            currentMessageIndex = (currentMessageIndex + 1) % welcomeMessages.length;
            setTimeout(typeMessage, typingSpeed);
        }
    }

    // Start the typing animation after login
    setTimeout(typeMessage, 3000);

    // Check for window resize to update isMobile flag
    window.addEventListener('resize', () => {
        const wasMobile = isMobile;
        isMobile = window.innerWidth <= 768;

        // If changing between mobile and desktop, adjust windows if needed
        if (wasMobile !== isMobile) {
            // Adjust maximized windows for the new screen size
            windows.forEach(window => {
                if (window.classList.contains('maximized')) {
                    if (isMobile) {
                        window.style.width = '100%';
                        window.style.height = 'calc(100% - 35px)';
                    } else {
                        window.style.width = 'calc(100% - 6px)';
                        window.style.height = 'calc(100% - 36px)';
                    }
                }
            });
        }
    });

    // Make window functions globally accessible for HTML onclick attributes
    window.openWindow = openWindow;
    window.playSound = playSound;
});
