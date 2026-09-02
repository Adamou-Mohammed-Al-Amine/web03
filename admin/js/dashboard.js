import { supabase } from './supabase-client.js';

/* ============================================================================
   AUTH GUARD — runs before anything else renders.
   ============================================================================ */
const { data: sessionData } = await supabase.auth.getSession();
if (!sessionData.session) {
  window.location.replace('/admin/login.html');
  throw new Error('redirecting to login'); // stop the rest of this module
}
supabase.auth.onAuthStateChange((event) => {
  if (event === 'SIGNED_OUT') window.location.replace('/admin/login.html');
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
  await supabase.auth.signOut();
});

/* ============================================================================
   STATE
   ============================================================================ */
const SECTIONS = {
  long_form: { label: 'Long Form', kind: 'video' },
  short_form: { label: 'Short Form', kind: 'video' },
  saas: { label: 'SaaS & Commercials', kind: 'video' },
  collaborations: { label: 'Collaborations', kind: 'collab' }
};

let allProjects = []; // every row, every section (admin sees everything)
let currentView = 'overview';
let currentSection = null;
let searchTerm = '';
let dragFromId = null;
let editingId = null; // null while adding, a project id while editing

/* ============================================================================
   DATA
   ============================================================================ */
async function loadAll() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('section', { ascending: true })
    .order('position', { ascending: true });
  if (error) { toast(error.message, true); return; }
  allProjects = data || [];
  renderCounts();
  if (currentView !== 'overview') renderSectionList();
}

function projectsFor(section) {
  return allProjects.filter(p => p.section === section);
}

/* ============================================================================
   NAVIGATION
   ============================================================================ */
document.querySelectorAll('.nav-item[data-view]').forEach(item => {
  item.addEventListener('click', () => switchView(item.dataset.view));
});

function switchView(view) {
  currentView = view;
  document.querySelectorAll('.nav-item[data-view]').forEach(el =>
    el.classList.toggle('is-active', el.dataset.view === view));

  const isOverview = view === 'overview';
  document.getElementById('view-overview').style.display = isOverview ? '' : 'none';
  document.getElementById('view-section').style.display = isOverview ? 'none' : '';

  if (!isOverview) {
    currentSection = view;
    searchTerm = '';
    document.getElementById('searchInput').value = '';
    document.getElementById('sectionTitle').textContent = SECTIONS[view].label;
    renderSectionList();
  }
  closeSidebarMobile();
}

/* ============================================================================
   MOBILE SIDEBAR
   ============================================================================ */
const sidebar = document.getElementById('sidebar');
const scrim = document.getElementById('scrim');
document.getElementById('menuBtn').addEventListener('click', () => {
  sidebar.classList.add('is-open'); scrim.classList.add('show');
});
scrim.addEventListener('click', closeSidebarMobile);
function closeSidebarMobile() {
  sidebar.classList.remove('is-open'); scrim.classList.remove('show');
}

/* ============================================================================
   OVERVIEW COUNTS
   ============================================================================ */
function renderCounts() {
  document.querySelector('[data-stat="total"]').textContent = allProjects.length;
  Object.keys(SECTIONS).forEach(section => {
    const n = projectsFor(section).length;
    const statEl = document.querySelector(`[data-stat="${section}"]`);
    if (statEl) statEl.textContent = n;
    const navEl = document.querySelector(`[data-count="${section}"]`);
    if (navEl) navEl.textContent = n;
  });
}

/* ============================================================================
   SECTION LIST — render, search, drag-reorder
   ============================================================================ */
document.getElementById('searchInput').addEventListener('input', (e) => {
  searchTerm = e.target.value.trim().toLowerCase();
  renderSectionList();
});

function matchesSearch(p) {
  if (!searchTerm) return true;
  const haystack = [p.title, p.category, p.handle, p.client].filter(Boolean).join(' ').toLowerCase();
  return haystack.includes(searchTerm);
}

function renderSectionList() {
  const listEl = document.getElementById('projectList');
  const items = projectsFor(currentSection).filter(matchesSearch);
  document.getElementById('listHint').textContent =
    `${items.length} project${items.length === 1 ? '' : 's'}`;

  if (items.length === 0) {
    listEl.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 12h8M12 8v8"/></svg>
        <p>${searchTerm ? 'No projects match your search.' : 'No projects yet — add your first one.'}</p>
      </div>`;
    return;
  }

  const kind = SECTIONS[currentSection].kind;
  listEl.innerHTML = items.map(p => renderRow(p, kind)).join('');

  // wire up row actions
  listEl.querySelectorAll('.project-row').forEach(row => {
    const id = row.dataset.id;
    const p = allProjects.find(x => x.id === id);

    row.querySelector('.icon-btn.edit').addEventListener('click', () => openForm(p));
    row.querySelector('.icon-btn.danger').addEventListener('click', () => openConfirm(id));
    row.querySelector('.visibility-toggle').addEventListener('click', () => toggleVisible(p));

    // drag & drop reorder (native HTML5 DnD — no extra dependency)
    row.addEventListener('dragstart', () => { dragFromId = id; row.classList.add('is-dragging'); });
    row.addEventListener('dragend', () => row.classList.remove('is-dragging'));
    row.addEventListener('dragover', (e) => { e.preventDefault(); row.classList.add('drag-over'); });
    row.addEventListener('dragleave', () => row.classList.remove('drag-over'));
    row.addEventListener('drop', (e) => {
      e.preventDefault();
      row.classList.remove('drag-over');
      if (dragFromId && dragFromId !== id) reorder(dragFromId, id);
    });
  });
}

function renderRow(p, kind) {
  const isCollab = kind === 'collab';
  const thumb = isCollab
    ? `<div class="row-thumb is-avatar"><img src="https://unavatar.io/${p.platform}/${p.handle}" alt="" onerror="this.style.opacity=0"></div>`
    : `<div class="row-thumb"><img src="${thumbUrl(p)}" alt="" onerror="this.style.opacity=0"></div>`;

  const title = isCollab ? (p.handle || 'Untitled') : (p.title || p.category || 'Untitled');
  const metaBits = isCollab
    ? [p.platform, p.ring === 1 ? 'Inner ring' : 'Outer ring']
    : [p.category, p.year, p.duration].filter(Boolean);

  return `
    <div class="project-row" draggable="true" data-id="${p.id}">
      <div class="drag-handle" title="Drag to reorder">
        <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>
      </div>
      ${thumb}
      <div class="row-body">
        <div class="row-title">${escapeHtml(title)}</div>
        <div class="row-meta">${metaBits.map(m => `<span class="tag">${escapeHtml(String(m))}</span>`).join('')}
          ${p.featured ? '<span class="tag" style="color:var(--gold)">★ Featured</span>' : ''}
        </div>
      </div>
      <div class="visibility-toggle ${p.visible ? 'is-on' : ''}" title="Toggle visibility"></div>
      <div class="row-actions">
        <button class="icon-btn edit" title="Edit">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        </button>
        <button class="icon-btn danger" title="Delete">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6"/></svg>
        </button>
      </div>
    </div>`;
}

function thumbUrl(p) {
  const id = youtubeId(p.video_url);
  if (p.thumbnail_url) return p.thumbnail_url;
  if (id) return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
  return '';
}

function youtubeId(url) {
  if (!url) return '';
  const m = url.match(/(?:v=|shorts\/|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : url;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ============================================================================
   REORDER — persists position for the whole section after a drop
   ============================================================================ */
async function reorder(fromId, toId) {
  const list = projectsFor(currentSection).filter(matchesSearch);
  const fromIdx = list.findIndex(p => p.id === fromId);
  const toIdx = list.findIndex(p => p.id === toId);
  if (fromIdx === -1 || toIdx === -1) return;

  const reordered = [...list];
  const [moved] = reordered.splice(fromIdx, 1);
  reordered.splice(toIdx, 0, moved);

  // optimistic UI update
  reordered.forEach((p, i) => { p.position = i; });
  renderSectionList();

  try {
    await Promise.all(reordered.map((p, i) =>
      supabase.from('projects').update({ position: i }).eq('id', p.id)
    ));
    toast('Order saved');
  } catch (err) {
    toast('Failed to save order — refreshing', true);
    await loadAll();
  }
}

/* ============================================================================
   VISIBILITY TOGGLE
   ============================================================================ */
async function toggleVisible(p) {
  const next = !p.visible;
  p.visible = next; // optimistic
  renderSectionList();
  const { error } = await supabase.from('projects').update({ visible: next }).eq('id', p.id);
  if (error) { p.visible = !next; renderSectionList(); toast(error.message, true); return; }
  toast(next ? 'Project published' : 'Project hidden');
}

/* ============================================================================
   ADD / EDIT MODAL
   ============================================================================ */
const formModal = document.getElementById('formModal');
const projectForm = document.getElementById('projectForm');
const formError = document.getElementById('formError');
const formSaveBtn = document.getElementById('formSave');

document.getElementById('addBtn').addEventListener('click', () => openForm(null));
document.getElementById('formClose').addEventListener('click', closeForm);
document.getElementById('formCancel').addEventListener('click', closeForm);
formModal.addEventListener('click', (e) => { if (e.target === formModal) closeForm(); });

// simple click-to-toggle switches (featured / visible in the form)
document.getElementById('f-featured-toggle').addEventListener('click', function () {
  this.classList.toggle('is-on');
});
document.getElementById('f-visible-toggle').addEventListener('click', function () {
  this.classList.toggle('is-on');
});

function openForm(project) {
  editingId = project ? project.id : null;
  formError.classList.remove('show');
  projectForm.reset();

  const kind = SECTIONS[currentSection].kind;
  document.getElementById('formTitle').textContent = project ? 'Edit Project' : 'Add Project';
  document.getElementById('f-section').value = currentSection;
  document.getElementById('fieldsVideo').style.display = kind === 'video' ? '' : 'none';
  document.getElementById('fieldsCollab').style.display = kind === 'collab' ? '' : 'none';
  document.getElementById('featuredRow').style.display = currentSection === 'long_form' ? '' : 'none';

  const featuredToggle = document.getElementById('f-featured-toggle');
  const visibleToggle = document.getElementById('f-visible-toggle');

  if (project) {
    document.getElementById('f-id').value = project.id;
    if (kind === 'video') {
      document.getElementById('f-video_url').value = project.video_url || '';
      document.getElementById('f-title').value = project.title || '';
      document.getElementById('f-category').value = project.category || '';
      document.getElementById('f-year').value = project.year || '';
      document.getElementById('f-duration').value = project.duration || '';
      document.getElementById('f-client').value = project.client || '';
      document.getElementById('f-description').value = project.description || '';
      featuredToggle.classList.toggle('is-on', !!project.featured);
    } else {
      document.getElementById('f-platform').value = project.platform || 'youtube';
      document.getElementById('f-handle').value = project.handle || '';
      document.getElementById('f-link_url').value = project.link_url || '';
      document.getElementById('f-ring').value = String(project.ring || 1);
    }
    visibleToggle.classList.toggle('is-on', project.visible !== false);
  } else {
    document.getElementById('f-id').value = '';
    featuredToggle.classList.remove('is-on');
    visibleToggle.classList.add('is-on');
  }

  formModal.classList.add('show');
}

function closeForm() {
  formModal.classList.remove('show');
  editingId = null;
}

let saving = false;
projectForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (saving) return; // guard against double submit
  formError.classList.remove('show');

  const section = document.getElementById('f-section').value;
  const kind = SECTIONS[section].kind;

  const payload = {
    section,
    visible: document.getElementById('f-visible-toggle').classList.contains('is-on')
  };

  if (kind === 'video') {
    payload.video_url = document.getElementById('f-video_url').value.trim() || null;
    payload.title = document.getElementById('f-title').value.trim() || null;
    payload.category = document.getElementById('f-category').value.trim() || null;
    payload.year = document.getElementById('f-year').value.trim() || null;
    payload.duration = document.getElementById('f-duration').value.trim() || null;
    payload.client = document.getElementById('f-client').value.trim() || null;
    payload.description = document.getElementById('f-description').value.trim() || null;
    payload.featured = section === 'long_form'
      ? document.getElementById('f-featured-toggle').classList.contains('is-on')
      : false;

    if (!payload.video_url) {
      formError.textContent = 'Video URL is required.';
      formError.classList.add('show');
      return;
    }
  } else {
    payload.platform = document.getElementById('f-platform').value;
    payload.handle = document.getElementById('f-handle').value.trim();
    payload.link_url = document.getElementById('f-link_url').value.trim() || null;
    payload.ring = Number(document.getElementById('f-ring').value);

    if (!payload.handle) {
      formError.textContent = 'Handle is required.';
      formError.classList.add('show');
      return;
    }
  }

  saving = true;
  formSaveBtn.disabled = true;
  formSaveBtn.innerHTML = '<span class="spinner"></span>';

  try {
    if (editingId) {
      const { error } = await supabase.from('projects').update(payload).eq('id', editingId);
      if (error) throw error;
      toast('Project updated');
    } else {
      // new rows go to the end of their section
      payload.position = projectsFor(section).length;
      const { error } = await supabase.from('projects').insert(payload);
      if (error) throw error;
      toast('Project added');
    }
    closeForm();
    await loadAll();
  } catch (err) {
    formError.textContent = err.message || 'Something went wrong.';
    formError.classList.add('show');
  } finally {
    saving = false;
    formSaveBtn.disabled = false;
    formSaveBtn.textContent = 'Save Project';
  }
});

/* ============================================================================
   DELETE CONFIRM
   ============================================================================ */
const confirmModal = document.getElementById('confirmModal');
let pendingDeleteId = null;

function openConfirm(id) {
  pendingDeleteId = id;
  confirmModal.classList.add('show');
}
function closeConfirm() {
  confirmModal.classList.remove('show');
  pendingDeleteId = null;
}
document.getElementById('confirmClose').addEventListener('click', closeConfirm);
document.getElementById('confirmCancel').addEventListener('click', closeConfirm);
confirmModal.addEventListener('click', (e) => { if (e.target === confirmModal) closeConfirm(); });

let deleting = false;
document.getElementById('confirmDelete').addEventListener('click', async () => {
  if (deleting || !pendingDeleteId) return;
  deleting = true;
  const btn = document.getElementById('confirmDelete');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>';

  const { error } = await supabase.from('projects').delete().eq('id', pendingDeleteId);

  deleting = false;
  btn.disabled = false;
  btn.textContent = 'Delete';

  if (error) { toast(error.message, true); return; }
  toast('Project deleted');
  closeConfirm();
  await loadAll();
});

/* ============================================================================
   TOAST
   ============================================================================ */
let toastTimer = null;
function toast(msg, isError) {
  const el = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  el.classList.toggle('error', !!isError);
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
}

/* ============================================================================
   INIT
   ============================================================================ */
loadAll();
