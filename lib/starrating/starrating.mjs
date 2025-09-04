/*
 * Copyright (c) 2025.
 */

export default class StarRating {
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