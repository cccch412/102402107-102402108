(function () {

    "use strict";


    const Core =
        window.LostFoundCore;


    const STORAGE_KEY =
        "shiguang-campus-items-v1";


    const ICONS = {

        "校园卡": "🪪",

        "数码": "🎧",

        "雨具": "☂️",

        "钥匙": "🔑",

        "书籍": "📚",

        "其他": "📦"

    };


    const seedItems = [

        {
            id: "seed-1",

            type: "found",

            title: "拾到一张校园卡",

            category: "校园卡",

            date: "2026-09-26",

            location: "第一教学楼 302",

            description:
                "下课后在第三排座位旁发现，请失主联系时说明姓名和学号后四位。",

            contact:
                "13800138000",

            status:
                "等待认领",

            mine: false,

            createdAt:
                1790437800000
        },


        {
            id: "seed-2",

            type: "lost",

            title:
                "寻找白色蓝牙耳机",

            category:
                "数码",

            date:
                "2026-09-25",

            location:
                "图书馆二楼",

            description:
                "白色充电盒，右侧有一枚蓝色贴纸，可能遗落在靠窗自习区。",

            contact:
                "student@example.com",

            status:
                "寻找中",

            mine: true,

            createdAt:
                1790355900000
        },


        {
            id: "seed-3",

            type: "found",

            title:
                "蓝色折叠雨伞待认领",

            category:
                "雨具",

            date:
                "2026-09-24",

            location:
                "博学楼 A 区",

            description:
                "深蓝色八骨折叠伞，伞柄系有白色挂绳。",

            contact:
                "13900139000",

            status:
                "等待认领",

            mine: true,

            createdAt:
                1790266800000
        },


        {
            id: "seed-4",

            type: "lost",

            title:
                "寻找蓝色校园卡套",

            category:
                "校园卡",

            date:
                "2026-09-23",

            location:
                "运动场",

            description:
                "蓝色透明卡套，挂有一个小熊钥匙扣。",

            contact:
                "lost@example.com",

            status:
                "已找到",

            mine: false,

            createdAt:
                1790180400000
        },


        {
            id: "seed-5",

            type: "found",

            title:
                "教学楼门口捡到钥匙",

            category:
                "钥匙",

            date:
                "2026-09-22",

            location:
                "至诚楼门口",

            description:
                "两把钥匙和一枚绿色门禁扣，放在保安室。",

            contact:
                "13700137000",

            status:
                "已归还",

            mine: false,

            createdAt:
                1790094000000
        }

    ];


    const view =
        document.getElementById(
            "view"
        );


    const toast =
        document.getElementById(
            "toast"
        );


    let items =
        loadItems();


    function loadItems() {

        try {

            const saved =
                JSON.parse(
                    localStorage.getItem(
                        STORAGE_KEY
                    )
                );


            if (
                Array.isArray(saved) &&
                saved.length
            ) {

                return saved;
            }


            return seedItems.slice();

        }

        catch (error) {

            return seedItems.slice();
        }
    }


    function saveItems() {

        localStorage.setItem(

            STORAGE_KEY,

            JSON.stringify(items)

        );
    }


    function escapeHtml(value) {

        return String(
            value == null
                ? ""
                : value
        ).replace(

            /[&<>'"]/g,

            function (char) {

                const map = {

                    "&": "&amp;",

                    "<": "&lt;",

                    ">": "&gt;",

                    "'": "&#39;",

                    '"': "&quot;"

                };


                return map[char];
            }
        );
    }


    function showToast(message) {

        toast.textContent =
            message;


        toast.classList.add(
            "show"
        );


        clearTimeout(
            showToast.timer
        );


        showToast.timer =
            setTimeout(

                function () {

                    toast.classList.remove(
                        "show"
                    );

                },

                1800
            );
    }


    function routeParts() {

        const raw =
            location.hash.slice(1)
            || "home";


        const parts =
            raw.split("?");


        return {

            page:
                parts[0],

            params:
                new URLSearchParams(
                    parts[1] || ""
                )

        };
    }


    function go(hash) {

        location.hash =
            hash;
    }


    function setNav(page) {

        document
            .querySelectorAll(
                "[data-nav]"
            )
            .forEach(

                function (node) {

                    node.classList
                        .toggle(

                            "active",

                            node.dataset.nav
                            === page

                        );

                }

            );
    }


    function itemCard(item) {

        const done =
            Core.isCompleted(item);


        return `

        <article
            class="item-card ${
                done
                    ? "completed"
                    : ""
            }"
            data-id="${escapeHtml(item.id)}"
            tabindex="0"
            title="点击查看详情"
        >

            <div
                class="item-icon ${item.type}"
            >

                ${
                    ICONS[item.category]
                    || "📦"
                }

            </div>


            <div class="item-copy">

                <div class="item-topline">

                    <span
                        class="type-badge ${item.type}"
                    >

                        ${
                            item.type === "lost"
                                ? "寻物"
                                : "招领"
                        }

                    </span>


                    <span
                        class="status-badge"
                    >

                        ${escapeHtml(
                            item.status
                        )}

                    </span>

                </div>


                <h3>

                    ${escapeHtml(
                        item.title
                    )}

                </h3>


                <p>

                    ⌖ ${escapeHtml(
                        item.location
                    )}

                    ·

                    ${escapeHtml(
                        item.date
                    )}

                </p>


                <small>

                    ${escapeHtml(
                        item.description
                    )}

                </small>

            </div>


            <span class="chevron">
                ›
            </span>

        </article>

        `;
    }


    function bindCards() {

        document
            .querySelectorAll(
                ".item-card[data-id]"
            )
            .forEach(

                function (card) {


                    function openDetail() {

                        go(

                            "detail?id=" +

                            encodeURIComponent(
                                card.dataset.id
                            )

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
                                event.key === "Enter"
                                ||
                                event.key === " "
                            ) {

                                event.preventDefault();

                                openDetail();

                            }
                        }

                    );

                }

            );
    }


    function filterChips(active) {

        const types = [

            ["all", "全部"],

            ["lost", "寻物"],

            ["found", "招领"]

        ];


        return `

        <div class="chips">

            ${
                types.map(

                    function (item) {

                        return `

                        <button
                            type="button"
                            data-type="${item[0]}"
                            class="chip ${
                                active === item[0]
                                    ? "active"
                                    : ""
                            }"
                        >

                            ${item[1]}

                        </button>

                        `;

                    }

                ).join("")
            }

        </div>

        `;
    }


    function emptyState(
        title,
        text
    ) {

        return `

        <div class="empty-state">

            <div>
                🔎
            </div>

            <h3>
                ${escapeHtml(title)}
            </h3>

            <p>
                ${escapeHtml(text)}
            </p>

        </div>

        `;
    }


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


            <div class="quick-actions">

                <button
                    class="action-card lost"
                    data-go="publish?type=lost"
                    type="button"
                >

                    <span>
                        我丢东西了
                    </span>

                    <strong>
                        发布寻物启事 →
                    </strong>

                </button>


                <button
                    class="action-card found"
                    data-go="publish?type=found"
                    type="button"
                >

                    <span>
                        我捡到东西
                    </span>

                    <strong>
                        发布招领信息 →
                    </strong>

                </button>

            </div>

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


        <div id="homeFilters">

            ${filterChips("all")}

        </div>


        <div
            class="card-list"
            id="homeList"
        >

            ${
                items
                    .map(itemCard)
                    .join("")
            }

        </div>

        `;


        document
            .getElementById(
                "homeSearch"
            )
            .onclick =
            function () {

                go("search");

            };


        document
            .querySelectorAll(
                "[data-go]"
            )
            .forEach(

                function (button) {

                    button.onclick =
                        function () {

                            go(
                                button.dataset.go
                            );

                        };

                }

            );


        bindHomeFilters();

        bindCards();
    }


    function bindHomeFilters() {

        document
            .querySelectorAll(
                "#homeFilters [data-type]"
            )
            .forEach(

                function (button) {

                    button.onclick =
                        function () {


                            const filtered =
                                Core.filterItems(

                                    items,

                                    {
                                        type:
                                            button.dataset.type
                                    }

                                );


                            document
                                .getElementById(
                                    "homeFilters"
                                )
                                .innerHTML =
                                filterChips(
                                    button.dataset.type
                                );


                            document
                                .getElementById(
                                    "homeList"
                                )
                                .innerHTML =

                                filtered.length

                                    ? filtered
                                        .map(itemCard)
                                        .join("")

                                    : emptyState(
                                        "暂时没有这类信息",
                                        "换一个分类看看吧。"
                                    );


                            bindHomeFilters();

                            bindCards();

                        };

                }

            );
    }


    function renderSearch(params) {

        setNav("search");


        const query =
            params.get("q")
            || "";


        const type =
            params.get("type")
            || "all";


        const category =
            params.get("category")
            || "all";


        const locationText =
            params.get("location")
            || "";


        const results =
            Core.filterItems(

                items,

                {

                    query:
                        query,

                    type:
                        type,

                    category:
                        category,

                    location:
                        locationText

                }

            );


        const categories =
            Core.uniqueCategories(
                items
            );


        view.innerHTML = `

        <div class="page-title">

            <span class="eyebrow">
                快速定位线索
            </span>

            <h1>
                搜索信息
            </h1>

            <p>
                支持按物品名称、分类、
                地点和寻物类型组合查询。
            </p>

        </div>


        <form
            class="search-panel"
            id="searchForm"
        >

            <label class="search-box">

                ⌕

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

                        ${
                            categories
                                .map(

                                    function (c) {

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

                                    }

                                )
                                .join("")
                        }

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

                    : emptyState(
                        "没有找到相关信息",
                        "试试缩短关键词、清空分类或更换地点。"
                    )
            }

        </div>

        `;


        const form =
            document.getElementById(
                "searchForm"
            );


        function submit(nextType) {

            const data =
                new FormData(form);


            const next =
                new URLSearchParams();


            if (
                data.get("q")
            ) {

                next.set(
                    "q",
                    data.get("q")
                );

            }


            next.set(

                "type",

                nextType || type

            );


            next.set(

                "category",

                data.get("category")

            );


            if (
                data.get("location")
            ) {

                next.set(

                    "location",

                    data.get("location")

                );

            }


            go(

                "search?" +

                next.toString()

            );

        }


        form.onsubmit =
            function (event) {

                event.preventDefault();

                submit();

            };


        form.category.onchange =
            function () {

                submit();

            };


        form.location.onchange =
            function () {

                submit();

            };


        document
            .querySelectorAll(
                "#searchType [data-type]"
            )
            .forEach(

                function (button) {

                    button.onclick =
                        function () {

                            submit(
                                button.dataset.type
                            );

                        };

                }

            );


        bindCards();
    }


    function renderPublish(params) {

        setNav("publish");


        const selectedType =

            params.get("type")
            === "found"

                ? "found"

                : "lost";


        view.innerHTML = `

        <div class="page-title">

            <span class="eyebrow">
                补充一条校园线索
            </span>

            <h1>
                发布信息
            </h1>

            <p>
                信息越清晰，
                物品越容易回到主人身边。
            </p>

        </div>


        <form
            class="form-card"
            id="publishForm"
            novalidate
        >


            <fieldset>

                <legend>
                    信息类型
                </legend>


                <div class="segmented">

                    <label>

                        <input
                            type="radio"
                            name="type"
                            value="lost"
                            ${
                                selectedType
                                === "lost"

                                    ? "checked"

                                    : ""
                            }
                        >

                        <span>
                            🔍 寻物信息
                        </span>

                    </label>


                    <label>

                        <input
                            type="radio"
                            name="type"
                            value="found"
                            ${
                                selectedType
                                === "found"

                                    ? "checked"

                                    : ""
                            }
                        >

                        <span>
                            🙌 招领信息
                        </span>

                    </label>

                </div>


                <small
                    data-error="type"
                ></small>

            </fieldset>


            <div class="form-grid">


                <label>

                    物品名称

                    <input
                        name="title"
                        placeholder="例如：白色蓝牙耳机"
                    >

                    <small
                        data-error="title"
                    ></small>

                </label>


                <label>

                    物品分类

                    <select
                        name="category"
                    >

                        <option value="">
                            请选择分类
                        </option>


                        ${
                            Object
                                .keys(ICONS)
                                .map(

                                    function (c) {

                                        return `

                                        <option value="${c}">
                                            ${c}
                                        </option>

                                        `;

                                    }

                                )
                                .join("")
                        }

                    </select>

                    <small
                        data-error="category"
                    ></small>

                </label>


                <label>

                    时间

                    <input
                        name="date"
                        type="date"
                    >

                    <small
                        data-error="date"
                    ></small>

                </label>


                <label>

                    地点

                    <input
                        name="location"
                        placeholder="例如：图书馆二楼"
                    >

                    <small
                        data-error="location"
                    ></small>

                </label>

            </div>


            <label>

                详细描述

                <textarea
                    name="description"
                    rows="4"
                    placeholder="颜色、特征、发现位置等，至少 5 个字"
                ></textarea>

                <small
                    data-error="description"
                ></small>

            </label>


            <label>

                联系方式

                <input
                    name="contact"
                    placeholder="11 位手机号或邮箱"
                >

                <small
                    data-error="contact"
                ></small>

            </label>


            <div class="privacy-note">

                🔒 联系方式仅在详情页展示，
                请勿填写密码或其他敏感信息。

            </div>


            <button
                class="primary-button"
                type="submit"
            >

                确认发布

            </button>

        </form>

        `;


        const form =
            document.getElementById(
                "publishForm"
            );


        form.date.value =
            new Date()
                .toISOString()
                .slice(0, 10);


        form.onsubmit =
            function (event) {

                event.preventDefault();


                document
                    .querySelectorAll(
                        "[data-error]"
                    )
                    .forEach(

                        function (node) {

                            node.textContent =
                                "";

                        }

                    );


                const draft =
                    Object.fromEntries(

                        new FormData(
                            form
                        ).entries()

                    );


                const result =
                    Core.buildItem(

                        draft,

                        Date.now()

                    );


                if (!result.item) {


                    Object
                        .entries(
                            result.errors
                        )
                        .forEach(

                            function (entry) {

                                const key =
                                    entry[0];

                                const value =
                                    entry[1];


                                const node =
                                    document.querySelector(

                                        `[data-error="${key}"]`

                                    );


                                if (node) {

                                    node.textContent =
                                        value;

                                }

                            }

                        );


                    showToast(
                        "请检查表单中的必填信息"
                    );


                    return;
                }


                items.unshift(
                    result.item
                );


                saveItems();


                sessionStorage.setItem(

                    "lastPublishedId",

                    result.item.id

                );


                go("success");

            };
    }


    function renderSuccess() {

        setNav("publish");


        const id =
            sessionStorage.getItem(
                "lastPublishedId"
            );


        view.innerHTML = `

        <div class="success-card">

            <div class="success-check">
                ✓
            </div>


            <span class="eyebrow">
                操作成功
            </span>


            <h1>
                发布成功！
            </h1>


            <p>
                信息已保存到首页，
                其他同学可以通过关键词搜索到它。
            </p>


            <div class="success-actions">

                <button
                    class="primary-button"
                    id="goHome"
                    type="button"
                >
                    返回首页
                </button>


                ${
                    id

                        ? `

                        <button
                            class="secondary-button"
                            id="goDetail"
                            type="button"
                        >

                            查看刚发布的信息

                        </button>

                        `

                        : ""
                }

            </div>

        </div>

        `;


        document
            .getElementById(
                "goHome"
            )
            .onclick =
            function () {

                go("home");

            };


        if (id) {

            document
                .getElementById(
                    "goDetail"
                )
                .onclick =
                function () {

                    go(

                        "detail?id=" +

                        encodeURIComponent(id)

                    );

                };

        }
    }


    function renderMine() {

        setNav("mine");


        const mine =
            items.filter(

                function (item) {

                    return item.mine === true;

                }

            );


        const activeCount =
            mine.filter(

                function (item) {

                    return !Core.isCompleted(item);

                }

            ).length;


        const completedCount =
            mine.length -
            activeCount;


        view.innerHTML = `

        <div class="page-title">

            <span class="eyebrow">
                我的校园线索
            </span>

            <h1>
                我的发布
            </h1>

            <p>
                在这里查看自己发布的信息，
                并及时更新物品状态。
            </p>

        </div>


        <div class="mine-summary">

            <div>

                <strong>
                    ${mine.length}
                </strong>

                <span>
                    全部发布
                </span>

            </div>


            <div>

                <strong>
                    ${activeCount}
                </strong>

                <span>
                    进行中
                </span>

            </div>


            <div>

                <strong>
                    ${completedCount}
                </strong>

                <span>
                    已完成
                </span>

            </div>

        </div>


        <div class="mine-heading">

            <h2>
                发布记录
            </h2>

            <button
                class="mini-publish-button"
                id="minePublish"
                type="button"
            >
                ＋ 发布新信息
            </button>

        </div>


        <div class="mine-list">

            ${
                mine.length

                    ? mine
                        .map(
                            mineCard
                        )
                        .join("")

                    : `

                    <div class="empty-state">

                        <div>
                            📭
                        </div>

                        <h3>
                            还没有发布记录
                        </h3>

                        <p>
                            发布一条寻物或招领信息后，
                            就会出现在这里。
                        </p>

                    </div>

                    `
            }

        </div>

        `;


        document
            .getElementById(
                "minePublish"
            )
            .onclick =
            function () {

                go("publish");

            };


        bindMineCards();
    }


    function mineCard(item) {

        const completed =
            Core.isCompleted(item);


        const finishText =
            item.type === "lost"

                ? "标记为已找到"

                : "标记为已归还";


        return `

        <article
            class="mine-card ${
                completed
                    ? "completed"
                    : ""
            }"
        >

            <div class="mine-card-main">

                <div
                    class="item-icon ${item.type}"
                >

                    ${
                        ICONS[item.category]
                        || "📦"
                    }

                </div>


                <div class="mine-card-copy">

                    <div class="item-topline">

                        <span
                            class="type-badge ${item.type}"
                        >

                            ${
                                item.type === "lost"
                                    ? "寻物"
                                    : "招领"
                            }

                        </span>


                        <span
                            class="status-badge"
                        >

                            ${escapeHtml(
                                item.status
                            )}

                        </span>

                    </div>


                    <h3>
                        ${escapeHtml(
                            item.title
                        )}
                    </h3>


                    <p>

                        ${escapeHtml(
                            item.location
                        )}

                        ·

                        ${escapeHtml(
                            item.date
                        )}

                    </p>

                </div>

            </div>


            <div class="mine-card-actions">

                <button
                    class="secondary-button mine-detail-button"
                    data-detail-id="${escapeHtml(item.id)}"
                    type="button"
                >

                    查看详情

                </button>


                ${
                    completed

                        ? `

                        <span class="done-label">

                            ✓ 已完成

                        </span>

                        `

                        : `

                        <button
                            class="status-button"
                            data-complete-id="${escapeHtml(item.id)}"
                            type="button"
                        >

                            ${finishText}

                        </button>

                        `
                }

            </div>

        </article>

        `;
    }


    function bindMineCards() {

        document
            .querySelectorAll(
                "[data-detail-id]"
            )
            .forEach(

                function (button) {

                    button.onclick =
                        function () {

                            go(

                                "detail?id=" +

                                encodeURIComponent(
                                    button.dataset.detailId
                                )

                            );

                        };

                }

            );


        document
            .querySelectorAll(
                "[data-complete-id]"
            )
            .forEach(

                function (button) {

                    button.onclick =
                        function () {

                            completeItem(
                                button.dataset.completeId
                            );

                        };

                }

            );
    }


    function completeItem(id) {

        const item =
            items.find(

                function (entry) {

                    return entry.id === id;

                }

            );


        if (!item) {

            showToast(
                "没有找到这条信息"
            );

            return;
        }


        if (!item.mine) {

            showToast(
                "只能修改自己发布的信息"
            );

            return;
        }


        if (
            Core.isCompleted(item)
        ) {

            showToast(
                "这条信息已经完成"
            );

            return;
        }


        const nextStatus =
            Core.statusFor(
                item.type,
                true
            );


        const message =
            item.type === "lost"

                ? "确认已经找到这个物品吗？"

                : "确认物品已经归还失主吗？";


        if (
            !window.confirm(message)
        ) {

            return;
        }


        item.status =
            nextStatus;


        saveItems();


        showToast(
            "状态已更新为“" +
            nextStatus +
            "”"
        );


        renderMine();
    }


    function renderDetail(params) {

        setNav("");


        const item =
            items.find(

                function (entry) {

                    return (
                        entry.id
                        ===
                        params.get("id")
                    );

                }

            );


        if (!item) {

            view.innerHTML =

                emptyState(

                    "信息不存在",

                    "它可能已被删除或链接已经失效。"

                )

                +

                `

                <button
                    class="primary-button"
                    id="missingHome"
                    type="button"
                >
                    返回首页
                </button>

                `;


            document
                .getElementById(
                    "missingHome"
                )
                .onclick =
                function () {

                    go("home");

                };


            return;
        }


        const completed =
            Core.isCompleted(item);


        const finishText =
            item.type === "lost"

                ? "我已经找到物品"

                : "物品已经归还失主";


        view.innerHTML = `

        <button
            class="detail-back"
            id="detailBack"
            type="button"
        >
            ← 返回
        </button>


        <article class="detail-card">

            <div
                class="detail-cover ${item.type}"
            >

                <span>

                    ${
                        ICONS[item.category]
                        || "📦"
                    }

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

                    <span
                        class="type-badge ${item.type}"
                    >

                        ${
                            item.type === "lost"
                                ? "寻物"
                                : "招领"
                        }

                    </span>


                    <span
                        class="status-badge"
                    >

                        ${escapeHtml(
                            item.status
                        )}

                    </span>


                    ${
                        item.mine

                            ? `

                            <span class="mine-badge">

                                我的发布

                            </span>

                            `

                            : ""
                    }

                </div>


                <h1>

                    ${escapeHtml(
                        item.title
                    )}

                </h1>


                <p class="detail-description">

                    ${escapeHtml(
                        item.description
                    )}

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
                            ${escapeHtml(
                                item.contact
                            )}
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

                            ✓ 这条信息已经完成，
                            无需继续联系发布者。

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


                ${
                    item.mine &&
                    !completed

                        ? `

                        <div class="owner-panel">

                            <span>
                                发布者操作
                            </span>

                            <p>
                                如果这条信息已经处理完成，
                                可以及时更新状态。
                            </p>

                            <button
                                class="status-button owner-status-button"
                                id="detailComplete"
                                type="button"
                            >

                                ✓ ${finishText}

                            </button>

                        </div>

                        `

                        : ""
                }

            </div>

        </article>

        `;


        document
            .getElementById(
                "detailBack"
            )
            .onclick =
            function () {

                if (
                    history.length > 1
                ) {

                    history.back();

                }

                else {

                    go("home");

                }

            };


        document
            .getElementById(
                "copyContact"
            )
            .onclick =
            function () {

                copyContact(
                    item.contact
                );

            };


        const contactButton =
            document.getElementById(
                "contactButton"
            );


        if (contactButton) {

            contactButton.onclick =
                function () {

                    copyContact(
                        item.contact
                    );

                };

        }


        const completeButton =
            document.getElementById(
                "detailComplete"
            );


        if (completeButton) {

            completeButton.onclick =
                function () {

                    const wasLost =
                        item.type === "lost";


                    const message =
                        wasLost

                            ? "确认已经找到这个物品吗？"

                            : "确认物品已经归还失主吗？";


                    if (
                        !window.confirm(message)
                    ) {

                        return;
                    }


                    item.status =
                        Core.statusFor(
                            item.type,
                            true
                        );


                    saveItems();


                    showToast(
                        "状态更新成功"
                    );


                    renderDetail(
                        params
                    );

                };

        }
    }


    function copyContact(contact) {

        if (
            navigator.clipboard &&
            navigator.clipboard.writeText
        ) {

            navigator.clipboard
                .writeText(contact)

                .then(

                    function () {

                        showToast(
                            "联系方式已复制"
                        );

                    }

                )

                .catch(

                    function () {

                        fallbackCopy(
                            contact
                        );

                    }

                );

        }

        else {

            fallbackCopy(
                contact
            );

        }
    }


    function fallbackCopy(text) {

        const area =
            document.createElement(
                "textarea"
            );


        area.value =
            text;


        area.style.position =
            "fixed";


        area.style.opacity =
            "0";


        document.body
            .appendChild(area);


        area.select();


        document.execCommand(
            "copy"
        );


        area.remove();


        showToast(
            "联系方式已复制"
        );
    }


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
            route.page === "publish"
        ) {

            renderPublish(
                route.params
            );

        }

        else if (
            route.page === "success"
        ) {

            renderSuccess();

        }

        else if (
            route.page === "mine"
        ) {

            renderMine();

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


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });
    }


    window.addEventListener(

        "hashchange",

        render

    );


    render();

})();