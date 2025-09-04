/*
 * Copyright (c) 2025.
 */

export class StarRating {
    constructor(settings = {}) {
        this.settings = Object.assign(
            {
                rating    : 0,
                totalStars: 5,
                fontSize  : '1em',
                includeCss: true, // Option to include CSS or not
            },
            settings
        )
    }

    getCss() {
        return `
            <style>
                .stars-container {
                    display: flex;
                    align-items: center;
                    gap: 2px;
                }

                .star {
                    fill: #fbbf24;
                    stroke: #f59e0b;
                    stroke-width: 1;
                }

                .star.empty {
                    fill: transparent;
                    stroke: #d1d5db;
                }

                .star.partial {
                    stroke: #f59e0b;
                }
            </style>
        `;
    }

    render(rating = this.settings.rating, totalStars = this.settings.totalStars, fontSize = this.settings.fontSize, includeCss = this.settings.includeCss) {
        // Create unique gradient ID for this rating
        const gradientId = `starGradient_${Math.random().toString(36).substr(2, 9)}`;
        const percentage = ((rating % 1) * 100).toFixed(0);

        // Calculate star size based on fontSize
        const starSize = fontSize === '1em' ? '20' : fontSize.replace(/[^\d.]/g, '') * 20;

        let html = '';

        // Include CSS if requested
        if (includeCss) {
            html += this.getCss();
        }

        html += `<div class="stars-container">`;

        // Add SVG definitions for gradient (only if we have partial stars)
        if (rating % 1 > 0) {
            html += `
                <svg width="0" height="0" style="position: absolute;">
                    <defs>
                        <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="${percentage}%" stop-color="#fbbf24" />
                            <stop offset="${percentage}%" stop-color="transparent" />
                        </linearGradient>
                    </defs>
                </svg>`;
        }

        const fullStars      = Math.floor(rating);
        const hasPartialStar = rating % 1 > 0;
        const emptyStars     = totalStars - fullStars - (hasPartialStar ? 1 : 0);

        // Full stars
        for (let i = 0; i < fullStars; i++) {
            html += `
                <svg class="star" viewBox="0 0 24 24" width="${starSize}" height="${starSize}">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>`;
        }

        // Partial star
        if (hasPartialStar) {
            html += `
                <svg class="star partial" viewBox="0 0 24 24" width="${starSize}" height="${starSize}" style="fill: url(#${gradientId});">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>`;
        }

        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            html += `
                <svg class="star empty" viewBox="0 0 24 24" width="${starSize}" height="${starSize}">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>`;
        }

        html += `</div>`;
        return html;
    }
}
export class TrustSeals{
    constructor(settings = {}) {
        this.settings = Object.assign(
            {
                labels    : ["256-Bit Bank Level Security" ,
                             "SSL Secured",
                             "100% Secure Payments"],
                rating    : 0,
                seal      : 'default',
                fontSize  : '.9em',
                includeCss: true, // Option to include CSS or not
            },
            settings
        )
    }

    render(seal = this.settings.seal, labels = this.settings.labels, fontSize = this.settings.fontSize, includeCss = this.settings.includeCss) {
        if (!Array.isArray(labels) || labels.length === 0) {
            return '<div class="upayme-trust-seals-container"></div>';
        }

        const trustSealIcon = this.seals()[seal];

        const trustSeals = labels.map(text =>
            `<div class="upayme-trust-seal">
            ${trustSealIcon}
            <span>${text}</span>
        </div>`
        ).join('');

        const containerClass = labels.length === 1 ? 'upayme-trust-seals-container upayme-single-trust-seal' : 'upayme-trust-seals-container';

        let html = '';
        // Include CSS if requested
        if (includeCss) {
            html += this.getCss();
        }

        html += `<div class="${containerClass}">${trustSeals}</div>`;
        return html;
    }

    getCss() {

        const fontSize = this.settings.fontSize;

        return `
        <style>
            .upayme-trust-seals-container {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 16px;
                background: transparent;
            }
            
            .upayme-trust-seal {
                fill: #09B29C;
                fill: var(--gpcp-color-primary);
                fill: var(--esyp-traffic-light-green);
                display: flex;
                flex-direction: row;
                align-items: center;
                font-size: ${fontSize};
            }
            .upayme-trust-seal svg {
                width:  1.5em;
                height: 1.5em;
                margin-right: .3em;
            }
            .upayme-trust-seal span {
                font-weight: bold;
            }
            .upayme-trust-seal-check {
                fill: #fff;
            }
        </style>
        `;
    }
    seals() {
        return {
            default : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 735.47 735.47"> <defs> <style> .cls-3 { fill: transparent; } </style> </defs> <path class="cls-3" d="M735.47,839.75H0V0h735.47v839.75ZM122.79,190.43c2.89,30.16,3.93,58.97,8.98,87.07,3.16,17.6-3.73,28.15-14.2,39.67-18.56,20.43-36.26,41.63-54.6,62.83,21.97,25.34,42.98,49.26,63.52,73.57,3.22,3.81,6.14,9.44,6.07,14.18-.17,11.3-2.42,22.56-3.47,33.87-2.13,22.91-4.02,45.85-6.02,68.79,32.99,6.92,64.62,13.05,95.93,20.52,6.45,1.54,13.68,6.86,17.18,12.53,16.87,27.3,32.58,55.32,48.95,83.52,26.77-11.6,52.9-22.15,78.3-34.23,13.71-6.52,25.26-7.51,39.55-.36,25.48,12.75,52.24,22.93,78.94,34.39,17.44-29.23,34.24-57.82,51.62-86.06,2.54-4.13,7.34-8.02,11.91-9.51,9.02-2.93,18.62-4.06,27.97-5.98,23.87-4.92,47.73-9.88,71.77-14.85-3.39-32.76-6.2-64.03-10.09-95.17-1.24-9.96.84-17.2,7.58-24.63,18.96-20.89,37.39-42.27,55.49-63.91,2.22-2.66,3.11-9.75,1.25-11.99-18.01-21.7-36.1-43.41-55.55-63.8-8.3-8.7-10.13-17.05-8.7-28.13,3.56-27.52,6.28-55.15,9.54-82.7.84-7.06-.88-10.34-8.75-11.85-29.41-5.67-58.69-12.07-87.86-18.86-5.21-1.21-11.25-4.5-14.2-8.73-7.5-10.72-13.39-22.56-20.06-33.87-10.53-17.84-21.18-35.61-31.91-53.63-30.42,13.13-59.36,26.1-88.77,37.89-5.83,2.34-14.25,2.11-20.13-.27-29.36-11.9-58.28-24.91-87.94-37.78-15.09,26.06-30.31,51.34-44.47,77.21-6.79,12.4-15.24,19.49-29.82,21.94-29.13,4.9-57.9,11.95-88,18.36Z"></path> <path class="upayme-trust-seal" d="M122.79,190.43c30.1-6.41,58.86-13.47,88-18.36,14.58-2.45,23.03-9.54,29.82-21.94,14.16-25.87,29.38-51.16,44.47-77.21,29.66,12.88,58.58,25.89,87.94,37.78,5.88,2.38,14.3,2.61,20.13.27,29.41-11.79,58.35-24.76,88.77-37.89,10.73,18.03,21.38,35.8,31.91,53.63,6.68,11.31,12.56,23.15,20.06,33.87,2.95,4.22,8.99,7.51,14.2,8.73,29.17,6.79,58.45,13.19,87.86,18.86,7.87,1.52,9.59,4.79,8.75,11.85-3.27,27.56-5.98,55.19-9.54,82.7-1.43,11.07.4,19.43,8.7,28.13,19.45,20.39,37.54,42.1,55.55,63.8,1.86,2.24.97,9.33-1.25,11.99-18.09,21.64-36.53,43.02-55.49,63.91-6.74,7.42-8.82,14.67-7.58,24.63,3.88,31.14,6.7,62.41,10.09,95.17-24.04,4.98-47.9,9.93-71.77,14.85-9.35,1.93-18.95,3.06-27.97,5.98-4.57,1.48-9.36,5.38-11.91,9.51-17.38,28.24-34.18,56.83-51.62,86.06-26.7-11.46-53.46-21.63-78.94-34.39-14.29-7.15-25.84-6.16-39.55.36-25.41,12.08-51.53,22.63-78.3,34.23-16.37-28.2-32.08-56.21-48.95-83.52-3.5-5.66-10.73-10.99-17.18-12.53-31.31-7.47-62.95-13.61-95.93-20.52,1.99-22.94,3.89-45.88,6.02-68.79,1.05-11.31,3.29-22.56,3.47-33.87.07-4.74-2.85-10.36-6.07-14.18-20.54-24.31-41.54-48.23-63.52-73.57,18.34-21.2,36.04-42.41,54.6-62.83,10.47-11.52,17.36-22.07,14.2-39.67-5.05-28.09-6.09-56.91-8.98-87.07ZM350.36,429.55c-25.44-23.79-50.79-47.48-75.03-70.15-6.43,5.63-13.58,11.9-17.74,15.54,30.92,32.54,61.45,64.68,91.3,96.1,54.76-55.08,108.84-109.49,163.38-164.34-5.91-5.52-12.41-11.6-20.34-19-48.05,48.14-95.28,95.46-141.57,141.85Z"></path> <path class="upayme-trust-seal-check" d="M350.36,429.55c46.29-46.39,93.52-93.71,141.57-141.85,7.93,7.41,14.43,13.48,20.34,19-54.54,54.86-108.62,109.26-163.38,164.34-29.86-31.43-60.39-63.56-91.3-96.1,4.16-3.65,11.31-9.91,17.74-15.54,24.25,22.67,49.59,46.36,75.03,70.15Z"></path> </svg>',
        }
    }
}
export class PoweredBy{
    constructor(settings = {}) {
        this.settings = Object.assign(
            {
                style          : 'default',
                label          : 'powered by',
                fontSize       : '1em',
                backgroundColor: '#800080',
                color          : '#667eea',
            },
            settings
        )
    }

    styles() {
        return {
            default : '',
        };
    }

    twoLineGhostButton(settings) {

        // Default settings
        const defaultSettings = {
            label: "powered by",
            fontSize: "1em",
            backgroundColor: "#667eea",
            color: "#667eea"
        };

        // Merge default settings with provided settings
        const finalSettings = { ...defaultSettings, ...settings };

        const label               = finalSettings.label;
        const fontSize            = finalSettings.fontSize;
        const backgroundColor     = finalSettings.backgroundColor;
        const backgroundColorRGBA = this.hexToRgba(backgroundColor, 0.1);
        const color               = finalSettings.color;

        const style = `
        <style>
            .two-line-ghost-button {
                display: flex;
                align-items: center;
                gap: 0.7em;
                padding: 0.5em 0.9em;
                background: ${backgroundColorRGBA};
                border: none;
                border-radius: 0.3em;
                color: ${color};
                text-decoration: none;
                transition: all 0.2s ease;
                font-size: ${fontSize};
            }
            .two-line-ghost-button .btn-text {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                line-height: 1.2;
            }
            .two-line-ghost-button .btn-text .line-1 {
                font-size: 0.7em;
                font-weight: 400;
                opacity: 0.8;
            }
            .two-line-ghost-button .btn-text .line-2 {
                font-size: 0.9em;
                font-weight: 600;
            }
            .two-line-ghost-button .arrow-icon-btn-small {
                width: 1em;
                height: 1em;
                stroke: currentColor;
                stroke-width: 2;
                fill: none;
                transition: transform 0.2s ease;
                flex-shrink: 0;
            }
        </style>
    `;

        const html = `
        <a href="https://upay.me" class="two-line-ghost-button">
            <span class="btn-text">
                <span class="line-1">${label}</span>
                <span class="line-2">upay.me</span>
            </span>
            <svg class="arrow-icon-btn-small" viewBox="0 0 24 24">
                <path d="M5 12h14m-7-7l7 7-7 7"></path>
            </svg>
        </a>
    `;

        return style + html;
    }
    oneLineGhostButton(settings) {

        // Default settings
        const defaultSettings = {
            label: "powered by",
            fontSize: "1em",
            backgroundColor: "#667eea",
            color: "#667eea"
        };

        // Merge default settings with provided settings
        const finalSettings = { ...defaultSettings, ...settings };

        const label               = finalSettings.label;
        const fontSize            = finalSettings.fontSize;
        const backgroundColor     = finalSettings.backgroundColor;
        const backgroundColorRGBA = this.hexToRgba(backgroundColor, 0.1);
        const color               = finalSettings.color;

        const style = `
        <style>
            .one-line-ghost-button {
                display: flex;
                align-items: center;
                gap: 0.7em;
                padding: 0.5em 0.9em;
                background: ${backgroundColorRGBA};
                border: none;
                border-radius: 0.3em;
                color: ${color};
                text-decoration: none;
                transition: all 0.2s ease;
                font-size: ${fontSize};
            }
            .one-line-ghost-button .btn-text {
                display: flex;
                flex-direction: row;
                align-items: center;
                line-height: 1.2;
            }
            .one-line-ghost-button .btn-text .line-1 {
                font-size: 0.9em;
                font-weight: 400;
                opacity: 0.8;
            }
            .one-line-ghost-button .btn-text .line-2 {
                font-size: 0.9em;
                font-weight: 600;
            }
            .one-line-ghost-button .arrow-icon-btn-small {
                width: 1em;
                height: 1em;
                stroke: currentColor;
                stroke-width: 2;
                fill: none;
                transition: transform 0.2s ease;
                flex-shrink: 0;
            }
        </style>
    `;

        const html = `
        <a href="https://upay.me" class="one-line-ghost-button">
            <span class="btn-text">
                <span class="line-1">${label}&nbsp;</span>
                <span class="line-2">upay.me</span>
            </span>
            <svg class="arrow-icon-btn-small" viewBox="0 0 24 24">
                <path d="M5 12h14m-7-7l7 7-7 7"></path>
            </svg>
        </a>
    `;

        return style + html;
    }
    oneLine(settings) {
        // Default settings
        const defaultSettings = {
            label: "powered by",
            fontSize: "1em",
            color: "#667eea"
        };

        // Merge default settings with provided settings
        const finalSettings = { ...defaultSettings, ...settings };

        const label               = finalSettings.label;
        const fontSize            = finalSettings.fontSize;
        const color               = finalSettings.color;

        const style = `
        <style>

            .one-line { 
                text-decoration: none;
                color: ${color};
            }
            .one-line .poweredby-text {
                display: flex;
                flex-direction: row;
                align-items: flex-start;
                line-height: 1.2;
            }
            .one-line .label {
                font-size: 0.9em;
            }
            .one-line .upayme {
                font-size: 0.9em;
                font-weight: bold;
            }

        </style>`;

        const html = `
        <a href="https://upay.me" class="one-line">
            <span class="poweredby-text">
                <span class="label">${label}&nbsp;</span>
                <span class="upayme">upay.me</span>
            </span>
        </a>`;

        return style + html;

    }
    oneLineSeal(settings) {
        // Default settings
        const defaultSettings = {
            label: "powered by",
            fontSize: "1em",
            color: "#667eea"
        };

        // Merge default settings with provided settings
        const finalSettings = { ...defaultSettings, ...settings };

        const label               = finalSettings.label;
        const fontSize            = finalSettings.fontSize;
        const color               = finalSettings.color;

        const style = `
        <style>

            .upayme-proof-one-line-seal { 
                text-decoration: none;
                color: ${color};
                font-width: bold;
                display: flex;
                align-items: center;         
            }
            .upayme-proof-one-line-seal img {
                width: 1em;
                margin-right: 0.2em;
            }
            
            .one-line .label {
                font-size: 0.9em;
            }
            .one-line .upayme {
                font-size: 0.9em;
                font-weight: bold;
            }

        </style>`;

        const html = `
            <a href="https://upay.me" class="upayme-proof-one-line-seal">
                    <img src="/upayme-application-conversiontools/assets/img/proof.svg">
                upay.me
            </a>`;

        return style + html;

    }

    hexToRgba(hex, opacity = 1) {
        hex = hex.replace('#', '');
        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('');
        }
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;

        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
}

