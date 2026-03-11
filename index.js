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