import { getVoters, exportData } from './admin-api.js';

let currentRole = 'super'; // demo role: 'super' | 'sub'
const sections = ['overview','voters','elections','results','logs','settings'];

document.addEventListener('DOMContentLoaded', async ()=>{
  wireNav();
  document.getElementById('adminRole').textContent = `Role: ${currentRole==='super'?'Super Admin':'Sub Admin'}`;

  // wire export buttons
  document.getElementById('exportBtn').addEventListener('click', ()=>exportTable('csv'));
  document.getElementById('exportJsonBtn').addEventListener('click', ()=>exportTable('json'));

  // load initial KPIs and voters
  const v = await getVoters();
  document.getElementById('kpiVoters').textContent = v.total;
  document.getElementById('kpiElections').textContent = '—';
  document.getElementById('kpiTurnout').textContent = '—';
  renderVoters(v.data);

  // search/filter
  document.getElementById('searchVoter').addEventListener('input', e=>filterVoters(e.target.value));
  document.getElementById('filterStatus').addEventListener('change', e=>filterVoters(document.getElementById('searchVoter').value));

  document.getElementById('selectAll').addEventListener('change', toggleSelectAll);
  document.getElementById('bulkExport').addEventListener('click', exportSelected);
});

function wireNav(){
  document.querySelectorAll('.admin-sidebar nav a').forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      document.querySelectorAll('.admin-sidebar nav a').forEach(x=>x.classList.remove('active'));
      a.classList.add('active');
      const target = a.getAttribute('href').substring(1);
      showSection(target);
    });
  });
}

function showSection(id){
  sections.forEach(s=>{
    const el = document.getElementById(s);
    if(!el) return;
    if(s===id){ el.hidden=false; } else { el.hidden=true; }
  });
}

let globalVoters = [];
function renderVoters(rows){
  globalVoters = rows;
  const tbody = document.querySelector('#votersTable tbody');
  tbody.innerHTML = '';
  rows.forEach((r, i)=>{
    const tr = document.createElement('tr');
    tr.tabIndex = 0;
    tr.innerHTML = `
      <td><input type="checkbox" class="row-check" data-index="${i}"></td>
      <td>${r.name}</td>
      <td>${r.email}</td>
      <td>${r.id}</td>
      <td>${r.status}</td>
      <td><button class="btn--primary" data-index="${i}" aria-label="View ${r.name}">View</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function filterVoters(query){
  query = (''+query).toLowerCase();
  const status = document.getElementById('filterStatus').value;
  const filtered = globalVoters.filter(v=>{
    const matchQuery = !query || v.name.toLowerCase().includes(query) || v.id.toLowerCase().includes(query) || v.email.toLowerCase().includes(query);
    const matchStatus = status==='all' || v.status===status;
    return matchQuery && matchStatus;
  });
  renderVoters(filtered);
}

function toggleSelectAll(e){
  const checks = document.querySelectorAll('.row-check');
  checks.forEach(c=>c.checked = e.target.checked);
}

function getSelectedRows(){
  const checks = Array.from(document.querySelectorAll('.row-check'));
  return checks.filter(c=>c.checked).map(c=> globalVoters[Number(c.dataset.index)] ).filter(Boolean);
}

async function exportSelected(){
  const items = getSelectedRows();
  if(items.length===0){ alert('No items selected'); return; }
  // Use client-side CSV download for demo; server export preferred.
  exportToCsv(items, `voters-selected.csv`);
}

function exportTable(format='csv'){
  // export all voters currently loaded in table
  const rows = globalVoters;
  if(format==='json'){
    const blob = new Blob([JSON.stringify(rows, null, 2)], {type:'application/json'});
    downloadBlob(blob, 'voters.json');
  }else{
    exportToCsv(rows, 'voters.csv');
  }
}

function exportToCsv(rows, filename='export.csv'){
  if(!rows || !rows.length) { alert('No data to export'); return; }
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(',')].concat(rows.map(r=>headers.map(h=>`"${(''+(r[h]||'')).replace(/"/g,'""')}"`).join(','))).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  downloadBlob(blob, filename);
}

function downloadBlob(blob, filename){
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=> URL.revokeObjectURL(url), 1000);
}

// Simple confirm modal utilities
export function openConfirm(message, onOk){
  const modal = document.getElementById('confirmModal');
  document.getElementById('confirmMessage').textContent = message;
  modal.setAttribute('aria-hidden','false');
  const ok = document.getElementById('confirmOk');
  const cancel = document.getElementById('confirmCancel');
  function cleanup(){ ok.removeEventListener('click', okHandler); cancel.removeEventListener('click', cancelHandler); modal.setAttribute('aria-hidden','true'); }
  function okHandler(){ cleanup(); onOk && onOk(); }
  function cancelHandler(){ cleanup(); }
  ok.addEventListener('click', okHandler);
  cancel.addEventListener('click', cancelHandler);
}
