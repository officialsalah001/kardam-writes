(function () {
  const cfg = window.SUPABASE_CONFIG;
  if (!cfg || !cfg.url || !cfg.publishableKey || cfg.url.includes('YOUR-PROJECT')) {
    console.warn('Supabase is not configured. Copy supabase-config.example.js to supabase-config.js and add your public project values.');
    window.kardamSupabase = null;
    return;
  }
  if (!window.supabase) {
    console.error('Supabase library did not load.');
    window.kardamSupabase = null;
    return;
  }
  window.kardamSupabase = window.supabase.createClient(cfg.url, cfg.publishableKey);
})();
