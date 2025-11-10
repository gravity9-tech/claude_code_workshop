// Dark Mode Toggle Functionality

const DARK_MODE_KEY = 'pandora_dark_mode';

// Initialize dark mode
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const sunIcon = document.getElementById('sunIcon');
    const moonIcon = document.getElementById('moonIcon');

    if (!darkModeToggle || !sunIcon || !moonIcon) {
        console.error('Dark mode elements not found');
        return;
    }

    // Load saved preference or default to light mode
    const savedTheme = localStorage.getItem(DARK_MODE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    // Apply initial theme
    applyTheme(initialTheme);

    // Add click event listener
    darkModeToggle.addEventListener('click', toggleDarkMode);

    // Add keyboard support (Enter and Space keys)
    darkModeToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDarkMode();
        }
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(DARK_MODE_KEY)) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
}

// Toggle between light and dark mode
function toggleDarkMode() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    applyTheme(newTheme);
    localStorage.setItem(DARK_MODE_KEY, newTheme);
}

// Apply theme to document
function applyTheme(theme) {
    const sunIcon = document.getElementById('sunIcon');
    const moonIcon = document.getElementById('moonIcon');

    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDarkMode);
} else {
    initDarkMode();
}
