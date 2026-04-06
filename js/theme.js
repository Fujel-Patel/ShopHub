// ==========================================
// DARK MODE THEME TOGGLE
// ==========================================

const THEME_KEY = 'shophub_theme';
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';

// Initialize theme on page load
function initializeTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Use saved theme, else use system preference, else default to light
    const theme = savedTheme || (prefersDark ? DARK_THEME : LIGHT_THEME);
    
    setTheme(theme);
    updateThemeToggleButton(theme);
}

// Set theme
function setTheme(theme) {
    if (theme === DARK_THEME) {
        document.documentElement.setAttribute('data-theme', DARK_THEME);
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    
    localStorage.setItem(THEME_KEY, theme);
}

// Toggle theme
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || LIGHT_THEME;
    const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
    
    setTheme(newTheme);
    updateThemeToggleButton(newTheme);
}

// Update toggle button
function updateThemeToggleButton(theme) {
    const toggleBtns = document.querySelectorAll('#themeToggle');
    
    toggleBtns.forEach(btn => {
        btn.textContent = theme === DARK_THEME ? '☀️' : '🌙';
        btn.title = theme === DARK_THEME ? 'Toggle Light Mode' : 'Toggle Dark Mode';
    });
}

// Setup event listeners
function setupThemeToggleListeners() {
    const toggleBtns = document.querySelectorAll('#themeToggle');
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', toggleTheme);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    setupThemeToggleListeners();
});

// Also initialize theme immediately (before DOMContentLoaded in case it fires late)
initializeTheme();

// Listen for theme change on other tabs
window.addEventListener('storage', function(e) {
    if (e.key === THEME_KEY) {
        setTheme(e.newValue || LIGHT_THEME);
        updateThemeToggleButton(e.newValue || LIGHT_THEME);
    }
});
