let loadedImage = null;
let gridData = [];
let activePalette = [];
let gridWidth = 50;
let gridHeight = 50;

const imageInput = document.getElementById('imageInput');
const origPreview = document.getElementById('origPreview');
const origPlaceholder = document.getElementById('origPlaceholder');
const patternCanvas = document.getElementById('patternCanvas');
const patternCtx = patternCanvas.getContext('2d');

const patternTitleInput = document.getElementById('patternTitleInput');

const tileSizeInput = document.getElementById('tileSize');
const tileSizeVal = document.getElementById('tileSizeVal');
const colorCountInput = document.getElementById('colorCount');
const colorCountVal = document.getElementById('colorCountVal');
const brightnessInput = document.getElementById('brightness');
const brightnessVal = document.getElementById('brightnessVal');
const contrastInput = document.getElementById('contrast');
const contrastVal = document.getElementById('contrastVal');
const zoomRange = document.getElementById('zoomRange');
const zoomVal = document.getElementById('zoomVal');
const minCellSizeSelect = document.getElementById('minCellSize');

const printModal = document.getElementById('printModal');
const openPrintBtn = document.getElementById('openPrintBtn');
const closePrintBtn = document.getElementById('closePrintBtn');
const doPrintBtn = document.getElementById('doPrintBtn');
const printPages = document.getElementById('printPages');
const saveJsonBtn = document.getElementById('saveJsonBtn');
const loadJsonInput = document.getElementById('loadJsonInput');
const patternBox = document.getElementById('patternBox');
const zoomFitBtn = document.getElementById('zoomFitBtn');

imageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    loadedImage = new Image();
    loadedImage.onload = () => {
      origPreview.src = loadedImage.src;
      origPreview.style.display = 'block';
      origPlaceholder.style.display = 'none';
      processImage();
    };
    loadedImage.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

function findClosestDMC(r, g, b, paletteList = DMC_COLORS) {
  let minDist = Infinity;
  let closest = paletteList[0];
  for (let color of paletteList) {
    let dist = Math.sqrt(
      Math.pow(r - color.r, 2) +
      Math.pow(g - color.g, 2) +
      Math.pow(b - color.b, 2)
    );
    if (dist < minDist) {
      minDist = dist;
      closest = color;
    }
  }
  return closest;
}

function processImage() {
  if (!loadedImage) return;

  gridWidth = parseInt(tileSizeInput.value);
  const aspectRatio = loadedImage.height / loadedImage.width;
  gridHeight = Math.round(gridWidth * aspectRatio);

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = gridWidth;
  tempCanvas.height = gridHeight;
  const tempCtx = tempCanvas.getContext('2d');

  tempCtx.drawImage(loadedImage, 0, 0, gridWidth, gridHeight);
  const imgData = tempCtx.getImageData(0, 0, gridWidth, gridHeight);
  const pixels = imgData.data;

  const brightness = parseInt(brightnessInput.value);
  const contrast = parseInt(contrastInput.value);
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

  const processedPixels = [];

  for (let i = 0; i < pixels.length; i += 4) {
    let r = pixels[i] + brightness;
    let g = pixels[i+1] + brightness;
    let b = pixels[i+2] + brightness;

    r = factor * (r - 128) + 128;
    g = factor * (g - 128) + 128;
    b = factor * (b - 128) + 128;

    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));

    processedPixels.push({ r, g, b });
  }

  const maxColors = parseInt(colorCountInput.value);
  activePalette = generateReducedDMCPalette(processedPixels, maxColors);

  gridData = [];
  for (let y = 0; y < gridHeight; y++) {
    const row = [];
    for (let x = 0; x < gridWidth; x++) {
      const idx = y * gridWidth + x;
      const p = processedPixels[idx];
      const closestDMC = findClosestDMC(p.r, p.g, p.b, activePalette);
      const paletteIdx = activePalette.findIndex(c => c.code === closestDMC.code);
      row.push(paletteIdx >= 0 ? paletteIdx : 0);
    }
    gridData.push(row);
  }

  renderPattern();
}

function generateReducedDMCPalette(pixels, targetColorCount) {
  const colorCounts = {};
  pixels.forEach(p => {
    const dmc = findClosestDMC(p.r, p.g, p.b, DMC_COLORS);
    colorCounts[dmc.code] = (colorCounts[dmc.code] || 0) + 1;
  });

  const sortedDmcCodes = Object.keys(colorCounts).sort((a,b) => colorCounts[b] - colorCounts[a]);
  const selectedCodes = sortedDmcCodes.slice(0, targetColorCount);
  return DMC_COLORS.filter(c => selectedCodes.includes(c.code));
}

// 100% zoom = the whole pattern fits the preview box (same as the original image),
// higher values zoom in from there. The canvas is drawn at device resolution.
function renderPattern() {
  if (!gridData.length) return;

  const zoom = parseInt(zoomRange.value) / 100;
  const boxW = Math.max(1, patternBox.clientWidth - 2);
  const boxH = Math.max(1, patternBox.clientHeight - 2);
  const fitCell = Math.min(boxW / gridWidth, boxH / gridHeight);
  const displayCell = fitCell * zoom;

  const dpr = window.devicePixelRatio || 1;
  const maxCanvasDim = 8000;
  const cellSize = Math.max(1, Math.min(
    Math.round(displayCell * dpr),
    Math.floor(maxCanvasDim / Math.max(gridWidth, gridHeight))
  ));

  patternCanvas.width = gridWidth * cellSize;
  patternCanvas.height = gridHeight * cellSize;
  patternCanvas.style.width = `${Math.floor(gridWidth * displayCell)}px`;
  patternCanvas.style.height = `${Math.floor(gridHeight * displayCell)}px`;

  // Numbers are unreadable below ~9 CSS px per cell, so only draw them when zoomed enough
  const showNumbers = displayCell >= 9;

  patternCtx.clearRect(0, 0, patternCanvas.width, patternCanvas.height);
  patternCtx.font = `${Math.floor(cellSize * 0.55)}px sans-serif`;
  patternCtx.textAlign = 'center';
  patternCtx.textBaseline = 'middle';
  patternCtx.lineWidth = Math.max(1, cellSize / 18);

  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      const colorIdx = gridData[y][x];
      const dmc = activePalette[colorIdx] || DMC_COLORS[0];

      patternCtx.fillStyle = `rgb(${dmc.r}, ${dmc.g}, ${dmc.b})`;
      patternCtx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

      if (!showNumbers) continue;

      patternCtx.strokeStyle = 'rgba(0,0,0,0.15)';
      patternCtx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);

      const luminance = (0.299 * dmc.r + 0.587 * dmc.g + 0.114 * dmc.b) / 255;
      patternCtx.fillStyle = luminance > 0.5 ? '#000000' : '#ffffff';

      patternCtx.fillText(
        colorIdx + 1,
        x * cellSize + cellSize / 2,
        y * cellSize + cellSize / 2
      );
    }
  }

  patternCtx.strokeStyle = 'rgba(0,0,0,0.6)';
  patternCtx.lineWidth = Math.max(1.5, cellSize / 12);
  for (let x = 0; x <= gridWidth; x += 10) {
    patternCtx.beginPath();
    patternCtx.moveTo(x * cellSize, 0);
    patternCtx.lineTo(x * cellSize, gridHeight * cellSize);
    patternCtx.stroke();
  }
  for (let y = 0; y <= gridHeight; y += 10) {
    patternCtx.beginPath();
    patternCtx.moveTo(0, y * cellSize);
    patternCtx.lineTo(gridWidth * cellSize, y * cellSize);
    patternCtx.stroke();
  }
}

// ---------- Print (always A4) ----------
// Lengths in CSS px (96/inch). These mirror the fixed sizes in styles.css
// (.page-sheet, .print-header, .print-body, .print-legend-container, .legend-*).
const MM = 96 / 25.4;
const PRINT_LAYOUT = {
  pagePadding: 3.3 * MM,
  headerHeight: (12 + 1.5) * MM, // header height + margin-bottom
  bodyGap: 3 * MM,
  legendEdge: 7,                 // padding 6 + border 1
  legendTitle: 16 + 4,           // title height + flex gap
  legendRowH: 20,
  legendRowGap: 3,
  legendColGap: 8,
  legendItemFixed: 14 + 5        // colour box + gap
};
const A4 = {
  portrait:  { w: 210 * MM, h: 297 * MM },
  landscape: { w: 297 * MM, h: 210 * MM }
};
// Row/column numbers sit in a 2-cell margin top/left, plus 1 spare cell right/bottom
const AXIS_CELLS = 2;
const EXTRA_CELLS = AXIS_CELLS + 1;
// Long-side canvas resolution (~260 dpi on A4), so the grid stays sharp when scaled
const PRINT_TARGET_PX = 3000;
// Below this cell size the numbers inside cells are unreadable, so they are left out
const MIN_NUMBERED_CELL_MM = 1.8;

function printContentArea(orientation) {
  const L = PRINT_LAYOUT;
  return {
    w: A4[orientation].w - 2 * L.pagePadding,
    h: A4[orientation].h - 2 * L.pagePadding - L.headerHeight
  };
}

let measureCtx = null;
function legendMetrics() {
  measureCtx = measureCtx || document.createElement('canvas').getContext('2d');
  const family = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
  let maxText = 0;
  activePalette.forEach(dmc => {
    measureCtx.font = `bold 10px ${family}`;   // .legend-code 7.5pt
    maxText = Math.max(maxText, measureCtx.measureText(dmc.code).width);
    measureCtx.font = `8.667px ${family}`;     // .legend-name 6.5pt
    maxText = Math.max(maxText, measureCtx.measureText(`(${dmc.name})`).width);
  });
  measureCtx.font = `bold 11.333px ${family}`; // .legend-title 8.5pt
  return {
    colW: Math.ceil(PRINT_LAYOUT.legendItemFixed + maxText + 4),
    titleW: Math.ceil(measureCtx.measureText(t('legendTitle')).width + 4)
  };
}

function legendSize(cols, metrics) {
  const L = PRINT_LAYOUT;
  const rows = Math.ceil(activePalette.length / cols);
  return {
    cols,
    rows,
    colW: metrics.colW,
    w: 2 * L.legendEdge + Math.max(metrics.titleW, cols * metrics.colW + (cols - 1) * L.legendColGap),
    h: 2 * L.legendEdge + L.legendTitle + rows * L.legendRowH + (rows - 1) * L.legendRowGap
  };
}

// Tries the legend beside and under the grid, with every column count, in both
// orientations, and keeps the layout where the grid cells come out largest,
// i.e. the one that leaves the least blank paper.
function chooseLegendLayout(cellsW, cellsH) {
  const L = PRINT_LAYOUT;
  const metrics = legendMetrics();
  let best = null;
  for (const orientation of ['portrait', 'landscape']) {
    const area = printContentArea(orientation);
    for (let cols = 1; cols <= activePalette.length; cols++) {
      const legend = legendSize(cols, metrics);
      const options = [];
      if (legend.h <= area.h) options.push({ placement: 'side', gridW: area.w - legend.w - L.bodyGap, gridH: area.h });
      if (legend.w <= area.w) options.push({ placement: 'bottom', gridW: area.w, gridH: area.h - legend.h - L.bodyGap });
      for (const opt of options) {
        if (opt.gridW <= 0 || opt.gridH <= 0) continue;
        const cell = Math.min(opt.gridW / cellsW, opt.gridH / cellsH);
        if (!best || cell > best.cell + 0.01) {
          best = { orientation, placement: opt.placement, legend, cell };
        }
      }
    }
  }
  return best;
}

// Splits the pattern into equal page sections no smaller than minCellPx per cell,
// in whichever orientation needs the fewest pages.
function chooseTiling(minCellPx) {
  let best = null;
  for (const orientation of ['portrait', 'landscape']) {
    const area = printContentArea(orientation);
    const perPageX = Math.max(1, Math.floor(area.w / minCellPx) - EXTRA_CELLS);
    const perPageY = Math.max(1, Math.floor(area.h / minCellPx) - EXTRA_CELLS);
    const pagesX = Math.ceil(gridWidth / perPageX);
    const pagesY = Math.ceil(gridHeight / perPageY);
    const count = pagesX * pagesY;
    if (!best || count < best.count) {
      best = {
        orientation, pagesX, pagesY, count,
        tileW: Math.ceil(gridWidth / pagesX),
        tileH: Math.ceil(gridHeight / pagesY)
      };
    }
  }
  return best;
}

// Draws columns x0..x0+cols and rows y0..y0+rows onto a canvas sized for
// frameCols x frameRows cells (so all section pages share one scale), with
// row/column numbers every 10 stitches. `tiling` outlines the section pages.
function renderPrintGrid({ x0 = 0, y0 = 0, cols = gridWidth, rows = gridHeight,
                           frameCols = cols, frameRows = rows,
                           showNumbers = true, tiling = null, firstSectionPage = 2 }) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const totalCols = frameCols + EXTRA_CELLS;
  const totalRows = frameRows + EXTRA_CELLS;
  const cell = Math.max(14, Math.floor(PRINT_TARGET_PX / Math.max(totalCols, totalRows)));
  const m = AXIS_CELLS * cell;

  canvas.width = totalCols * cell;
  canvas.height = totalRows * cell;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `bold ${Math.floor(cell * 0.6)}px sans-serif`;
  ctx.lineWidth = Math.max(0.5, cell * 0.035);
  ctx.strokeStyle = '#cccccc';

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const colorIdx = gridData[y0 + y][x0 + x];
      const dmc = activePalette[colorIdx] || DMC_COLORS[0];
      const px = m + x * cell;
      const py = m + y * cell;

      ctx.fillStyle = `rgb(${dmc.r}, ${dmc.g}, ${dmc.b})`;
      ctx.fillRect(px, py, cell, cell);
      ctx.strokeRect(px, py, cell, cell);

      if (showNumbers) {
        const luminance = (0.299 * dmc.r + 0.587 * dmc.g + 0.114 * dmc.b) / 255;
        ctx.fillStyle = luminance > 0.5 ? '#000000' : '#ffffff';
        ctx.fillText(colorIdx + 1, px + cell / 2, py + cell / 2);
      }
    }
  }

  // Bold lines every 10 stitches, aligned to the whole pattern, not the section
  const thick = Math.max(1.5, cell * 0.1);
  const right = m + cols * cell;
  const bottom = m + rows * cell;
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = thick;
  for (let x = 0; x <= cols; x++) {
    if ((x0 + x) % 10 !== 0) continue;
    ctx.beginPath();
    ctx.moveTo(m + x * cell, m);
    ctx.lineTo(m + x * cell, bottom);
    ctx.stroke();
  }
  for (let y = 0; y <= rows; y++) {
    if ((y0 + y) % 10 !== 0) continue;
    ctx.beginPath();
    ctx.moveTo(m, m + y * cell);
    ctx.lineTo(right, m + y * cell);
    ctx.stroke();
  }
  ctx.strokeRect(m, m, cols * cell, rows * cell);

  // Stitch numbers in the margin
  ctx.fillStyle = '#000000';
  ctx.font = `bold ${Math.floor(cell * 0.75)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let x = 0; x <= cols; x++) {
    const n = x0 + x;
    if (n > 0 && n % 10 === 0) ctx.fillText(n, m + x * cell, m - cell * 0.8);
  }
  ctx.textAlign = 'right';
  for (let y = 0; y <= rows; y++) {
    const n = y0 + y;
    if (n > 0 && n % 10 === 0) ctx.fillText(n, m - cell * 0.3, m + y * cell);
  }

  // Overview: outline each section page and label it with its page number
  if (tiling) {
    ctx.strokeStyle = 'rgba(220, 0, 0, 0.9)';
    ctx.lineWidth = thick * 1.5;
    ctx.setLineDash([cell * 0.8, cell * 0.4]);
    ctx.textAlign = 'center';
    const labelSize = Math.floor(Math.min(tiling.tileW, tiling.tileH) * cell * 0.3);
    ctx.font = `bold ${labelSize}px sans-serif`;
    let page = firstSectionPage;
    for (let ty = 0; ty < tiling.pagesY; ty++) {
      for (let tx = 0; tx < tiling.pagesX; tx++) {
        const sx = tx * tiling.tileW;
        const sy = ty * tiling.tileH;
        const w = Math.min(tiling.tileW, gridWidth - sx) * cell;
        const h = Math.min(tiling.tileH, gridHeight - sy) * cell;
        ctx.strokeRect(m + sx * cell, m + sy * cell, w, h);

        ctx.setLineDash([]);
        ctx.lineWidth = labelSize * 0.12;
        ctx.strokeStyle = '#ffffff';
        ctx.strokeText(page, m + sx * cell + w / 2, m + sy * cell + h / 2);
        ctx.fillStyle = 'rgba(220, 0, 0, 0.9)';
        ctx.fillText(page, m + sx * cell + w / 2, m + sy * cell + h / 2);
        ctx.strokeStyle = 'rgba(220, 0, 0, 0.9)';
        ctx.lineWidth = thick * 1.5;
        ctx.setLineDash([cell * 0.8, cell * 0.4]);
        page++;
      }
    }
    ctx.setLineDash([]);
  }

  return canvas;
}

function buildLegendElement(legend, placement) {
  const container = document.createElement('div');
  container.className = 'print-legend-container';
  if (placement === 'side') container.style.width = `${legend.w}px`;
  else container.style.height = `${legend.h}px`;

  const title = document.createElement('div');
  title.className = 'legend-title';
  title.innerText = t('legendTitle');

  const grid = document.createElement('div');
  grid.className = 'legend-grid';
  grid.style.gridTemplateRows = `repeat(${legend.rows}, ${PRINT_LAYOUT.legendRowH}px)`;
  grid.style.gridAutoColumns = placement === 'side' ? `${legend.colW}px` : `minmax(${legend.colW}px, 1fr)`;

  activePalette.forEach((dmc, idx) => {
    const item = document.createElement('div');
    item.className = 'legend-item';

    const box = document.createElement('div');
    box.className = 'legend-box';
    box.style.backgroundColor = `rgb(${dmc.r}, ${dmc.g}, ${dmc.b})`;

    const luminance = (0.299 * dmc.r + 0.587 * dmc.g + 0.114 * dmc.b) / 255;
    box.style.color = luminance > 0.5 ? '#000000' : '#ffffff';
    box.innerText = idx + 1;

    const labelText = document.createElement('div');
    labelText.className = 'legend-text';

    const codeSpan = document.createElement('span');
    codeSpan.className = 'legend-code';
    codeSpan.innerText = dmc.code;

    const nameSpan = document.createElement('span');
    nameSpan.className = 'legend-name';
    nameSpan.innerText = `(${dmc.name})`;

    labelText.appendChild(codeSpan);
    labelText.appendChild(nameSpan);

    item.appendChild(box);
    item.appendChild(labelText);
    grid.appendChild(item);
  });

  container.appendChild(title);
  container.appendChild(grid);
  return container;
}

function createSheet(orientation, title, subtitle, pageInfo) {
  const sheet = document.createElement('div');
  sheet.className = `page-sheet ${orientation}`;

  const header = document.createElement('div');
  header.className = 'print-header';
  const titles = document.createElement('div');
  const titleEl = document.createElement('div');
  titleEl.className = 'print-title';
  titleEl.innerText = title;
  const subtitleEl = document.createElement('div');
  subtitleEl.className = 'print-subtitle';
  subtitleEl.innerText = subtitle;
  titles.append(titleEl, subtitleEl);
  const info = document.createElement('div');
  info.className = 'print-page-info';
  info.innerText = pageInfo;
  header.append(titles, info);

  const body = document.createElement('div');
  body.className = 'print-body';

  sheet.append(header, body);
  printPages.appendChild(sheet);
  return body;
}

function gridContainer(canvas, extraClass = '') {
  const box = document.createElement('div');
  box.className = `print-grid-container ${extraClass}`.trim();
  box.appendChild(canvas);
  return box;
}

// Page 1 always holds the whole pattern + legend. If that makes the cells smaller
// than the chosen minimum, it becomes an overview and the pattern is repeated
// at a readable size on extra section pages.
function buildPrintPages() {
  printPages.innerHTML = '';
  const title = patternTitleInput.value.trim() || t('defaultName');
  const dims = t('dims', gridWidth, gridHeight, activePalette.length);

  const layout = chooseLegendLayout(gridWidth + EXTRA_CELLS, gridHeight + EXTRA_CELLS);
  const cellMm = layout.cell / MM;
  const minCellMm = parseFloat(minCellSizeSelect.value) || 0;
  const tiling = minCellMm > 0 && cellMm < minCellMm ? chooseTiling(minCellMm * MM) : null;
  const totalPages = tiling ? 1 + tiling.count : 1;

  const firstBody = createSheet(
    layout.orientation, title, dims,
    tiling ? t('overviewPage', totalPages) : ''
  );
  firstBody.classList.add(layout.placement === 'side' ? 'legend-side' : 'legend-bottom');
  firstBody.append(
    gridContainer(renderPrintGrid({ showNumbers: cellMm >= MIN_NUMBERED_CELL_MM, tiling })),
    buildLegendElement(layout.legend, layout.placement)
  );

  if (!tiling) return;

  let page = 2;
  for (let ty = 0; ty < tiling.pagesY; ty++) {
    for (let tx = 0; tx < tiling.pagesX; tx++) {
      const x0 = tx * tiling.tileW;
      const y0 = ty * tiling.tileH;
      const cols = Math.min(tiling.tileW, gridWidth - x0);
      const rows = Math.min(tiling.tileH, gridHeight - y0);
      const body = createSheet(
        tiling.orientation, title,
        t('sectionRange', x0 + 1, x0 + cols, y0 + 1, y0 + rows),
        t('page', page, totalPages)
      );
      body.appendChild(gridContainer(
        renderPrintGrid({ x0, y0, cols, rows, frameCols: tiling.tileW, frameRows: tiling.tileH }),
        'section'
      ));
      page++;
    }
  }
}

function setupPrintPreview() {
  buildPrintPages();
}

tileSizeInput.addEventListener('input', (e) => {
  tileSizeVal.innerText = e.target.value;
  processImage();
});

colorCountInput.addEventListener('input', (e) => {
  colorCountVal.innerText = e.target.value;
  processImage();
});

brightnessInput.addEventListener('input', (e) => {
  brightnessVal.innerText = e.target.value;
  processImage();
});

contrastInput.addEventListener('input', (e) => {
  contrastVal.innerText = e.target.value;
  processImage();
});

zoomRange.addEventListener('input', (e) => {
  zoomVal.innerText = `${e.target.value}%`;
  renderPattern();
});

zoomFitBtn.addEventListener('click', () => {
  zoomRange.value = 100;
  zoomVal.innerText = '100%';
  renderPattern();
  patternBox.scrollTo(0, 0);
});

// Refit when the preview box changes size (window resize, browser zoom, layout change)
let resizeFrame = 0;
new ResizeObserver(() => {
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(renderPattern);
}).observe(patternBox);

openPrintBtn.addEventListener('click', () => {
  if (!gridData.length) {
    alert(t('needImage'));
    return;
  }
  setupPrintPreview();
  printModal.classList.add('active');
});

closePrintBtn.addEventListener('click', () => {
  printModal.classList.remove('active');
});

doPrintBtn.addEventListener('click', () => {
  window.print();
});

// Tooltips: hover shows one; click/tap/Enter pins it. Only one can be pinned, and
// hovering another tip, clicking elsewhere or pressing Escape closes it.
const tips = document.querySelectorAll('.tip');
function closeTips(except = null) {
  tips.forEach(tip => { if (tip !== except) tip.classList.remove('open'); });
}
tips.forEach(tip => {
  tip.addEventListener('click', (e) => {
    e.preventDefault(); // tips sit inside <label>s: don't jump to the input
    e.stopPropagation();
    closeTips(tip);
    tip.classList.toggle('open');
  });
  tip.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      tip.click();
    }
  });
  tip.addEventListener('mouseenter', () => closeTips(tip));
  tip.addEventListener('blur', () => tip.classList.remove('open'));
});
document.addEventListener('click', () => closeTips());
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeTips(); });

// Rebuild an open print preview in the new language
document.addEventListener('languagechange', () => {
  if (printModal.classList.contains('active')) setupPrintPreview();
});

// Ctrl+P without opening the preview first still prints the current pattern
window.addEventListener('beforeprint', () => {
  if (gridData.length && !printModal.classList.contains('active')) {
    setupPrintPreview();
  }
});

saveJsonBtn.addEventListener('click', () => {
  if (!gridData.length) {
    alert(t('nothingToSave'));
    return;
  }

  const exportData = {
    title: patternTitleInput.value.trim(),
    gridWidth,
    gridHeight,
    activePalette,
    gridData,
    timestamp: new Date().toISOString()
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `${patternTitleInput.value.trim() || 'pattern'}_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
});

loadJsonInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const importedData = JSON.parse(event.target.result);
      if (importedData.title) {
        patternTitleInput.value = importedData.title;
      }
      gridWidth = importedData.gridWidth;
      gridHeight = importedData.gridHeight;
      activePalette = importedData.activePalette;
      gridData = importedData.gridData;

      tileSizeInput.value = gridWidth;
      tileSizeVal.innerText = gridWidth;
      colorCountInput.value = activePalette.length;
      colorCountVal.innerText = activePalette.length;

      renderPattern();
      alert(t('loaded'));
    } catch (err) {
      alert(t('loadError'));
    }
  };
  reader.readAsText(file);
});