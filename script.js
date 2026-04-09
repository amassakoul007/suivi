/* ===== Deciplan — script.js ===== */

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

let allData = [];

/* ── Utilitaires date ── */
function parseDate(s) {
  if (!s) return null;
  const [y, m, d] = s.split('-');
  return new Date(+y, +m - 1, +d);
}

function fmt(s) {
  if (!s) return null;
  return parseDate(s).toLocaleDateString('fr-MA', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
}

function daysLeft(r) {
  const clo = parseDate(r.clo);
  return clo ? Math.round((clo - TODAY) / 86400000) : null;
}

function getStatus(r) {
  const ouv = parseDate(r.ouv);
  const clo = parseDate(r.clo);
  if (!ouv && !clo) return 'attente';
  if (clo && TODAY > clo) return 'ferme';
  if (ouv && TODAY < ouv) return 'attente';
  const dl = daysLeft(r);
  return (dl !== null && dl <= 7) ? 'bientot' : 'ouvert';
}

/* ── Villes ── */
function fmtVillesAll(r) {
  if (Array.isArray(r.villes)) return r.villes.join(', ');
  return r.ville || '—';
}

function fmtVillesShort(r) {
  const arr = Array.isArray(r.villes) ? r.villes : (r.ville ? [r.ville] : ['—']);
  if (arr.length <= 2) return arr.join(', ');
  return arr[0] + ', ' + arr[1] + ' <span class="more-cities">+' + (arr.length - 2) + '</span>';
}

/* ── Catégories dynamiques ── */
function buildCatFilter() {
  const cats = [...new Set(allData.map(r => r.cat))].sort();
  const sel = document.getElementById('filter-cat');
  sel.innerHTML = '<option value="">Toutes les filières</option>';
  cats.forEach(c => {
    const o = document.createElement('option');
    o.value = o.textContent = c;
    sel.appendChild(o);
  });
}

/* ── Render ── */
function render() {
  const search = document.getElementById('search').value.toLowerCase().trim();
  const cat    = document.getElementById('filter-cat').value;
  const status = document.getElementById('filter-status').value;

  let rows = allData.filter(r => {
    if (search) {
      const haystack = [
        r.nom, r.cat,
        fmtVillesAll(r),
        r.note     || '',
        r.modalite || '',
        r.concours || ''
      ].join(' ').toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    if (cat    && r.cat !== cat)           return false;
    if (status && getStatus(r) !== status) return false;
    return true;
  });

  /* Tri : bientôt > ouvert > attente > fermé */
  const order = { bientot: 0, ouvert: 1, attente: 2, ferme: 3 };
  rows.sort((a, b) => order[getStatus(a)] - order[getStatus(b)]);

  /* Compteurs */
  let cntOpen = 0, cntSoon = 0, cntClosed = 0;
  allData.forEach(r => {
    const s = getStatus(r);
    if      (s === 'bientot') { cntOpen++; cntSoon++; }
    else if (s === 'ouvert')  { cntOpen++; }
    else if (s === 'ferme')   { cntClosed++; }
  });
  document.getElementById('cnt-open').textContent   = cntOpen;
  document.getElementById('cnt-soon').textContent   = cntSoon;
  document.getElementById('cnt-closed').textContent = cntClosed;
  document.getElementById('cnt-total').textContent  = allData.length;

  const tbody = document.getElementById('tbody');

  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="9" class="empty">😔 Aucun résultat pour ces filtres.</td></tr>';
    return;
  }

  const badgeClass = {
    ouvert:  'b-open',
    bientot: 'b-soon',
    ferme:   'b-closed',
    attente: 'b-wait'
  };
  const badgeLabel = {
    ouvert:  '✅ Ouvert',
    bientot: '⚠️ Bientôt',
    ferme:   '❌ Fermé',
    attente: '🕐 En attente'
  };

  tbody.innerHTML = rows.map(r => {
    const st   = getStatus(r);
    const days = daysLeft(r);

    /* Col 1 — Établissement */
    const noteDiv = r.note ? `<div class="school-note">${r.note}</div>` : '';
    const col1 = `<td class="col-nom"><div class="school-name">${r.nom}</div>${noteDiv}</td>`;

    /* Col 2 — Filière */
    const col2 = `<td class="col-cat"><span class="cat-pill">${r.cat}</span></td>`;

    /* Col 3 — Ville(s) */
    const villeAll   = fmtVillesAll(r);
    const villeShort = fmtVillesShort(r);
    const col3 = `<td class="col-ville" title="${villeAll}">📍 ${villeShort}</td>`;

    /* Col 4 — Statut */
    const col4 = `<td class="col-statut"><span class="badge ${badgeClass[st]}">${badgeLabel[st]}</span></td>`;

    /* Col 5 — Période ouv → clô */
    const ouvFmt = fmt(r.ouv);
    const cloFmt = fmt(r.clo);
    let periodeHtml;
    if (!ouvFmt && !cloFmt) {
      periodeHtml = '<span class="date-empty">—</span>';
    } else if (!ouvFmt) {
      periodeHtml = `<span class="date-label">Jusqu'au</span><br><span class="date-clo">${cloFmt}</span>`;
    } else {
      periodeHtml = `<span class="date-ouv">${ouvFmt}</span>`
                  + `<span class="date-arrow">→</span>`
                  + `<span class="date-clo">${cloFmt || '?'}</span>`;
    }
    const col5 = `<td class="col-periode">${periodeHtml}</td>`;

    /* Col 6 — Délai */
    let cd = '<span class="countdown">—</span>';
    if (days !== null) {
      if      (days < 0)   cd = '<span class="countdown expired">Expiré</span>';
      else if (days === 0) cd = '<span class="countdown urgent">Aujourd\'hui !</span>';
      else if (days <= 5)  cd = `<span class="countdown urgent">${days} j</span>`;
      else if (days <= 7) cd = `<span class="countdown warning">${days} j</span>`;
      else                 cd = `<span class="countdown ok">${days} j</span>`;
    }
    const col6 = `<td class="col-delai">${cd}</td>`;

    /* Col 7 — Modalité */
    const modalHtml = r.modalite
      ? `<span class="modal-tag">🎯 ${r.modalite}</span>`
      : '<span class="date-empty">—</span>';
    const col7 = `<td class="col-modal">${modalHtml}</td>`;

    /* Col 8 — Date concours */
    const concoursHtml = r.concours
      ? `<span class="concours-tag">📅 ${r.concours}</span>`
      : '<span class="date-empty">—</span>';
    const col8 = `<td class="col-concours">${concoursHtml}</td>`;

    /* Col 9 — Lien */
    const lienHtml = r.lien
      ? `<a class="link-btn" href="${r.lien}" target="_blank" rel="noopener">🔗 Voir</a>`
      : '<span class="link-btn disabled">—</span>';
    const col9 = `<td class="col-lien">${lienHtml}</td>`;

    return `<tr>${col1}${col2}${col3}${col4}${col5}${col6}${col7}${col8}${col9}</tr>`;
  }).join('');
}

/* ── Chargement JSON externe ── */
document.addEventListener('DOMContentLoaded', () => {
  fetch('ecoles_complet.json')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      allData = data;
      buildCatFilter();
      render();
    })
    .catch(err => {
      console.error('Erreur chargement JSON :', err);
      document.getElementById('tbody').innerHTML =
        `<tr><td colspan="9" class="empty">
          ⚠️ Impossible de charger <strong>ecoles_complet.json</strong>.<br>
          Vérifiez que le fichier est dans le même dossier que index.html.
        </td></tr>`;
    });

  document.getElementById('search').addEventListener('input', render);
  document.getElementById('filter-cat').addEventListener('change', render);
  document.getElementById('filter-status').addEventListener('change', render);
});
