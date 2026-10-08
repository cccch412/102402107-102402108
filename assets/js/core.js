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


        const ACTIVE_STATUS = {

            lost: "寻找中",

            found: "等待认领"

        };


        const DONE_STATUS = {

            lost: "已找到",

            found: "已归还"

        };


        function normalize(value) {

            return String(
                value == null ? "" : value
            )
                .trim()
                .toLowerCase();
        }


        function createId(now) {

            return (
                "item-" +
                Number(
                    now || Date.now()
                ).toString(36)
            );
        }


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


        function isCompleted(item) {

            return (
                item &&
                (
                    item.status === "已找到" ||
                    item.status === "已归还"
                )
            );
        }


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


                    if (
                        query &&
                        !searchableText(item)
                            .includes(query)
                    ) {

                        return false;
                    }


                    if (
                        type &&
                        type !== "all" &&
                        item.type !== type
                    ) {

                        return false;
                    }


                    if (
                        category &&
                        category !== "all" &&
                        normalize(item.category)
                            !== category
                    ) {

                        return false;
                    }


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


        function validateItem(draft) {

            const errors = {};


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


            if (
                !normalize(
                    draft &&
                    draft.title
                )
            ) {

                errors.title =
                    "请填写物品名称";
            }


            if (
                !normalize(
                    draft &&
                    draft.category
                )
            ) {

                errors.category =
                    "请选择物品分类";
            }


            if (
                !normalize(
                    draft &&
                    draft.date
                )
            ) {

                errors.date =
                    "请选择时间";
            }


            if (
                !normalize(
                    draft &&
                    draft.location
                )
            ) {

                errors.location =
                    "请填写地点";
            }


            if (
                normalize(
                    draft &&
                    draft.description
                ).length < 5
            ) {

                errors.description =
                    "描述至少填写 5 个字";
            }


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

                    mine: true,

                    createdAt:
                        stamp

                },

                errors: {}

            };
        }


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