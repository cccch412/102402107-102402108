(function (root, factory) {

    const api = factory();

    if (
        typeof module === "object" &&
        module.exports
    ) {
        module.exports = api;
    }

    if (root) {
        root.LostFoundCore = api;
    }

})(
    typeof globalThis !== "undefined"
        ? globalThis
        : this,

    function () {

        "use strict";


        // =========================
        // 状态定义
        // =========================

        const ACTIVE_STATUS = {

            lost: "寻找中",

            found: "等待认领"

        };


        const DONE_STATUS = {

            lost: "已找到",

            found: "已归还"

        };


        // =========================
        // 字符串统一处理
        // =========================

        function normalize(value) {

            return String(
                value == null ? "" : value
            )
                .trim()
                .toLowerCase();
        }


        // =========================
        // 创建物品 ID
        // =========================

        function createId(now) {

            return (
                "item-" +
                Number(
                    now || Date.now()
                ).toString(36)
            );
        }


        // =========================
        // 根据类型获得状态
        // =========================

        function statusFor(
            type,
            completed
        ) {

            return (
                completed
                    ? DONE_STATUS
                    : ACTIVE_STATUS
            )[type] || "状态未知";
        }


        // =========================
        // 判断是否已经完成
        // =========================

        function isCompleted(item) {

            return (
                item &&
                (
                    item.status === "已找到" ||
                    item.status === "已归还"
                )
            );
        }


        // =========================
        // 组合用于搜索的文字
        // =========================

        function searchableText(item) {

            return [

                item.title,

                item.category,

                item.location,

                item.description,

                item.type === "lost"
                    ? "寻物"
                    : "招领"

            ]
                .map(normalize)
                .join(" ");
        }


        // =========================
        // 搜索和筛选
        // =========================

        function filterItems(
            items,
            filters
        ) {

            const source =
                Array.isArray(items)
                    ? items
                    : [];


            const query =
                normalize(
                    filters &&
                    filters.query
                );


            const type =
                normalize(
                    filters &&
                    filters.type
                );


            const category =
                normalize(
                    filters &&
                    filters.category
                );


            const location =
                normalize(
                    filters &&
                    filters.location
                );


            return source.filter(
                function (item) {


                    // 关键词搜索
                    if (
                        query &&
                        !searchableText(item)
                            .includes(query)
                    ) {

                        return false;
                    }


                    // 类型筛选
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
                        normalize(item.category)
                            !== category
                    ) {

                        return false;
                    }


                    // 地点筛选
                    if (
                        location &&
                        !normalize(item.location)
                            .includes(location)
                    ) {

                        return false;
                    }


                    return true;
                }
            );
        }


        // =========================
        // 发布信息表单校验
        // =========================

        function validateItem(draft) {

            const errors = {};


            // 信息类型
            if (
                !draft ||
                ![
                    "lost",
                    "found"
                ].includes(draft.type)
            ) {

                errors.type =
                    "请选择信息类型";
            }


            // 物品名称
            if (
                !normalize(
                    draft &&
                    draft.title
                )
            ) {

                errors.title =
                    "请填写物品名称";
            }


            // 分类
            if (
                !normalize(
                    draft &&
                    draft.category
                )
            ) {

                errors.category =
                    "请选择物品分类";
            }


            // 时间
            if (
                !normalize(
                    draft &&
                    draft.date
                )
            ) {

                errors.date =
                    "请选择时间";
            }


            // 地点
            if (
                !normalize(
                    draft &&
                    draft.location
                )
            ) {

                errors.location =
                    "请填写地点";
            }


            // 描述
            if (
                normalize(
                    draft &&
                    draft.description
                ).length < 5
            ) {

                errors.description =
                    "描述至少填写 5 个字";
            }


            // 联系方式
            const contact =
                normalize(
                    draft &&
                    draft.contact
                );


            const phoneValid =
                /^1\d{10}$/
                    .test(contact);


            const emailValid =
                /^[\w.-]+@[\w.-]+\.[a-z]{2,}$/i
                    .test(contact);


            if (
                !phoneValid &&
                !emailValid
            ) {

                errors.contact =
                    "请填写 11 位手机号或有效邮箱";
            }


            return {

                valid:
                    Object.keys(errors)
                        .length === 0,

                errors: errors

            };
        }


        // =========================
        // 根据表单生成新信息
        // =========================

        function buildItem(
            draft,
            now
        ) {

            const check =
                validateItem(draft);


            if (!check.valid) {

                return {

                    item: null,

                    errors:
                        check.errors

                };
            }


            const stamp =
                Number(
                    now || Date.now()
                );


            return {

                item: {

                    id:
                        createId(stamp),

                    type:
                        draft.type,

                    title:
                        String(
                            draft.title
                        ).trim(),

                    category:
                        String(
                            draft.category
                        ).trim(),

                    date:
                        draft.date,

                    location:
                        String(
                            draft.location
                        ).trim(),

                    description:
                        String(
                            draft.description
                        ).trim(),

                    contact:
                        String(
                            draft.contact
                        ).trim(),

                    status:
                        statusFor(
                            draft.type,
                            false
                        ),

                    // 表示这是当前用户发布的
                    mine: true,

                    createdAt:
                        stamp

                },

                errors: {}

            };
        }


        // =========================
        // 获取所有分类
        // =========================

        function uniqueCategories(items) {

            return Array.from(

                new Set(

                    (items || [])

                        .map(
                            function (item) {

                                return item.category;

                            }
                        )

                        .filter(Boolean)

                )

            ).sort();
        }


        // =========================
        // 对外提供的方法
        // =========================

        return {

            normalize:
                normalize,

            createId:
                createId,

            statusFor:
                statusFor,

            isCompleted:
                isCompleted,

            filterItems:
                filterItems,

            validateItem:
                validateItem,

            buildItem:
                buildItem,

            uniqueCategories:
                uniqueCategories

        };

    }
);