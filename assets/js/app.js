(function () {
  "use strict";
  const Core = window.LostFoundCore;
  const STORAGE_KEY = "shiguang-campus-items-v1";
  const ICONS = { 校园卡: "🪪", 数码: "🎧", 雨具: "☂️", 钥匙: "🔑", 书籍: "📚", 其他: "📦" };
  const seedItems = [
    { id: "seed-1", type: "found", title: "拾到一张校园卡", category: "校园卡", date: "2026-09-26", location: "第一教学楼 302", description: "下课后在第三排座位旁发现，请失主联系时说明姓名和学号后四位。", contact: "13800138000", status: "等待认领", mine: false, createdAt: 1790437800000 },
    { id: "seed-2", type: "lost", title: "寻找白色蓝牙耳机", category: "数码", date: "2026-09-25", location: "图书馆二楼", description: "白色充电盒，右侧有一枚蓝色贴纸，可能遗落在靠窗自习区。", contact: "student@example.com", status: "寻找中", mine: true, createdAt: 1790355900000 },
    { id: "seed-3", type: "found", title: "蓝色折叠雨伞待认领", category: "雨具", date: "2026-09-24", location: "博学楼 A 区", description: "深蓝色八骨折叠伞，伞柄系有白色挂绳。", contact: "13900139000", status: "等待认领", mine: true, createdAt: 1790266800000 },
    { id: "seed-4", type: "lost", title: "寻找蓝色校园卡套", category: "校园卡", date: "2026-09-23", location: "运动场", description: "蓝色透明卡套，挂有一个小熊钥匙扣。", contact: "lost@example.com", status: "已找到", mine: false, createdAt: 1790180400000 },
    { id: "seed-5", type: "found", title: "教学楼门口捡到钥匙", category: "钥匙", date: "2026-09-22", location: "至诚楼门口", description: "两把钥匙和一枚绿色门禁扣，放在保安室。", contact: "13700137000", status: "已归还", mine: false, createdAt: 1790094000000 }
  ];

  const view = document.getElementById("view");
  const toast = document.getElementById("toast");
  const backButton = document.getElementById("backButton");
  const resetButton = document.getElementById("resetButton");
  let items = loadItems();

  function loadItems() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(saved) && saved.length ? saved : seedItems.slice();
    } catch (_) { return seedItems.slice(); }
  }
  function saveItems() { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }
  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
  }
  function showToast(message) {
    toast.textContent = message; toast.classList.add("show");
    clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove("show"), 2100);
  }
  function routeParts() {
    const raw = location.hash.slice(1) || "home";
    const [page, query = ""] = raw.split("?");
    return { page, params: new URLSearchParams(query) };
  }
  function go(hash) { location.hash = hash; }
  function setNav(page) {
    document.querySelectorAll("[data-nav]").forEach((node) => node.classList.toggle("active", node.dataset.nav === page));
    backButton.classList.toggle("hidden", ["home", "search", "publish", "mine"].includes(page));
  }
  function itemCard(item) {
    const done = Core.isCompleted(item);
    return `<article class="item-card ${done ? "completed" : ""}" data-id="${escapeHtml(item.id)}" tabindex="0" role="link">
      <div class="item-icon ${item.type}">${ICONS[item.category] || "📦"}</div>
      <div class="item-copy"><div class="item-topline"><span class="type-badge ${item.type}">${item.type === "lost" ? "寻物" : "招领"}</span><span class="status-badge">${escapeHtml(item.status)}</span></div>
      <h3>${escapeHtml(item.title)}</h3><p>⌖ ${escapeHtml(item.location)} · ${escapeHtml(item.date)}</p><small>${escapeHtml(item.description)}</small></div><span class="chevron">›</span>
    </article>`;
  }
  function bindCards() {
    document.querySelectorAll(".item-card").forEach((card) => {
      const open = () => go(`detail?id=${encodeURIComponent(card.dataset.id)}`);
      card.addEventListener("click", open);
      card.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") open(); });
    });
  }
  function filterChips(active) {
    return `<div class="chips" aria-label="信息类型筛选">${[["all","全部"],["lost","寻物"],["found","招领"]].map(([value,label]) => `<button type="button" data-type="${value}" class="chip ${active === value ? "active" : ""}">${label}</button>`).join("")}</div>`;
  }
  function statusChips(active) {
    return `<div class="chips status-chips" aria-label="信息状态筛选">${[["active","进行中"],["done","已完成"],["all","全部状态"]].map(([value,label]) => `<button type="button" data-status="${value}" class="chip ${active === value ? "active" : ""}">${label}</button>`).join("")}</div>`;
  }
  function emptyState(title, text) { return `<div class="empty-state"><div>🔎</div><h3>${title}</h3><p>${text}</p></div>`; }

  function renderHome() {
    setNav("home");
    const activeItems = Core.filterItems(items, { status: "active" }).sort((a,b)=>b.createdAt-a.createdAt);
    view.innerHTML = `<div class="hero"><button class="search-entry" id="homeSearch" type="button">⌕ <span>搜索校园卡、雨伞、钥匙……</span><kbd>搜索</kbd></button>
      <span class="eyebrow">下午好，同学 👋</span><h1>今天想找什么？</h1><p>集中发布、快速搜索，别让重要线索被群聊淹没。</p>
      <div class="quick-actions"><button class="action-card lost" data-go="publish?type=lost"><span>我丢东西了</span><strong>发布寻物启事 →</strong></button><button class="action-card found" data-go="publish?type=found"><span>我捡到东西</span><strong>发布招领信息 →</strong></button></div></div>
      <div class="section-heading"><div><span class="eyebrow">校园寻物</span><div class="section-title-row"><h2>最新信息</h2><span class="result-count" id="homeCount">共 ${activeItems.length} 条</span></div></div></div>
      <div id="homeFilters">${filterChips("all")}</div><div class="card-list" id="homeList">${activeItems.length ? activeItems.map(itemCard).join("") : emptyState("暂时没有进行中的信息", "可以发布一条新的寻物或招领信息。")}</div>
      <a class="history-link" href="#completed">查看已完成信息 <span>›</span></a>`;
    document.getElementById("homeSearch").onclick = () => go("search");
    document.querySelectorAll("[data-go]").forEach((button) => button.onclick = () => go(button.dataset.go));
    document.querySelectorAll("#homeFilters [data-type]").forEach((button) => button.onclick = () => {
      const filtered = Core.filterItems(items, { type: button.dataset.type, status: "active" }).sort((a,b)=>b.createdAt-a.createdAt);
      document.getElementById("homeFilters").innerHTML = filterChips(button.dataset.type);
      document.getElementById("homeCount").textContent = `共 ${filtered.length} 条`;
      document.getElementById("homeList").innerHTML = filtered.length ? filtered.map(itemCard).join("") : emptyState("暂时没有这类信息", "换一个分类看看吧。");
      renderHomeFilterBindings(); bindCards();
    });
    bindCards();
  }
  function renderHomeFilterBindings() {
    document.querySelectorAll("#homeFilters [data-type]").forEach((button) => button.onclick = () => {
      const filtered = Core.filterItems(items, { type: button.dataset.type, status: "active" }).sort((a,b)=>b.createdAt-a.createdAt);
      document.getElementById("homeFilters").innerHTML = filterChips(button.dataset.type);
      document.getElementById("homeCount").textContent = `共 ${filtered.length} 条`;
      document.getElementById("homeList").innerHTML = filtered.length ? filtered.map(itemCard).join("") : emptyState("暂时没有这类信息", "换一个分类看看吧。");
      renderHomeFilterBindings(); bindCards();
    });
  }

  function renderSearch(params) {
    setNav("search");
    const query = params.get("q") || "";
    const type = params.get("type") || "all";
    const category = params.get("category") || "all";
    const locationText = params.get("location") || "";
    const status = params.get("status") || "active";
    const results = Core.filterItems(items, { query, type, category, location: locationText, status });
    const categories = Core.uniqueCategories(items);
    view.innerHTML = `<div class="page-title"><span class="eyebrow">快速定位线索</span><h1>搜索信息</h1><p>支持按名称、描述、分类和地点组合查询。</p></div>
      <form class="search-panel" id="searchForm"><label class="search-box">⌕<input name="q" value="${escapeHtml(query)}" placeholder="输入物品名称或关键词" autocomplete="off"><button type="submit">搜索</button></label>
      <div class="advanced-filters"><label>物品分类<select name="category"><option value="all">全部分类</option>${categories.map(c=>`<option ${c===category?"selected":""}>${escapeHtml(c)}</option>`).join("")}</select></label><label>地点包含<input name="location" value="${escapeHtml(locationText)}" placeholder="如：图书馆"></label></div>
      <div id="searchType">${filterChips(type)}</div><div id="searchStatus">${statusChips(status)}</div></form>
      <div class="results-summary"><strong>${results.length}</strong> 条结果${query ? `，关键词“${escapeHtml(query)}”` : ""}</div>
      <div class="card-list">${results.length ? results.map(itemCard).join("") : emptyState("没有找到相关信息", "试试缩短关键词、清空分类或更换地点。")} </div>`;
    const form = document.getElementById("searchForm");
    const submit = (nextType, nextStatus) => {
      const data = new FormData(form); const p = new URLSearchParams();
      if (data.get("q")) p.set("q", data.get("q"));
      p.set("type", nextType || type); p.set("category", data.get("category"));
      p.set("status", nextStatus || status);
      if (data.get("location")) p.set("location", data.get("location"));
      go(`search?${p}`);
    };
    form.onsubmit = (event) => { event.preventDefault(); submit(); };
    form.category.onchange = () => submit(); form.location.onchange = () => submit();
    document.querySelectorAll("#searchType [data-type]").forEach((button) => button.onclick = () => submit(button.dataset.type));
    document.querySelectorAll("#searchStatus [data-status]").forEach((button) => button.onclick = () => submit(null, button.dataset.status));
    bindCards();
  }

  function renderCompleted(params) {
    setNav("completed");
    const type = params.get("type") || "all";
    const completed = Core.filterItems(items, { type, status: "done" }).sort((a,b)=>b.createdAt-a.createdAt);
    view.innerHTML = `<div class="page-title completed-title"><span class="eyebrow">历史记录</span><h1>已完成信息</h1><p>这里保留已经找到或归还的记录，不占用首页的进行中列表。</p></div>
      <div class="completed-toolbar"><div id="completedFilters">${filterChips(type)}</div><span class="result-count" id="completedCount">共 ${completed.length} 条</span></div>
      <div class="card-list completed-list">${completed.length ? completed.map(itemCard).join("") : emptyState("暂无已完成信息", "完成的信息会保留在这里。")}</div>`;
    document.querySelectorAll("#completedFilters [data-type]").forEach((button) => button.onclick = () => go(`completed?type=${button.dataset.type}`));
    bindCards();
  }

  function renderPublish(params) {
    setNav("publish");
    const selectedType = params.get("type") === "found" ? "found" : "lost";
    view.innerHTML = `<div class="page-title"><span class="eyebrow">补充一条校园线索</span><h1>发布信息</h1><p>信息越清晰，物品越容易回到主人身边。</p></div>
      <form class="form-card" id="publishForm" novalidate>
        <fieldset><legend>信息类型</legend><div class="segmented"><label><input type="radio" name="type" value="lost" ${selectedType==="lost"?"checked":""}><span>🔍 寻物信息</span></label><label><input type="radio" name="type" value="found" ${selectedType==="found"?"checked":""}><span>🙌 招领信息</span></label></div></fieldset>
        <div class="form-grid"><label>物品名称<input name="title" placeholder="例如：白色蓝牙耳机"><small data-error="title"></small></label><label>物品分类<select name="category"><option value="">请选择分类</option>${Object.keys(ICONS).map(c=>`<option>${c}</option>`).join("")}</select><small data-error="category"></small></label><label>时间<input name="date" type="date"><small data-error="date"></small></label><label>地点<input name="location" placeholder="例如：图书馆二楼"><small data-error="location"></small></label></div>
        <label>详细描述<textarea name="description" rows="4" placeholder="颜色、特征、发现位置等，至少 5 个字"></textarea><small data-error="description"></small></label>
        <label>联系方式<input name="contact" placeholder="11 位手机号或邮箱"><small data-error="contact"></small></label>
        <div class="privacy-note">🔒 联系方式仅在详情页展示，请勿填写密码或其他敏感信息。</div>
        <button class="primary-button" type="submit">确认发布</button>
      </form>`;
    const form = document.getElementById("publishForm");
    form.date.value = new Date().toISOString().slice(0,10);
    form.onsubmit = (event) => {
      event.preventDefault();
      document.querySelectorAll("[data-error]").forEach((n)=>n.textContent="");
      const draft = Object.fromEntries(new FormData(form).entries());
      const result = Core.buildItem(draft, Date.now());
      if (!result.item) {
        Object.entries(result.errors).forEach(([key,value]) => { const node = document.querySelector(`[data-error="${key}"]`); if (node) node.textContent = value; });
        showToast("请检查标红的必填信息"); return;
      }
      items.unshift(result.item); saveItems();
      sessionStorage.setItem("lastPublishedId", result.item.id); go("success");
    };
  }

  function renderSuccess() {
    setNav("publish");
    const id = sessionStorage.getItem("lastPublishedId");
    view.innerHTML = `<div class="success-card"><div class="success-check">✓</div><span class="eyebrow">操作成功</span><h1>发布成功！</h1><p>信息已保存到首页，其他同学可以通过关键词搜索到它。</p><div class="success-actions"><button class="primary-button" id="goHome">返回首页</button><button class="secondary-button" id="goMine">查看我的发布</button>${id?`<button class="text-button" id="goDetail">查看刚发布的信息</button>`:""}</div></div>`;
    document.getElementById("goHome").onclick=()=>go("home"); document.getElementById("goMine").onclick=()=>go("mine");
    if (id) document.getElementById("goDetail").onclick=()=>go(`detail?id=${encodeURIComponent(id)}`);
  }

  function renderDetail(params) {
    setNav("detail");
    const item = items.find((entry)=>entry.id===params.get("id"));
    if (!item) { view.innerHTML=emptyState("信息不存在", "它可能已被删除或链接已经失效。") + `<button class="primary-button" id="missingHome">返回首页</button>`; document.getElementById("missingHome").onclick=()=>go("home"); return; }
    view.innerHTML = `<article class="detail-card"><div class="detail-cover ${item.type}"><span>${ICONS[item.category]||"📦"}</span><em>${item.type==="lost"?"寻物":"招领"}</em></div>
      <div class="detail-body"><div class="item-topline"><span class="type-badge ${item.type}">${item.type==="lost"?"寻物":"招领"}</span><span class="status-badge">${escapeHtml(item.status)}</span></div><h1>${escapeHtml(item.title)}</h1><p class="detail-description">${escapeHtml(item.description)}</p>
      <dl class="detail-grid"><div><dt>时间</dt><dd>${escapeHtml(item.date)}</dd></div><div><dt>地点</dt><dd>${escapeHtml(item.location)}</dd></div><div><dt>分类</dt><dd>${escapeHtml(item.category)}</dd></div><div><dt>当前状态</dt><dd>${escapeHtml(item.status)}</dd></div></dl>
      <div class="contact-card"><div><small>发布者联系方式</small><strong>${escapeHtml(item.contact)}</strong></div><button class="secondary-button" id="copyContact">一键复制</button></div>
      ${Core.isCompleted(item)?`<div class="completed-note">✓ 这条信息已完成，请勿重复联系发布者。</div>`:`<button class="primary-button" id="contactButton">联系发布者</button>`}</div></article>`;
    document.getElementById("copyContact").onclick=()=>copyContact(item.contact);
    const contactButton=document.getElementById("contactButton"); if(contactButton) contactButton.onclick=()=>copyContact(item.contact);
  }
  function copyContact(contact) {
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(contact).then(()=>showToast("联系方式已复制")).catch(()=>fallbackCopy(contact)); else fallbackCopy(contact);
  }
  function fallbackCopy(text) { const area=document.createElement("textarea"); area.value=text; document.body.appendChild(area); area.select(); document.execCommand("copy"); area.remove(); showToast("联系方式已复制"); }

  function renderMine(params) {
    setNav("mine");
    const filter=params.get("filter")||"all"; const mine=items.filter((item)=>item.mine);
    const shown=mine.filter((item)=>filter==="all"||(filter==="active"?!Core.isCompleted(item):Core.isCompleted(item)));
    view.innerHTML=`<div class="profile-banner"><div class="avatar">校</div><div><span class="eyebrow">校园同学</span><h1>我的发布</h1><p>让每一次发布都有回应，也让状态及时更新。</p></div></div>
      <div class="chips mine-filters"><a class="chip ${filter==="all"?"active":""}" href="#mine?filter=all">全部 ${mine.length}</a><a class="chip ${filter==="active"?"active":""}" href="#mine?filter=active">进行中</a><a class="chip ${filter==="done"?"active":""}" href="#mine?filter=done">已完成</a></div>
      <div class="manage-list">${shown.length?shown.map((item)=>`<article class="manage-card"><div class="manage-main" data-open="${escapeHtml(item.id)}"><span class="manage-icon">${ICONS[item.category]||"📦"}</span><div><span class="type-badge ${item.type}">${item.type==="lost"?"寻物":"招领"}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.location)} · ${escapeHtml(item.date)}</p></div></div><div class="manage-actions"><span class="status-badge">${escapeHtml(item.status)}</span><div class="manage-buttons"><button class="secondary-button" data-toggle="${escapeHtml(item.id)}">${Core.isCompleted(item)?"恢复为进行中":item.type==="lost"?"标记为已找到":"标记为已归还"}</button><button class="delete-button" data-delete="${escapeHtml(item.id)}">删除</button></div></div></article>`).join(""):emptyState("这里还没有信息", "发布一条寻物或招领信息后，它会显示在这里。")}</div>`;
    document.querySelectorAll("[data-open]").forEach((node)=>node.onclick=()=>go(`detail?id=${encodeURIComponent(node.dataset.open)}`));
    document.querySelectorAll("[data-toggle]").forEach((button)=>button.onclick=()=>{items=items.map((item)=>item.id===button.dataset.toggle?Core.toggleStatus(item):item);saveItems();showToast("状态已更新，首页和详情页将同步显示");renderMine(params);});
    document.querySelectorAll("[data-delete]").forEach((button)=>button.onclick=()=>{if(window.confirm("确定删除这条发布吗？删除后无法恢复。")){items=items.filter((item)=>item.id!==button.dataset.delete);saveItems();showToast("发布已删除");renderMine(params);}});
  }

  function render() {
    const {page,params}=routeParts();
    ({home:renderHome,search:renderSearch,publish:renderPublish,success:renderSuccess,detail:renderDetail,mine:renderMine,completed:renderCompleted}[page]||renderHome)(params);
    window.scrollTo({top:0,behavior:"smooth"});
  }
  backButton.onclick=()=>history.length>1?history.back():go("home");
  resetButton.onclick=()=>{ if(window.confirm("确定恢复示例数据吗？你在本浏览器发布的内容将被清空。")){items=seedItems.slice();saveItems();showToast("已恢复示例数据");render();} };
  window.addEventListener("hashchange",render); render();
})();
