// If Supabase is connected, replace the starter cards with published articles.
(async function(){
  const sb=window.kardamSupabase;if(!sb)return;
  try{
    const {data,error}=await sb.from('articles').select('id,title,slug,excerpt,category_slug,image_url,views,created_at').eq('status','published').order('created_at',{ascending:false}).limit(30);
    if(error||!data||!data.length)return;
    const wrap=document.getElementById('cards');if(!wrap)return;
    wrap.innerHTML=data.map(a=>`<article data-cat="${esc(a.category_slug)}"><div class="pic p${(Math.abs(a.id)%6)+1}">${esc(a.category_slug).toUpperCase()}</div><div class="pad"><small>${label(a.category_slug)}</small><h3>${esc(a.title)}</h3><p>${esc(a.excerpt||'')}</p><a href="article.html?id=${encodeURIComponent(a.id)}" class="read">Read article →</a></div></article>`).join('');
    if(window.renderHomeCards)window.renderHomeCards();
  }catch(e){console.warn(e)}
  function esc(s=''){return String(s).replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]))}
  function label(s){return ({education:'Ilimi / Education',history:'Tarihi / History',lifestyle:'Rayuwa / Lifestyle',technology:'Fasaha / Technology',business:'Business / Kasuwanci'})[s]||s}
})();
