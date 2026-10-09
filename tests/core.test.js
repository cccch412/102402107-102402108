const test = require("node:test");
const assert = require("node:assert/strict");
const Core = require("../assets/js/core.js");

const items = [
  { id:"1", type:"lost", title:"白色耳机", category:"数码", location:"图书馆二楼", description:"蓝色贴纸", status:"寻找中" },
  { id:"2", type:"found", title:"拾到校园卡", category:"校园卡", location:"第一教学楼", description:"陈同学", status:"等待认领" },
  { id:"3", type:"found", title:"折叠雨伞", category:"雨具", location:"图书馆门口", description:"深蓝色", status:"已归还" }
];

test("01 normalize 能去除首尾空格并忽略大小写",()=>assert.equal(Core.normalize("  AbC "),"abc"));
test("02 按关键词搜索标题",()=>assert.deepEqual(Core.filterItems(items,{query:"耳机"}).map(i=>i.id),["1"]));
test("03 关键词也能匹配地点",()=>assert.equal(Core.filterItems(items,{query:"图书馆"}).length,2));
test("04 按寻物类型筛选",()=>assert.deepEqual(Core.filterItems(items,{type:"lost"}).map(i=>i.id),["1"]));
test("05 按分类筛选",()=>assert.deepEqual(Core.filterItems(items,{category:"校园卡"}).map(i=>i.id),["2"]));
test("06 组合条件无结果时返回空数组",()=>assert.deepEqual(Core.filterItems(items,{type:"lost",category:"雨具"}),[]));
test("07 缺少必填项时校验失败",()=>assert.equal(Core.validateItem({}).valid,false));
test("08 过短描述会被拒绝",()=>{const r=Core.validateItem({type:"lost",title:"耳机",category:"数码",date:"2026-10-01",location:"图书馆",description:"丢了",contact:"13800138000"});assert.equal(r.errors.description,"描述至少填写 5 个字")});
test("09 非法联系方式会被拒绝",()=>{const r=Core.validateItem({type:"lost",title:"耳机",category:"数码",date:"2026-10-01",location:"图书馆",description:"遗失白色耳机",contact:"123"});assert.ok(r.errors.contact)});
test("10 有效手机号可通过校验",()=>assert.equal(Core.validateItem({type:"lost",title:"耳机",category:"数码",date:"2026-10-01",location:"图书馆",description:"遗失白色耳机",contact:"13800138000"}).valid,true));
test("11 有效邮箱可通过校验",()=>assert.equal(Core.validateItem({type:"found",title:"校园卡",category:"校园卡",date:"2026-10-01",location:"一教",description:"捡到一张校园卡",contact:"user@example.com"}).valid,true));
test("12 新建寻物信息默认状态为寻找中",()=>{const r=Core.buildItem({type:"lost",title:"耳机",category:"数码",date:"2026-10-01",location:"图书馆",description:"遗失白色耳机",contact:"13800138000"},1000);assert.equal(r.item.status,"寻找中");assert.equal(r.item.mine,true)});
test("13 新建招领信息默认状态为等待认领",()=>{const r=Core.buildItem({type:"found",title:"校园卡",category:"校园卡",date:"2026-10-01",location:"一教",description:"捡到一张校园卡",contact:"user@example.com"},1001);assert.equal(r.item.status,"等待认领")});
test("14 寻物信息可以切换到已找到并恢复",()=>{const first=Core.toggleStatus(items[0]);assert.equal(first.status,"已找到");assert.equal(Core.toggleStatus(first).status,"寻找中")});
test("15 招领信息可以切换到已归还",()=>assert.equal(Core.toggleStatus(items[1]).status,"已归还"));
test("16 分类去重并按名称排序",()=>assert.deepEqual(Core.uniqueCategories(items),["数码","校园卡","雨具"]));
test("17 默认可筛出进行中的信息",()=>assert.deepEqual(Core.filterItems(items,{status:"active"}).map(i=>i.id),["1","2"]));
test("18 可单独筛出已完成的信息",()=>assert.deepEqual(Core.filterItems(items,{status:"done"}).map(i=>i.id),["3"]));
test("19 状态和类型可以组合筛选",()=>assert.deepEqual(Core.filterItems(items,{status:"active",type:"found"}).map(i=>i.id),["2"]));
test("20 新建信息可以保存可选的真实照片",()=>{const image="data:image/jpeg;base64,abc";const r=Core.buildItem({type:"lost",title:"耳机",category:"数码",date:"2026-10-01",location:"图书馆",description:"遗失白色耳机",contact:"13800138000",image},1002);assert.equal(r.item.image,image)});
test("21 新建信息最多保存四张真实照片",()=>{const images=Array.from({length:5},(_,i)=>`data:image/jpeg;base64,${i}`);const r=Core.buildItem({type:"lost",title:"耳机",category:"数码电子",date:"2026-10-01",location:"图书馆",description:"遗失白色耳机",contact:"13800138000",images},1003);assert.equal(r.item.images.length,4);assert.equal(r.item.image,images[0])});
test("22 新建信息允许不上传照片",()=>{const r=Core.buildItem({type:"lost",title:"耳机",category:"数码电子",date:"2026-10-01",location:"图书馆",description:"遗失白色耳机",contact:"13800138000"},1004);assert.deepEqual(r.item.images,[]);assert.equal(r.item.image,"")});
test("23 新建信息可以保存一张照片",()=>{const image="data:image/png;base64,one";const r=Core.buildItem({type:"found",title:"钥匙",category:"钥匙",date:"2026-10-01",location:"一教",description:"捡到一串钥匙",contact:"user@example.com",images:[image]},1005);assert.deepEqual(r.item.images,[image])});
test("24 新建信息可以完整保存四张照片",()=>{const images=Array.from({length:4},(_,i)=>`data:image/jpeg;base64,four-${i}`);const r=Core.buildItem({type:"found",title:"雨伞",category:"雨具",date:"2026-10-01",location:"二教",description:"捡到蓝色雨伞",contact:"13800138000",images},1006);assert.deepEqual(r.item.images,images)});
test("25 非图片数据不会进入照片列表",()=>{const valid="data:image/jpeg;base64,ok";const r=Core.buildItem({type:"lost",title:"书本",category:"学习用品",date:"2026-10-01",location:"图书馆",description:"遗失一本教材",contact:"13800138000",images:["https://example.com/a.jpg",valid,"plain-text"]},1007);assert.deepEqual(r.item.images,[valid])});
