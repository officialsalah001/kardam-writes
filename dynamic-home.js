(function () {
  const sb = window.kardamSupabase;

  const cards = document.getElementById("cards");
  const none = document.getElementById("none");

  if (!cards) return;

  if (!sb) {
    console.error("Kardam Writes: Supabase connection not available.");
    return;
  }

  function esc(value) {
    return String(value ?? "").replace(/[&<>'"]/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;"
      }[char];
    });
  }

  function getCategoryLabel(category) {
    const labels = {
      news: "📰 News / Labarai",
      politics: "🏛️ Politics / Siyasa",
      sports: "⚽ Sports / Wasanni",
      education: "📚 Ilimi / Education",
      history: "📜 Tarihi / History",
      lifestyle: "🌍 Rayuwa / Lifestyle",
      technology: "💻 Fasaha / Technology",
      business: "💼 Business / Kasuwanci",
      opinion: "💭 Opinion / Ra'ayi"
    };

    return labels[category] || category || "Article";
  }

  function imageHTML(article) {
    const image = String(article.image_url || "").trim();

    if (!image) {
      return `
        <div class="dynamic-placeholder">
          <span>${esc(
            String(article.category_slug || "ARTICLE").toUpperCase()
          )}</span>
        </div>
      `;
    }

    return `
      <img
        class="dynamic-article-image"
        src="${esc(image)}"
        alt="${esc(article.title || "Article image")}"
        loading="lazy"
        onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
      >

      <div class="dynamic-image-fallback">
        <span>${esc(
          String(article.category_slug || "ARTICLE").toUpperCase()
        )}</span>
      </div>
    `;
  }

  function renderArticles(data) {
    if (!data || !data.length) {
      cards.innerHTML = "";
      
      if (none) {
        none.hidden = false;
        none.textContent = "No published articles found.";
      }

      return;
    }

    if (none) {
      none.hidden = true;
    }

    cards.innerHTML = data.map(function (article) {
      const category = String(
        article.category_slug || ""
      ).toLowerCase().trim();

      return `
        <article
          data-cat="${esc(category)}"
          class="article-card"
        >

          <div class="pic dynamic-pic">
            ${imageHTML(article)}

            <div class="dynamic-image-fallback">
              <span>${esc(
                String(category || "ARTICLE").toUpperCase()
              )}</span>
            </div>
          </div>

          <div class="pad">

            <small>
              ${esc(getCategoryLabel(category))}
            </small>

            <h3>
              ${esc(article.title || "Untitled Article")}
            </h3>

            <p>
              ${esc(article.excerpt || "")}
            </p>

            <a
              href="article.html?id=${encodeURIComponent(article.id)}"
              class="read"
            >
              Read article →
            </a>

          </div>

        </article>
      `;
    }).join("");

    if (window.renderHomeCards) {
      window.renderHomeCards();
    }
  }

  async function loadArticles() {
    try {
      const result = await sb
        .from("articles")
        .select(`
          id,
          title,
          slug,
          excerpt,
          category_slug,
          image_url,
          views,
          created_at
        `)
        .eq("status", "published")
        .order("created_at", {
          ascending: false
        })
        .limit(50);

      if (result.error) {
        console.error(
          "Kardam Writes article loading error:",
          result.error
        );

        return;
      }

      renderArticles(result.data || []);

    } catch (error) {
      console.error(
        "Kardam Writes homepage error:",
        error
      );
    }
  }

  loadArticles();

})();
