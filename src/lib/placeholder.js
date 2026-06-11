// Inline SVG product placeholder (data URI). Used as <img> onError fallback,
// so the catalog never shows a broken image — a branded thumbnail appears instead.
const SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'>
  <defs>
    <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0' stop-color='#1b1f36'/>
      <stop offset='1' stop-color='#2a2152'/>
    </linearGradient>
  </defs>
  <rect width='240' height='240' fill='url(#bg)'/>
  <g transform='translate(120,108)' fill='none' stroke='#22d3c5' stroke-width='8' stroke-linecap='round' stroke-linejoin='round' opacity='0.92'>
    <circle r='30'/>
    <circle r='10' fill='#22d3c5' stroke='none'/>
    <g stroke-width='9'>
      <line x1='0' y1='-30' x2='0' y2='-46'/>
      <line x1='0' y1='30' x2='0' y2='46'/>
      <line x1='-30' y1='0' x2='-46' y2='0'/>
      <line x1='30' y1='0' x2='46' y2='0'/>
      <line x1='-21' y1='-21' x2='-33' y2='-33'/>
      <line x1='21' y1='21' x2='33' y2='33'/>
      <line x1='21' y1='-21' x2='33' y2='-33'/>
      <line x1='-21' y1='21' x2='-33' y2='33'/>
    </g>
  </g>
  <text x='120' y='210' fill='#8b93b8' font-size='15' font-family='Arial, sans-serif' font-weight='700' letter-spacing='2' text-anchor='middle'>PARTSEEKER</text>
</svg>`;

export const PLACEHOLDER_IMG = 'data:image/svg+xml,' + encodeURIComponent(SVG);

// onError handler — swaps to placeholder once and stops further error loops.
export const onImgError = (e) => {
  if (e.target.dataset.fallback) return;
  e.target.dataset.fallback = '1';
  e.target.src = PLACEHOLDER_IMG;
};
