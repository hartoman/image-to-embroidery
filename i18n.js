// UI translations. Greek is the default; the choice is remembered per browser.
// In the HTML: data-i18n = text, data-i18n-placeholder / data-i18n-alt = attributes,
// data-i18n-tip = tooltip text (shown by CSS from the data-tip attribute).
const TRANSLATIONS = {
  el: {
    pageTitle: 'Γεννήτρια Μοτίβων Κεντήματος DMC',
    appTitle: 'Γεννήτρια Μοτίβων Κεντήματος DMC',
    nameLabel: 'Όνομα Κεντήματος:',
    namePlaceholder: 'Εισάγετε όνομα...',
    defaultName: 'Μοτίβο Κεντήματος',
    chooseImage: 'Επιλογή Εικόνας',
    gridSize: 'Μέγεθος Πλέγματος (Πλακίδια):',
    colorCount: 'Αριθμός Χρωμάτων:',
    brightness: 'Φωτεινότητα:',
    contrast: 'Αντίθεση:',
    zoom: 'Μεγέθυνση Μοτίβου:',
    fit: 'Προσαρμογή',
    printMin: 'Εκτύπωση A4 – ελάχιστο τετράγωνο:',
    optSingle: 'Πάντα σε μία σελίδα',
    opt2: '2 mm (λιγότερες σελίδες)',
    opt25: '2.5 mm',
    opt3: '3 mm',
    opt4: '4 mm (μεγάλα τετράγωνα)',
    projectFiles: 'Αρχείο Έργου (JSON):',
    saveJson: 'Αποθήκευση JSON',
    loadJson: 'Φόρτωση JSON',
    openPrint: 'Προεπισκόπηση & Εκτύπωση PDF',
    origTitle: 'Αρχική Εικόνα',
    origAlt: 'Προεπισκόπηση Αρχικής Εικόνας',
    origPlaceholder: 'Παρακαλώ επιλέξτε μια εικόνα',
    patternTitle: 'Μοτίβο Κεντήματος',
    doPrint: 'Εκτύπωση σε PDF',
    close: 'Κλείσιμο',
    legendTitle: 'Υπόμνημα Χρωμάτων',
    dims: (w, h, n) => `Διαστάσεις: ${w} x ${h} βελονιές · ${n} χρώματα`,
    overviewPage: (total) => `Σελίδα 1 / ${total} · Επισκόπηση`,
    page: (n, total) => `Σελίδα ${n} / ${total}`,
    sectionRange: (c1, c2, r1, r2) => `Στήλες ${c1}–${c2} · Σειρές ${r1}–${r2}`,
    needImage: 'Παρακαλώ φορτώστε μια εικόνα πρώτα.',
    nothingToSave: 'Δεν υπάρχει μοτίβο για αποθήκευση.',
    loaded: 'Το μοτίβο φορτώθηκε με επιτυχία!',
    loadError: 'Σφάλμα κατά τη φόρτωση του αρχείου JSON.',

    tipName: 'Ο τίτλος που θα τυπωθεί στην κορυφή κάθε σελίδας και θα χρησιμοποιηθεί ως όνομα αρχείου κατά την αποθήκευση.',
    tipImage: 'Επιλέξτε μια φωτογραφία ή εικόνα από τον υπολογιστή σας. Μετατρέπεται αμέσως σε μοτίβο με χρώματα κλωστών DMC.',
    tipGrid: 'Πόσα τετράγωνα (βελονιές) θα έχει το μοτίβο σε πλάτος. Περισσότερα = περισσότερη λεπτομέρεια, αλλά μεγαλύτερο και πιο χρονοβόρο κέντημα.',
    tipColors: 'Ο μέγιστος αριθμός διαφορετικών χρωμάτων κλωστής. Λιγότερα χρώματα = πιο απλό κέντημα και λιγότερες κλωστές για αγορά.',
    tipBrightness: 'Κάνει την εικόνα πιο φωτεινή ή πιο σκούρα πριν επιλεγούν τα χρώματα.',
    tipContrast: 'Αυξάνει ή μειώνει τη διαφορά ανάμεσα στα ανοιχτά και τα σκούρα σημεία, ώστε οι λεπτομέρειες να ξεχωρίζουν περισσότερο ή λιγότερο.',
    tipZoom: 'Αλλάζει μόνο την προβολή στην οθόνη, όχι την εκτύπωση. Στο 100% όλο το μοτίβο χωράει δίπλα στην αρχική εικόνα· μεγαλώστε για να δείτε τους αριθμούς. Το «Προσαρμογή» επιστρέφει στο 100%.',
    tipPrintMin: 'Η εκτύπωση γίνεται σε A4 και προσαρμόζεται αυτόματα. Αν το μοτίβο χωράει με τετράγωνα τουλάχιστον τόσο μεγάλα, βγαίνει σε μία σελίδα. Αλλιώς χωρίζεται αυτόματα σε πολλές σελίδες: η 1η δείχνει όλο το σχέδιο με το υπόμνημα και αριθμημένα πλαίσια, και οι υπόλοιπες τα κομμάτια σε μέγεθος που διαβάζεται εύκολα.',
    tipJson: 'Το αρχείο JSON είναι σαν «αποθήκευση παιχνιδιού» για το μοτίβο σας: κρατά το όνομα, τα χρώματα και κάθε βελονιά σε ένα μικρό αρχείο στον υπολογιστή σας. Δεν είναι εικόνα και δεν χρειάζεται να το ανοίξετε μόνοι σας — απλώς πατήστε «Φόρτωση JSON» αργότερα για να συνεχίσετε ακριβώς από εκεί που μείνατε ή για να το ξανατυπώσετε. (Η αρχική φωτογραφία δεν αποθηκεύεται.)',
    tipPrint: 'Ανοίγει προεπισκόπηση των σελίδων A4. Τα μεγάλα μοτίβα χωρίζονται αυτόματα σε πολλές σελίδες, με αριθμούς στηλών/σειρών για να ενώνονται εύκολα. Στο παράθυρο εκτύπωσης επιλέξτε «Αποθήκευση ως PDF». Για μεγαλύτερο χαρτί (π.χ. A2), εκτυπώστε το A4 με «Προσαρμογή στη σελίδα».'
  },
  en: {
    pageTitle: 'DMC Embroidery Pattern Generator',
    appTitle: 'DMC Embroidery Pattern Generator',
    nameLabel: 'Pattern Name:',
    namePlaceholder: 'Enter a name...',
    defaultName: 'Embroidery Pattern',
    chooseImage: 'Choose Image',
    gridSize: 'Grid Size (Stitches):',
    colorCount: 'Number of Colours:',
    brightness: 'Brightness:',
    contrast: 'Contrast:',
    zoom: 'Pattern Zoom:',
    fit: 'Fit',
    printMin: 'A4 printing – minimum square:',
    optSingle: 'Always one page',
    opt2: '2 mm (fewer pages)',
    opt25: '2.5 mm',
    opt3: '3 mm',
    opt4: '4 mm (large squares)',
    projectFiles: 'Project File (JSON):',
    saveJson: 'Save JSON',
    loadJson: 'Load JSON',
    openPrint: 'Preview & Print PDF',
    origTitle: 'Original Image',
    origAlt: 'Original image preview',
    origPlaceholder: 'Please choose an image',
    patternTitle: 'Embroidery Pattern',
    doPrint: 'Print to PDF',
    close: 'Close',
    legendTitle: 'Colour Key',
    dims: (w, h, n) => `Size: ${w} x ${h} stitches · ${n} colours`,
    overviewPage: (total) => `Page 1 / ${total} · Overview`,
    page: (n, total) => `Page ${n} / ${total}`,
    sectionRange: (c1, c2, r1, r2) => `Columns ${c1}–${c2} · Rows ${r1}–${r2}`,
    needImage: 'Please load an image first.',
    nothingToSave: 'There is no pattern to save.',
    loaded: 'Pattern loaded successfully!',
    loadError: 'Error loading the JSON file.',

    tipName: 'The title printed at the top of every page, also used as the file name when saving.',
    tipImage: 'Pick a photo or picture from your computer. It is turned into a pattern with DMC thread colours straight away.',
    tipGrid: 'How many squares (stitches) wide the pattern is. More = more detail, but a bigger, longer piece of embroidery.',
    tipColors: 'The maximum number of different thread colours. Fewer colours = a simpler piece and fewer threads to buy.',
    tipBrightness: 'Makes the picture lighter or darker before the colours are chosen.',
    tipContrast: 'Increases or reduces the difference between light and dark areas, so details stand out more or less.',
    tipZoom: 'Only changes the on-screen view, not the printout. At 100% the whole pattern fits next to the original image; zoom in to read the numbers. "Fit" returns to 100%.',
    tipPrintMin: 'Printing is on A4 and adjusts automatically. If the pattern fits with squares at least this big, it prints on one page. Otherwise it is split automatically across several pages: page 1 shows the whole design with the colour key and numbered outlines, and the rest show each part at an easy-to-read size.',
    tipJson: 'A JSON file is like a "save game" for your pattern: it keeps the name, the colours and every stitch in a small file on your computer. It is not a picture and you never need to open it yourself — just press "Load JSON" later to carry on exactly where you left off, or to print it again. (The original photo is not saved.)',
    tipPrint: 'Opens a preview of the A4 pages. Large patterns are split across several pages automatically, with column/row numbers so they join up easily. In the print window choose "Save as PDF". For bigger paper (e.g. A2), print the A4 with "Fit to page".'
  }
};

let currentLang = 'el';
try {
  const saved = localStorage.getItem('lang');
  if (saved && TRANSLATIONS[saved]) currentLang = saved;
} catch (e) { /* storage unavailable: stay on Greek */ }

function t(key, ...args) {
  const value = TRANSLATIONS[currentLang][key] ?? TRANSLATIONS.el[key];
  return typeof value === 'function' ? value(...args) : value;
}

function applyTranslations() {
  document.documentElement.lang = currentLang;
  document.title = t('pageTitle');
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
  document.querySelectorAll('[data-i18n-alt]').forEach(el => { el.alt = t(el.dataset.i18nAlt); });
  document.querySelectorAll('[data-i18n-tip]').forEach(el => {
    el.dataset.tip = t(el.dataset.i18nTip);
    el.setAttribute('aria-label', el.dataset.tip);
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.setAttribute('aria-pressed', btn.dataset.lang === currentLang);
  });
}

function setLanguage(lang) {
  if (!TRANSLATIONS[lang] || lang === currentLang) return;
  const nameInput = document.getElementById('patternTitleInput');
  // Swap the default pattern name too, unless the user typed their own
  const oldDefault = t('defaultName');
  currentLang = lang;
  if (nameInput && nameInput.value.trim() === oldDefault) nameInput.value = t('defaultName');
  try { localStorage.setItem('lang', lang); } catch (e) { /* ignore */ }
  applyTranslations();
  document.dispatchEvent(new CustomEvent('languagechange'));
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
});
if (currentLang !== 'el') {
  const nameInput = document.getElementById('patternTitleInput');
  if (nameInput && nameInput.value === TRANSLATIONS.el.defaultName) nameInput.value = t('defaultName');
}
applyTranslations();
