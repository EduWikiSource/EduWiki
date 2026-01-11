// =======================
// Add Article
// =======================
function addArticle() {
  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();
  const category = (document.getElementById("category").value || "General").trim();
  const accessType = document.getElementById("accessType").value;
  const author = localStorage.getItem("currentUser") || "Anonymous";

  if (!title || !content) {
    alert("Title and content are required!");
    return;
  }

  // Fetch fresh articles from localStorage
  const articles = JSON.parse(localStorage.getItem("articles")) || [];
  const article = { title, content, category, author, likes: 0, accessType };
  articles.push(article);
  localStorage.setItem("articles", JSON.stringify(articles));

  alert("✅ Article added successfully!");

  // Clear form
  document.getElementById("title").value = "";
  document.getElementById("content").value = "";
  document.getElementById("category").value = "General";
  document.getElementById("accessType").value = "free";

  // Reload articles if on view/search page
  if (window.location.href.includes("view.html")) filterArticles();
  else if (window.location.href.includes("search.html")) searchArticles();
}

// =======================
// Display Articles (Universal)
// =======================
function displayArticles(list, containerId) {
  const isPremiumUser = localStorage.getItem("premiumUser") === "true";
  let output = "";

  list.forEach(({ article, index }) => {
    let content = article.content;

    if (article.accessType === "premium" && !isPremiumUser)
      content = "🔒 Premium article. <button onclick='upgradePremium()'>Upgrade Now</button>";
    else if (article.accessType === "restricted" && !isPremiumUser)
      content = "🔒 Restricted article. <button onclick='upgradePremium()'>Upgrade Now</button>";

    const badge = `<span class="badge ${article.accessType}">${article.accessType.charAt(0).toUpperCase() + article.accessType.slice(1)}</span>`;

    output += `
      <div class="article-card">
        ${badge}
        <h3>${article.title}</h3>
        <p><b>Category:</b> ${article.category || "General"}</p>
        <p>${content}</p>
        <p class="article-meta"><b>Author:</b> ${article.author || "Anonymous"} | ❤️ Likes: ${article.likes || 0}</p>
        <button class="like-btn" onclick="likeArticle(${index}, '${containerId}')">❤️ Like</button>
      </div>
      <hr>
    `;
  });

  if (output === "") output = "<p>No articles found</p>";
  const container = document.getElementById(containerId);
  if (container) container.innerHTML = output;

  // Show ads only for free users
  const adBlock = document.getElementById("adBlock");
  if (adBlock) adBlock.style.display = isPremiumUser ? "none" : "block";
}

// =======================
// Like Article
// =======================
function likeArticle(index, containerId) {
  const articles = JSON.parse(localStorage.getItem("articles")) || [];
  if (!articles[index]) return;

  articles[index].likes = (articles[index].likes || 0) + 1;
  localStorage.setItem("articles", JSON.stringify(articles));

  // Refresh display
  if (containerId === "articles") filterArticles();
  else if (containerId === "result") searchArticles();
  else loadArticles();
}

// =======================
// Load All Articles (view.html)
// =======================
function loadArticles() {
  const articles = JSON.parse(localStorage.getItem("articles")) || [];
  const list = articles.map((article, index) => ({ article, index }));
  displayArticles(list, "articles");
}

// =======================
// Filter Articles (view.html)
// =======================
function filterArticles() {
  const articles = JSON.parse(localStorage.getItem("articles")) || [];
  const selected = (document.getElementById("filterCategory")?.value || "All").trim().toLowerCase();

  const filtered = articles
    .map((article, index) => ({ article, index }))
    .filter(({ article }) => selected === "all" || ((article.category || "General").trim().toLowerCase() === selected));

  displayArticles(filtered, "articles");
}

// =======================
// Search Articles (search.html)
// =======================
function searchArticles() {
  const articles = JSON.parse(localStorage.getItem("articles")) || [];
  const keyword = (document.getElementById("query")?.value || "").trim().toLowerCase();
  const categorySelected = (document.getElementById("categoryFilter")?.value || "All").trim().toLowerCase();

  const filtered = articles
    .map((article, index) => ({ article, index }))
    .filter(({ article }) => {
      const matchKeyword = article.title.toLowerCase().includes(keyword) || article.content.toLowerCase().includes(keyword);
      const matchCategory = categorySelected === "all" || ((article.category || "General").trim().toLowerCase() === categorySelected);
      return matchKeyword && matchCategory;
    });

  displayArticles(filtered, "result");
}

// =======================
// Upgrade to Premium
// =======================
function upgradePremium() {
  localStorage.setItem("premiumUser", "true");
  alert("🎉 You are now a Premium user!");

  if (window.location.href.includes("view.html")) filterArticles();
  else if (window.location.href.includes("search.html")) searchArticles();
  else loadArticles();
}