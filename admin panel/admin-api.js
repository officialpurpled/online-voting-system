// Mock admin API wrapper for development/demo
export async function getVoters({ page=1, limit=50 } = {}){
  // Return mock data for now; replace with real API call later
  const sample = [];
  for(let i=1;i<=25;i++){
    sample.push({ id:`S${1000+i}`, name:`Student ${i}`, email:`student${i}@school.edu`, status: i%7===0? 'suspended' : 'active' });
  }
  return Promise.resolve({ data: sample, total: sample.length });
}

export async function getElections(){
  return Promise.resolve([{ id:'E1', title:'Student Gov 2026', status:'active', starts:'2026-02-01' }]);
}

export async function getLogs(){
  const logs = [];
  for(let i=1;i<=10;i++) logs.push({ ts: Date.now()-i*100000, actor:`admin${i%3}`, action:'EXPORT', details:`Exported voters CSV` });
  return Promise.resolve({ data: logs });
}

export async function exportData(format='csv', items=[]){
  // For demo, resolve immediately — production should call server export endpoint
  return Promise.resolve({ ok:true, message:`Prepared ${items.length} items as ${format}` });
}
