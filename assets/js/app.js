(function () {

    "use strict";

    const Core = window.LostFoundCore;
    const view = document.getElementById("view");


    // =========================
    // 示例数据
    // =========================

    const items = [

        {
            id: "seed-1",
            type: "found",
            title: "拾到一张校园卡",
            category: "校园卡",
            date: "2026-09-26",
            location: "第一教学楼 302",
            description: "下课后在第三排座位旁发现，请失主联系时说明姓名和学号后四位。",
            contact: "13800138000",
            status: "等待认领"
        },

        {
            id: "seed-2",
            type: "lost",
            title: "寻找白色蓝牙耳机",
            category: "数码",
            date: "2026-09-25",
            location: "图书馆二楼",
            description: "白色充电盒，右侧有一枚蓝色贴纸，可能遗落在靠窗自习区。",
            contact: "student@example.com",
            status: "寻找中"
        },

        {
            id: "seed-3",
            type: "found",
            title: "蓝色折叠雨伞待认领",
            category: "雨具",
            date: "2026-09-24",
            location: "博学楼 A 区",
            description: "深蓝色八骨折叠伞，伞柄系有白色挂绳。",
            contact: "13900139000",
            status: "等待认领"
        },

        {
            id: "seed-4",
            type: "lost",
            title: "寻找蓝色校园卡套",
            category: "校园卡",
            date: "2026-09-23",
            location: "运动场",
            description: "蓝色透明卡套，挂有一个小熊钥匙扣。",
            contact: "lost@example.com",
            status: "已找到"
        },

        {
            id: "seed-5",
            type: "found",
            title: "教学楼门口捡到钥匙",
            category: "钥匙",
            date: "2026-09-22",
            location: "至诚楼门口",
            description: "两把钥匙和一枚绿色门禁扣，放在保安室。",
            contact: "13700137000",
            status: "已归还"
        }

    ];


    const ICONS = {
        "校园卡": "🪪",
        "数码": "🎧",
        "雨具": "☂️",
        "钥匙": "🔑",
        "书籍": "📚",
        "其他": "📦"
    };


    // =========================
    // HTML 特殊字符处理
    // =========================

    function escapeHtml(value) {

        return String(value == null ? "" : value)
            .replace(/[&<>'"]/g, function (char) {

                const map = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "'": "&#39;",
                    '"': "&quot;"
                };

                return map[char];
            });
    }


    // =========================
    // 页面路由
    // =========================

    function routeParts() {

        const raw = location.hash.slice(1) || "home";
        const parts = raw.split("?");

        return {
            page: parts[0],
            params: new URLSearchParams(parts[1] || "")
        };
    }


    function go(hash) {

        location.hash = hash;
    }


    // =========================
    // 底部导航
    // =========================

    function setNav(page) {

        document
            .querySelectorAll("[data-nav]")
            .forEach(function (node) {

                node.classList.toggle(
                    "active",
                    node.dataset.nav === page
                );
            });
    }


    // =========================
    // 物品卡片
    // =========================

    function itemCard(item) {

        const icon = ICONS[item.category] || "📦";

        return `
        <article
            class="item-card"
            data-id="${escapeHtml(item.id)}"
            tabindex="0"
            title="点击查看详情"
        >

            <div class="item-icon ${item.type}">
                ${icon}
            </div>

            <div class="item-copy">

                <div class="item-topline">

                    <span class="type-badge ${item.type}">
                        ${item.type === "lost" ? "寻物" : "招领"}
                    </span>

                    <span class="status-badge">
                        ${escapeHtml(item.status)}
                    </span>

                </div>

                <h3>
                    ${escapeHtml(item.title)}
                </h3>

                <p>
                    ⌖ ${escapeHtml(item.location)}
                    ·
                    ${escapeHtml(item.date)}
                </p>

                <small>
                    ${escapeHtml(item.description)}
                </small>

            </div>

            <span class="chevron">›</span>

        </article>
        `;
    }


    // =========================
    // 给卡片绑定详情页跳转
    // =========================

    function bindItemCards() {

        document
            .querySelectorAll(".item-card[data-id]")
            .forEach(function (card) {

                function openDetail() {

                    go(
                        "detail?id=" +
                        encodeURIComponent(card.dataset.id)
                    );
                }


                card.addEventListener(
                    "click",
                    openDetail
                );


                card.addEventListener(
                    "keydown",
                    function (event) {

                        if (
                            event.key === "Enter" ||
                            event.key === " "
                        ) {

                            event.preventDefault();
                            openDetail();
                        }
                    }
                );
            });
    }


    // =========================
    // 类型筛选按钮
    // =========================

    function filterChips(active) {

        const types = [
            ["all", "全部"],
            ["lost", "寻物"],
            ["found", "招领"]
        ];


        return `
        <div class="chips">

            ${types.map(function (item) {

                const value = item[0];
                const label = item[1];

                return `
                <button
                    type="button"
                    data-type="${value}"
                    class="chip ${
                        active === value
                            ? "active"
                            : ""
                    }"
                >
                    ${label}
                </button>
                `;

            }).join("")}

        </div>
        `;
    }


    // =========================
    // 无搜索结果
    // =========================

    function emptyState() {

        return `
        <div class="empty-state">

            <div>🔎</div>

            <h3>没有找到相关信息</h3>

            <p>
                试试缩短关键词、
                清空分类或更换地点。
            </p>

        </div>
        `;
    }


    // =========================
    // 首页
    // =========================

    function renderHome() {

        setNav("home");


        view.innerHTML = `

        <section class="hero">

            <span class="eyebrow">
                校园失物招领
            </span>

            <h1>
                今天想找什么？
            </h1>

            <p>
                集中浏览校园里的失物招领信息，
                快速找到重要线索。
            </p>

            <button
                class="search-entry"
                id="homeSearch"
                type="button"
            >

                ⌕

                <span>
                    搜索校园卡、雨伞、钥匙……
                </span>

                <strong>
                    搜索
                </strong>

            </button>

        </section>


        <div class="section-heading">

            <div>

                <span class="eyebrow">
                    校园寻物
                </span>

                <h2>
                    最新信息
                </h2>

            </div>

            <span class="count-pill">
                ${items.length} 条
            </span>

        </div>


        <div class="card-list">

            ${items.map(itemCard).join("")}

        </div>
        `;


        document
            .getElementById("homeSearch")
            .addEventListener(
                "click",
                function () {

                    go("search");
                }
            );


        bindItemCards();
    }


    // =========================
    // 搜索页面
    // =========================

    function renderSearch(params) {

        setNav("search");


        const query =
            params.get("q") || "";


        const type =
            params.get("type") || "all";


        const category =
            params.get("category") || "all";


        const locationText =
            params.get("location") || "";


        const results = Core.filterItems(
            items,
            {
                query: query,
                type: type,
                category: category,
                location: locationText
            }
        );


        const categories =
            Core.uniqueCategories(items);


        view.innerHTML = `

        <div class="page-title">

            <span class="eyebrow">
                快速定位线索
            </span>

            <h1>
                搜索信息
            </h1>

            <p>
                支持按物品名称、
                分类、地点和寻物类型组合查询。
            </p>

        </div>


        <form
            class="search-panel"
            id="searchForm"
        >

            <label class="search-box">

                <span>⌕</span>

                <input
                    name="q"
                    value="${escapeHtml(query)}"
                    placeholder="输入物品名称或关键词"
                    autocomplete="off"
                >

                <button type="submit">
                    搜索
                </button>

            </label>


            <div class="advanced-filters">

                <label>
                    物品分类

                    <select name="category">

                        <option value="all">
                            全部分类
                        </option>

                        ${categories.map(function (c) {

                            return `
                            <option
                                value="${escapeHtml(c)}"
                                ${
                                    c === category
                                        ? "selected"
                                        : ""
                                }
                            >
                                ${escapeHtml(c)}
                            </option>
                            `;

                        }).join("")}

                    </select>

                </label>


                <label>
                    地点包含

                    <input
                        name="location"
                        value="${escapeHtml(locationText)}"
                        placeholder="例如：图书馆"
                    >

                </label>

            </div>


            <div id="searchType">
                ${filterChips(type)}
            </div>

        </form>


        <div class="results-summary">

            <strong>
                ${results.length}
            </strong>

            条结果

            ${
                query
                    ? `，关键词“${escapeHtml(query)}”`
                    : ""
            }

        </div>


        <div class="card-list">

            ${
                results.length
                    ? results.map(itemCard).join("")
                    : emptyState()
            }

        </div>
        `;


        const form =
            document.getElementById("searchForm");


        function submit(nextType) {

            const data =
                new FormData(form);


            const nextParams =
                new URLSearchParams();


            const keyword =
                data.get("q");


            const currentCategory =
                data.get("category");


            const currentLocation =
                data.get("location");


            if (keyword) {

                nextParams.set(
                    "q",
                    keyword
                );
            }


            nextParams.set(
                "type",
                nextType || type
            );


            nextParams.set(
                "category",
                currentCategory
            );


            if (currentLocation) {

                nextParams.set(
                    "location",
                    currentLocation
                );
            }


            go(
                "search?" +
                nextParams.toString()
            );
        }


        form.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();
                submit();
            }
        );


        form.category.addEventListener(
            "change",
            function () {

                submit();
            }
        );


        form.location.addEventListener(
            "change",
            function () {

                submit();
            }
        );


        document
            .querySelectorAll(
                "#searchType [data-type]"
            )
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        submit(
                            button.dataset.type
                        );
                    }
                );
            });


        bindItemCards();
    }


    // =========================
    // 详情页
    // =========================

    function renderDetail(params) {

        setNav("");


        const id =
            params.get("id");


        const item =
            items.find(function (currentItem) {

                return currentItem.id === id;
            });


        if (!item) {

            view.innerHTML = `

            <div class="empty-state">

                <div>📦</div>

                <h3>没有找到这条信息</h3>

                <p>
                    这条失物招领信息可能不存在。
                </p>

                <button
                    class="secondary-button detail-back-home"
                    id="backHome"
                    type="button"
                >
                    返回首页
                </button>

            </div>
            `;


            document
                .getElementById("backHome")
                .addEventListener(
                    "click",
                    function () {

                        go("home");
                    }
                );

            return;
        }


        const icon =
            ICONS[item.category] || "📦";


        const completed =
            item.status === "已找到" ||
            item.status === "已归还";


        view.innerHTML = `

        <button
            class="detail-back"
            id="detailBack"
            type="button"
        >
            ← 返回
        </button>


        <article class="detail-card">

            <div class="detail-cover ${item.type}">

                <span>
                    ${icon}
                </span>

                <em>
                    ${
                        item.type === "lost"
                            ? "寻物"
                            : "招领"
                    }
                </em>

            </div>


            <div class="detail-body">

                <div class="item-topline">

                    <span class="type-badge ${item.type}">

                        ${
                            item.type === "lost"
                                ? "寻物"
                                : "招领"
                        }

                    </span>


                    <span class="status-badge">
                        ${escapeHtml(item.status)}
                    </span>

                </div>


                <h1>
                    ${escapeHtml(item.title)}
                </h1>


                <p class="detail-description">
                    ${escapeHtml(item.description)}
                </p>


                <dl class="detail-grid">

                    <div>

                        <dt>
                            时间
                        </dt>

                        <dd>
                            ${escapeHtml(item.date)}
                        </dd>

                    </div>


                    <div>

                        <dt>
                            地点
                        </dt>

                        <dd>
                            ${escapeHtml(item.location)}
                        </dd>

                    </div>


                    <div>

                        <dt>
                            分类
                        </dt>

                        <dd>
                            ${escapeHtml(item.category)}
                        </dd>

                    </div>


                    <div>

                        <dt>
                            当前状态
                        </dt>

                        <dd>
                            ${escapeHtml(item.status)}
                        </dd>

                    </div>

                </dl>


                <div class="contact-card">

                    <div>

                        <small>
                            发布者联系方式
                        </small>

                        <strong>
                            ${escapeHtml(item.contact)}
                        </strong>

                    </div>


                    <button
                        class="secondary-button"
                        id="copyContact"
                        type="button"
                    >
                        一键复制
                    </button>

                </div>


                ${
                    completed

                        ? `
                        <div class="completed-note">

                            ✓ 这条信息已完成，
                            请勿重复联系发布者。

                        </div>
                        `

                        : `
                        <button
                            class="primary-button"
                            id="contactButton"
                            type="button"
                        >
                            复制联系方式并联系发布者
                        </button>
                        `
                }

            </div>

        </article>


        <div
            class="toast"
            id="toast"
        >
            联系方式已复制
        </div>
        `;


        document
            .getElementById("detailBack")
            .addEventListener(
                "click",
                function () {

                    if (history.length > 1) {

                        history.back();
                    }
                    else {

                        go("home");
                    }
                }
            );


        document
            .getElementById("copyContact")
            .addEventListener(
                "click",
                function () {

                    copyContact(
                        item.contact
                    );
                }
            );


        const contactButton =
            document.getElementById(
                "contactButton"
            );


        if (contactButton) {

            contactButton.addEventListener(
                "click",
                function () {

                    copyContact(
                        item.contact
                    );
                }
            );
        }
    }


    // =========================
    // 复制联系方式
    // =========================

    function copyContact(contact) {

        if (
            navigator.clipboard &&
            navigator.clipboard.writeText
        ) {

            navigator.clipboard
                .writeText(contact)
                .then(function () {

                    showToast(
                        "联系方式已复制"
                    );
                })
                .catch(function () {

                    fallbackCopy(contact);
                });
        }
        else {

            fallbackCopy(contact);
        }
    }


    // =========================
    // 备用复制方法
    // =========================

    function fallbackCopy(text) {

        const area =
            document.createElement(
                "textarea"
            );


        area.value = text;

        area.style.position = "fixed";
        area.style.opacity = "0";


        document.body.appendChild(
            area
        );


        area.focus();
        area.select();


        document.execCommand(
            "copy"
        );


        area.remove();


        showToast(
            "联系方式已复制"
        );
    }


    // =========================
    // Toast 提示
    // =========================

    function showToast(message) {

        let toast =
            document.getElementById(
                "toast"
            );


        if (!toast) {

            toast =
                document.createElement(
                    "div"
                );


            toast.id = "toast";
            toast.className = "toast";


            document.body.appendChild(
                toast
            );
        }


        toast.textContent =
            message;


        toast.classList.add(
            "show"
        );


        window.clearTimeout(
            showToast.timer
        );


        showToast.timer =
            window.setTimeout(
                function () {

                    toast.classList.remove(
                        "show"
                    );

                },
                1800
            );
    }


    // =========================
    // 页面渲染入口
    // =========================

    function render() {

        const route =
            routeParts();


        if (
            route.page === "search"
        ) {

            renderSearch(
                route.params
            );
        }

        else if (
            route.page === "detail"
        ) {

            renderDetail(
                route.params
            );
        }

        else {

            renderHome();
        }
    }


    window.addEventListener(
        "hashchange",
        render
    );


    render();

})();