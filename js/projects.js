/* ============================================================================
   projects.js — loads portfolio content from Supabase for the public site.

   Classic (non-module) script on purpose: main.js is a classic script too,
   and this keeps that architecture instead of forcing a module migration.
   It talks to Supabase's REST API directly with plain fetch() — no SDK
   needed for read-only, anon-key access.

   Safety net: if the fetch fails for any reason (offline, RLS misconfigured,
   Supabase down, section not seeded yet) every call falls back to the exact
   content that used to be hard-coded, so the site can never end up showing
   less than it did before the CMS existed.
   ============================================================================ */
(function(){
  const SUPABASE_URL = 'https://oixjigudwtretocgnmy.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_WgV6Id9JfuzFVsnPY70eEQ_1Gleh9EV';

  function youtubeId(url){
    if(!url)return '';
    if(!/^https?:\/\//i.test(url))return url; // already a bare id
    const m = url.match(/(?:v=|shorts\/|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
    return m ? m[1] : url;
  }

  async function fetchSection(section){
    const url = `${SUPABASE_URL}/rest/v1/projects?section=eq.${encodeURIComponent(section)}&visible=eq.true&order=position.asc`;
    const res = await fetch(url,{
      headers:{
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    if(!res.ok)throw new Error(`Supabase fetch failed: ${res.status}`);
    return res.json();
  }

  // ---- shape adapters: DB row -> the exact object shape main.js expects ----
  function toVideoShape(row){
    return {
      id: youtubeId(row.video_url),
      category: row.category||'',
      duration: row.duration||'',
      year: row.year||'',
      featured: !!row.featured,
      title: row.title||null // null = let main.js fetch the live YouTube title, same as before
    };
  }
  function toShortShape(row){
    return { id: youtubeId(row.video_url), date: row.year||'' };
  }
  function toCollabShape(row){
    return {
      platform: row.platform,
      handle: row.handle,
      link: row.link_url,
      ring: row.ring
    };
  }

  async function loadSection(section, adapter, fallback){
    try{
      const rows = await fetchSection(section);
      if(!Array.isArray(rows) || rows.length===0)return fallback;
      return rows.map(adapter);
    }catch(err){
      console.warn(`[projects.js] falling back to built-in data for "${section}":`, err.message);
      return fallback;
    }
  }

  // Exposed for main.js. Each returns a Promise<Array> and never rejects —
  // worst case it resolves to the fallback array below.
  window.CMS = {
    loadLongForm(fallback){ return loadSection('long_form', toVideoShape, fallback); },
    loadSaas(fallback){ return loadSection('saas', toVideoShape, fallback); },
    loadShorts(fallback){ return loadSection('short_form', toShortShape, fallback); },
    loadCollaborations(fallback){ return loadSection('collaborations', toCollabShape, fallback); }
  };
})();
