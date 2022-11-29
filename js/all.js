// console.log("hello");
// console.log(api_path, token);

//顯示產品列表
const productList = document.querySelector(".productWrap");
// 測試productWrap是否有監聽到
// 初始化資料，持續新增資料，須建立空陣列
let productData = [];
// 初始化資料
function init() {
  getProductList();
}
init();

// 新增產品列表
function getProductList() {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`
    )
    .then(function (response) {
      //console.log(response.data);
      //   將資料新增productData
      productData = response.data.products;
      let str = "";
      productData.forEach(function (item) {
        str += `     
        <li class="productCard">
        <h4 class="productType">新品</h4>
        <img src=${item.images}
            alt="">
        <a href="#" class="addCardBtn">加入購物車</a>
        <h3>${item.title}</h3>
        <del class="originPrice">NT$${item.origin_price}</del>
        <p class="nowPrice">NT$${item.price}</p>
        </li>`;
      });
      productList.innerHTML = str;
    });
}
