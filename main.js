import { App } from './core/App.js';
import './config/app-config.js';

// Initialize the main application
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.initialize();
});