(function (root, factory) {

    const api = factory();

    if (root) {
        root.LostFoundCore = api;
    }

})(typeof globalThis !== "undefined" ? globalThis : this, function () {

    "use strict";


    // 把文字统一转换成便于搜索比较的形式
    function normalize(value) {

        return String(value == null ? "" : value)
            .trim()
            .toLowerCase();
    }


    // 把一条失物信息中可以搜索的内容组合起来
    function searchableText(item) {

        return [
            item.title,
            item.category,
            item.location,
            item.description,
            item.type === "lost" ? "寻物" : "招领"
        ]
            .map(normalize)
            .join(" ");
    }


    // 搜索与筛选核心函数
    function filterItems(items, filters) {

        const source = Array.isArray(items) ? items : [];

        const query =
            normalize(filters && filters.query);

        const type =
            normalize(filters && filters.type);

        const category =
            normalize(filters && filters.category);

        const location =
            normalize(filters && filters.location);


        return source.filter(function (item) {

            // 关键词搜索
            if (
                query &&
                !searchableText(item).includes(query)
            ) {
                return false;
            }


            // 寻物 / 招领筛选
            if (
                type &&
                type !== "all" &&
                item.type !== type
            ) {
                return false;
            }


            // 分类筛选
            if (
                category &&
                category !== "all" &&
                normalize(item.category) !== category
            ) {
                return false;
            }


            // 地点筛选
            if (
                location &&
                !normalize(item.location).includes(location)
            ) {
                return false;
            }


            return true;

        });

    }


    // 自动得到当前数据中的所有物品分类
    function uniqueCategories(items) {

        return Array.from(

            new Set(

                (items || [])
                    .map(function (item) {
                        return item.category;
                    })
                    .filter(Boolean)

            )

        ).sort();

    }


    return {

        normalize: normalize,

        filterItems: filterItems,

        uniqueCategories: uniqueCategories

    };

});