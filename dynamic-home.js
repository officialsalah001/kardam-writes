// Kardam Writes - Dynamic Homepage Articles
(async function () {
  const sb = window.kardamSupabase;
  if (!sb) return;

  try {
    const { data, error } = await sb
      .from("articles")
      .select("id,title,slug,excerpt,category_slug,image_url,views,created_at")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(30);

    if (error || !data || !data.length) return;

    const wrap = document.getElementById("cards");
    if (!wrap) return;

    wrap.innerHTML = data.map((a) => {
      const image = a.image_url
        ? `
          <img
            src="${esc(a.image_url)}"
            alt="${esc(a.title || "Article image")}"
            class="article-card-image"
            loading="lazy"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
          >
        `
        : "";

      return `
        <article data-cat="${esc(a.category_slug || "")}" class="article-card">

          <div class="pic">
            ${image}

            <div class="image-fallback">
              ${esc((a.category_slug || "ARTICLE").toUpperCase())}
            </div>
          </div>

          <div class="pad">
            <small>${label(a.category_slug)}</small>

            <h3>${esc(a.title || "Untitled Article")}</h3>

            <p>${esc(a.excerpt || "")}</p>

            <a
              href="article.html?id=${encodeURIComponent(a.id)}"
              class="read"
            >
              Read article →
            </a>
          </div>

        </article>
      `;
    }).join("");

    // Make sure the existing homepage layout still works
    if (window.renderHomeCards) {
      window.renderHomeCards();
    }

  } catch (e) {
    console.warn("Dynamic articles error:", e);
  }

  function esc(value = "") {
    return String(value).replace(/[&<>'"]/g, function (m) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;"
      }[m];
    });
  }

  function label(category) {
    return {
      education: "Ilimi / Education",
      history: "Tarihi / History",
      lifestyle: "Rayuwa / Lifestyle",
      technology: "Fasaha / Technology",
      business: "Business / Kasuwanci"
    }[category] || category || "Article";
  }
})();
