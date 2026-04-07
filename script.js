/* ===== Deciplan — script.js ===== */

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

/* ===== DONNÉES ===== */
const allData = [
  { "nom": "ENCG Casablanca",               "cat": "Commerce & Gestion", "ville": "Casablanca", "ouv": "2026-04-05", "clo": "2026-05-20", "lien": "https://encg-casa.ma",       "note": "Concours national commun ENCG" },
  { "nom": "ENCG Agadir",                   "cat": "Commerce & Gestion", "ville": "Agadir",     "ouv": "2026-04-05", "clo": "2026-05-20", "lien": "https://encg-agadir.ac.ma",  "note": "Concours national commun ENCG" },
  { "nom": "ENCG Fès",                      "cat": "Commerce & Gestion", "ville": "Fès",        "ouv": "2026-04-05", "clo": "2026-05-20", "lien": "https://encg-fes.ma",        "note": "Concours national commun ENCG" },
  { "nom": "ENCG Oujda",                    "cat": "Commerce & Gestion", "ville": "Oujda",      "ouv": "2026-04-05", "clo": "2026-05-20", "lien": "https://encg-oujda.ma",      "note": "Concours national commun ENCG" },
  { "nom": "ENCG Marrakech",                "cat": "Commerce & Gestion", "ville": "Marrakech",  "ouv": "2026-04-05", "clo": "2026-05-20", "lien": "https://encg-marrakech.ma",  "note": "Concours national commun ENCG" },
  { "nom": "ENCG Tanger",                   "cat": "Commerce & Gestion", "ville": "Tanger",     "ouv": "2026-04-05", "clo": "2026-05-20", "lien": "https://encg-tanger.ma",     "note": "Concours national commun ENCG" },
  { "nom": "IAV Hassan II",                 "cat": "Agronomie",          "ville": "Rabat",      "ouv": "2026-04-01", "clo": "2026-05-05", "lien": "https://iav.ac.ma",          "note": "Vétérinaire, Agronomie, Paysage" },
  { "nom": "École Nationale d'Architecture","cat": "Architecture",        "ville": "Rabat",      "ouv": "2026-05-01", "clo": "2026-06-15", "lien": "https://ena.ac.ma",          "note": "Dossier + épreuve plastique" },
  { "nom": "Faculté de Médecine Casablanca","cat": "Médecine & Santé",   "ville": "Casablanca", "ouv": "2026-06-01", "clo": "2026-07-15", "lien": "https://fmpc.ac.ma",         "note": "Concours PACES (septembre)" },
  { "nom": "Faculté de Médecine Rabat",     "cat": "Médecine & Santé",   "ville": "Rabat",      "ouv": "2026-06-01", "clo": "2026-07-15", "lien": "https://fmpr.ac.ma",         "note": "Concours PACES (septembre)" },
  { "nom": "Faculté de Médecine Fès",       "cat": "Médecine & Santé",   "ville": "Fès",        "ouv": "2026-06-01", "clo": "2026-07-15", "lien": "https://fmpm.ac.ma",         "note": "Concours PACES (septembre)" },
  { "nom": "Faculté de Médecine Marrakech", "cat": "Médecine & Santé",   "ville": "Marrakech",  "ouv": "2026-06-01", "clo": "2026-07-15", "lien": "https://fmpm.uca.ma",        "note": "Concours PACES (septembre)" },
  { "nom": "Sciences Po Maroc",             "cat": "Sciences Po",        "ville": "Rabat",      "ouv": "2026-04-20", "clo": "2026-06-10", "lien": "https://sciencespo.ma",      "note": "Dossier + entretien oral" },
  { "nom": "EST Casablanca",                "cat": "Technologie",        "ville": "Casablanca", "ouv": "2026-05-10", "clo": "2026-06-20", "lien": "https://estc.ma",            "note": "DUT - sur dossier bachelier" },
  { "nom": "EST Rabat",                     "cat": "Technologie",        "ville": "Rabat",      "ouv": "2026-05-10", "clo": "2026-06-20", "lien": "https://estr.ac.ma",         "note": "DUT - sur dossier bachelier" },
  { "nom": "EST Fès",                       "cat": "Technologie",        "ville": "Fès",        "ouv": "2026-05-10", "clo": "2026-06-20", "lien": "https://estf.ac.ma",         "note": "DUT - sur dossier bachelier" },
  { "nom": "EST Meknès",                    "cat": "Technologie",        "ville": "Meknès",     "ouv": "2026-05-10", "clo": "2026-06-20", "lien": "https://estm.ac.ma",         "note": "DUT - sur dossier bachelier" },
  { "nom": "CPGE — Prépas nationales",      "cat": "Prépa",              "ville": "National",   "ouv": "2026-05-15", "clo": "2026-07-01", "lien": "https://prepa.ma",           "note": "MPSI, PCSI, TSI, ECG, BCPST" },
  { "nom": "HEM Business School",           "cat": "Commerce & Gestion", "ville": "Casablanca", "ouv": "2026-04-01", "clo": "2026-06-30", "lien": "https://hem.ac.ma",          "note": "École privée — frais de scolarité" },
  { "nom": "IGA Casablanca",                "cat": "Commerce & Gestion", "ville": "Casablanca", "ouv": "2026-04-01", "clo": "2026-06-30", "lien": "https://iga.ac.ma",          "note": "École privée — commerce international" }
];

function parseDate(s) {
  if (!s) return null;
  const [y, m, d] = s.split('-');
  return new Date(+y, +m - 1, +d);
}

function fmt(s) {
  if (!s) return '—';
  return parseDate(s).toLocaleDateString('fr-MA', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function daysLeft(r) {
  const clo = parseDate(r.clo);
  return clo ? Math.round((clo - TODAY) / 86400000) : null;
}

function getStatus(r) {
  const ouv = parseDate(r.ouv), clo = parseDate(r.clo);
  if (!ouv || !clo)  return 'attente';
  if (TODAY < ouv)   return 'attente';
  if (TODAY > clo)   return 'ferme';
  return daysLeft(r) <= 14 ? 'bientot' : 'ouvert';
}

function render() {
  const search = document.getElementById('search').value.toLowerCase().trim();
  const cat    = document.getElementById('filter-cat').value;
  const status = document.getElementById('filter-status').value;

  let rows = allData.filter(r => {
    if (search && ![r.nom, r.cat, r.ville, r.note].some(v => v && v.toLowerCase().includes(search))) return false;
    if (cat    && r.cat !== cat)           return false;
    if (status && getStatus(r) !== status) return false;
    return true;
  });

  const order = { bientot: 0, ouvert: 1, attente: 2, ferme: 3 };
  rows.sort((a, b) => order[getStatus(a)] - order[getStatus(b)]);

  let open = 0, soon = 0, closed = 0;
  allData.forEach(r => {
    const s = getStatus(r);
    if (s === 'ouvert')       open++;
    else if (s === 'bientot') soon++;
    else if (s === 'ferme')   closed++;
  });
  document.getElementById('cnt-open').textContent   = open;
  document.getElementById('cnt-soon').textContent   = soon;
  document.getElementById('cnt-closed').textContent = closed;
  document.getElementById('cnt-total').textContent  = allData.length;

  const tbody = document.getElementById('tbody');
  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="8" class="empty">😔 Aucun résultat pour ces filtres.</td></tr>';
    return;
  }

  const badgeClass = { ouvert: 'b-open', bientot: 'b-soon', ferme: 'b-closed', attente: 'b-wait' };
  const badgeLabel = { ouvert: '✅ Ouvert', bientot: '⚠️ Bientôt', ferme: '❌ Fermé', attente: '🕐 En attente' };

  tbody.innerHTML = rows.map(r => {
    const st   = getStatus(r);
    const days = daysLeft(r);
    let cd = '<span class="countdown">—</span>';
    if (days !== null && st !== 'attente') {
      if (days < 0)        cd = '<span class="countdown">Expiré</span>';
      else if (days === 0) cd = '<span class="countdown urgent">Aujourd\'hui !</span>';
      else if (days <= 7)  cd = '<span class="countdown urgent">' + days + ' j restants</span>';
      else if (days <= 14) cd = '<span class="countdown warning">' + days + ' j restants</span>';
      else                 cd = '<span class="countdown ok">' + days + ' j restants</span>';
    }
    return '<tr>'
      + '<td><div class="school-name">' + r.nom + '</div><div class="school-note">' + (r.note || '') + '</div></td>'
      + '<td><span class="cat-pill">' + r.cat + '</span></td>'
      + '<td style="font-size:12px;color:#6b7280">📍 ' + r.ville + '</td>'
      + '<td style="font-size:12px;color:#6b7280">' + fmt(r.ouv) + '</td>'
      + '<td style="font-size:12px;color:#6b7280">' + fmt(r.clo) + '</td>'
      + '<td>' + cd + '</td>'
      + '<td><span class="badge ' + badgeClass[st] + '">' + badgeLabel[st] + '</span></td>'
      + '<td><a class="link-btn" href="' + r.lien + '" target="_blank" rel="noopener">🔗 Accéder</a></td>'
      + '</tr>';
  }).join('');
}

document.addEventListener('DOMContentLoaded', function() {
  render();
  document.getElementById('search').addEventListener('input', render);
  document.getElementById('filter-cat').addEventListener('change', render);
  document.getElementById('filter-status').addEventListener('change', render);
});
