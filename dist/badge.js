/**
 * Generate a retina-crisp SVG badge for GitHub READMEs showing the Tool Quality Index (TQI).
 */
export function generateSvgBadge(tqi, grade) {
    const clampedTqi = Math.min(100, Math.max(0, Math.round(tqi)));
    let color = '#4c1'; // green for A/A+
    if (grade === 'B')
        color = '#007ec6'; // blue
    else if (grade === 'C')
        color = '#dfb317'; // yellow
    else if (grade === 'D')
        color = '#fe7d37'; // orange
    else if (grade === 'F')
        color = '#e05d44'; // red
    const leftText = 'MCP Quality';
    const rightText = `${grade} (${clampedTqi}/100)`;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="168" height="20" role="img" aria-label="${leftText}: ${rightText}">
  <title>${leftText}: ${rightText}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="168" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="84" height="20" fill="#555"/>
    <rect x="84" width="84" height="20" fill="${color}"/>
    <rect width="168" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">
    <text aria-hidden="true" x="430" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)">${leftText}</text>
    <text x="430" y="140" transform="scale(.1)" fill="#fff">${leftText}</text>
    <text aria-hidden="true" x="1250" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)">${rightText}</text>
    <text x="1250" y="140" transform="scale(.1)" fill="#fff">${rightText}</text>
  </g>
</svg>`;
}
