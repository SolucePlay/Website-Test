import 'https://esm.run/@material/web/all.js';
import { styles as typescaleStyles } from 'https://esm.run/@material/web/typography/md-typescale-styles.js';
import { argbFromHex, themeFromSourceColor, applyTheme } from 'https://esm.run/@material/material-color-utilities';

document.adoptedStyleSheets.push(typescaleStyles.styleSheet);

const colorPicker = document.getElementById('theme-color');

function updateMaterialTheme(hexColor) {
    const argbColor = argbFromHex(hexColor);
    const theme = themeFromSourceColor(argbColor);
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    applyTheme(theme, { target: document.documentElement, dark: isSystemDark });
}

updateMaterialTheme(colorPicker.value);

colorPicker.addEventListener('input', (event) => {
    updateMaterialTheme(event.target.value);
});

const langButton = document.getElementById('lang-button');
const langMenu = document.getElementById('lang-menu');
const menuItems = langMenu.querySelectorAll('md-menu-item');

langButton.addEventListener('click', () => {
    langMenu.open = !langMenu.open;
});

menuItems.forEach(item => {
    item.addEventListener('click', () => {
        const selectedLang = item.getAttribute('data-lang');
        setLanguage(selectedLang);
    });
});

async function fetchTranslations(lang) {
    try {
        const response = await fetch(`./i18n/${lang}.json`);
        if (!response.ok) throw new Error(`Erreur de chargement du fichier ${lang}.json`);
        return await response.json();
    } catch (error) {
        console.error("Erreur i18n:", error);
        return null;
    }
}

function updateDOM(translations) {
    if (!translations) return;
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const keys = element.getAttribute('data-i18n').split('.');
        let value = translations;
        for (const key of keys) {
            if (value && value[key] !== undefined) value = value[key];
            else { value = null; break; }
        }
        if (value) element.textContent = value;
    });
}

async function setLanguage(lang) {
    const translations = await fetchTranslations(lang);
    updateDOM(translations);
    document.documentElement.lang = lang; 
    
    const currentLangText = document.getElementById('current-lang-text');
    if (currentLangText) {
        currentLangText.textContent = lang.toUpperCase();
    }

    menuItems.forEach(item => {
        const existingIcon = item.querySelector('md-icon[slot="end"]');
        if (existingIcon) existingIcon.remove();

        if (item.getAttribute('data-lang') === lang) {
            const checkIcon = document.createElement('md-icon');
            checkIcon.setAttribute('slot', 'end');
            checkIcon.textContent = 'check';
            item.appendChild(checkIcon);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setLanguage('fr');
});