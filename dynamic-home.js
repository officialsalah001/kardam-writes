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

    if (error) {
      console.error("Articles error:", error);
      return;
    }

    if (!data || !data.length) return;

    const wrap = document.getElementById("cards");

    if (!wrap) return;

    wrap.innerHTML = data.map(function (a) {

      const imageUrl = String(a.image_url || "").trim();

      const imagePart = imageUrl
        ? `
          <img
            src="${esc(imageUrl)}"
            alt="${esc(a.title || "Article image")}"
            loading="lazy"
            style="
              width:100%;
              height:150px;
              display:block;
              object-fit:cover;
              border:0;
              margin:0;
              padding:0;
            "
            onerror="this.style.display='none';this.parentElement.querySelector('.image-fallback').style.display='flex';"
          >
        `
        : "";

      return `
        <article
          data-cat="${esc(a.category_slug || "")}"
          class="article-card"
        >

          <div
            class="pic"
            style="
              height:150px;
              padding:0;
              overflow:hidden;
              position:relative;
              display:block;
            "
          >

            ${imagePart}

            <div
              class="image-fallback"
              style="
                ${imageUrl ? "display:none;" : "display:flex;"}
                width:100%;
                height:150px;
                align-items:flex-end;
                padding:15px;
                color:#fff;
                font-size:9px;
                letter-spacing:2px;
                background:linear-gradient(135deg,#14243f,#4c78a7);
              "
            >
              ${esc((a.category_slug || "ARTICLE").toUpperCase())}
            </div>

          </div>

          <div class="pad">

            <small>
              ${label(a.category_slug)}
            </small>

            <h3>
              ${esc(a.title || "Untitled Article")}
            </h3>

            <p>
              ${esc(a.excerpt || "")}
            </p>

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

    if (window.renderHomeCards) {
      window.renderHomeCards();
    }

  } catch (error) {
    console.error("Dynamic homepage error:", error);
  }

  function esc(value) {
    return String(value).replace(/[&<>'"]/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;"
      }[char];
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
