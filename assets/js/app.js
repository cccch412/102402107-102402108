(function () {

    "use strict";


    const Core = window.LostFoundCore;

    const view =
        document.getElementById("view");


    // ==========================================
    // 示例数据
    // ==========================================

    const items = [

        {
            id: "seed-1",

            type: "found",

            title: "拾到一张校园卡",

            category: "校园卡",

            date: "2026-09-26",

            location: "第一教学楼 302",

            description:
                "下课后在第三排座位旁发现，请失主联系时说明姓名和学号后四位。",

            status: "等待认领"
        },


        {
            id: "seed-2",

            type: "lost",

            title: "寻找白色蓝牙耳机",

            category: "数码",

            date: "2026-09-25",

            location: "图书馆二楼",

            description:
                "白色充电盒，右侧有一枚蓝色贴纸，可能遗落在靠窗自习区。",

            status: "寻找中"
        },


        {
            id: "seed-3",

            type: "found",

            title: "蓝色折叠雨伞待认领",

            category: "雨具",

            date: "2026-09-24",

            location: "博学楼 A 区",

            description:
                "深蓝色八骨折叠伞，伞柄系有白色挂绳。",

            status: "等待认领"
        },


        {
            id: "seed-4",

            type: "lost",

            title: "寻找蓝色校园卡套",

            category: "校园卡",

            date: "2026-09-23",

            location: "运动场",

            description:
                "蓝色透明卡套，挂有一个小熊钥匙扣。",

            status: "已找到"
        },


        {
            id: "seed-5",

            type: "found",

            title: "教学楼门口捡到钥匙",

            category: "钥匙",

            date: "2026-09-22",

            location: "至诚楼门口",

            description:
                "两把钥匙和一枚绿色门禁扣，放在保安室。",

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


    // ==========================================
    // 防止直接向页面中插入特殊字符
    // ==========================================

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


    // ==========================================
    // 页面路由
    // ==========================================

    function routeParts() {

        const raw =
            location.hash.slice(1) || "home";

        const parts =
            raw.split("?");

        return {

            page: parts[0],

            params: new URLSearchParams(
                parts[1] || ""
            )

        };

    }


    function go(hash) {

        location.hash = hash;

    }


    // ==========================================
    // 底部导航状态
    // ==========================================

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


    // ==========================================
    // 物品卡片
    // ==========================================

    function itemCard(item) {

        const icon =
            ICONS[item.category] || "📦";


        return `

        <article class="item-card">

            <div class="item-icon ${item.type}">

                ${icon}

            </div>


            <div class="item-copy">

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

        </article>

        `;

    }


    // ==========================================
    // 寻物 / 招领筛选按钮
    // ==========================================

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


    // ==========================================
    // 搜索无结果
    // ==========================================

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


    // ==========================================
    // 首页
    // ==========================================

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

    }


    // ==========================================
    // 搜索页面
    // ==========================================

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


        // 调用 core.js 中的搜索逻辑
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

                    ? results
                        .map(itemCard)
                        .join("")

                    : emptyState()
            }

        </div>

        `;


        const form =
            document.getElementById(
                "searchForm"
            );


        // 根据表单重新进行搜索
        function submit(nextType) {

            const data =
                new FormData(form);


            const params =
                new URLSearchParams();


            const keyword =
                data.get("q");


            const currentCategory =
                data.get("category");


            const currentLocation =
                data.get("location");


            if (keyword) {

                params.set(
                    "q",
                    keyword
                );

            }


            params.set(

                "type",

                nextType || type

            );


            params.set(

                "category",

                currentCategory

            );


            if (currentLocation) {

                params.set(

                    "location",

                    currentLocation

                );

            }


            go(
                "search?" +
                params.toString()
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

    }


    // ==========================================
    // 页面渲染
    // ==========================================

    function render() {

        const route =
            routeParts();


        if (route.page === "search") {

            renderSearch(
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