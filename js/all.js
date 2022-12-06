// console.log("hello");
// console.log(api_path, token);

//顯示產品列表
const productList = document.querySelector(".productWrap");
const productSelect = document.querySelector(".productSelect");
const cartList = document.querySelector(".shoppingCart-tableList");
// 測試productWrap是否有監聽到
// 初始化資料，持續新增資料，須建立空陣列
let productData = [];
let cartData = [];
// 初始化資料
function init() {
  getProductList();
  getCartList();
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
      renderProductList();
    });
}

function renderProductList() {
  let str = "";
  productData.forEach(function (item) {
    // 透過在網頁用productDAta資料裡埋按鈕位置id用item.id來讀取
    str += `     
    <li class="productCard">
    <h4 class="productType">新品</h4>
    <img src=${item.images}
        alt="">
    <a href="#"  class="addCardBtn" data-cartId="js-addCart" data-id="${item.id}">加入購物車</a>
    <h3>${item.title}</h3>
    <del class="originPrice">NT$${item.origin_price}</del>
    <p class="nowPrice">NT$${item.price}</p>
    </li>`;
  });
  productList.innerHTML = str;
}

// 將重複foreach顯示商品資料重構組合
function conbineProductHtmlItem(item) {
  return `     
  <li class="productCard">
  <h4 class="productType">新品</h4>
  <img src=${item.images}
      alt="">
  <a href="#"  class="addCardBtn" data-cartId="js-addCart" data-id="${item.id}">加入購物車</a>
  <h3>${item.title}</h3>
  <del class="originPrice">NT$${item.origin_price}</del>
  <p class="nowPrice">NT$${item.price}</p>
  </li>`;
}
// ***監聽寫在外層，innerHTML部分寫在內層
// 監聽下拉是選單
productSelect.addEventListener("change", function (e) {
  console.log(e.target.value);
  const category = e.target.value;
  if (category == "全部") {
    renderProductList();
    return;
  }
  let str = "";
  productData.forEach(function (item) {
    if (item.category == category) {
      str += conbineProductHtmlItem(item);
    }
  });
  productList.innerHTML = str;
});
// 點選加入購物車會顯示
// 先將ul列表綁監聽，讀取按鈕位置ID
productList.addEventListener("click", function (e) {
  // 取消點選按鈕後預設值
  e.preventDefault();
  // 讀取按鈕位置ID
  //console.log(e.target.getAttribute("data-id"));
  // 宣告點選按鈕class
  let addCartClass = e.target.getAttribute("data-cartId");
  // 若點選按鈕class值不是js-addCart就結束
  if (addCartClass !== "js-addCart") {
    alert("test");
    return;
  }
  // 點擊後ID
  let productId = e.target.getAttribute("data-id");
  console.log(productId);

  //  加入購物車典籍後，確認id是否依樣，依樣則數量相加，不一樣則新增一筆資料
  let numCheck = 1;
  cartData.forEach(function (item) {
    // 購物車資料ID及點擊後ID是否相同
    if (item.product.id === productId) {
      numCheck = item.quantity += 1;
    }
  });
  console.log(numCheck);

  axios
    .post(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,
      {
        data: {
          productId: productId,
          quantity: numCheck,
        },
      }
    )
    .then(function (response) {
      //console.log(response);
      alert("加入購物車");
      // 重新渲染
      getCartList();
    });
});

// 取得購物車資料
function getCartList() {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`
    )
    .then(function (response) {
      // 總金額值
      //console.log(response.data.finalTotal);
      document.querySelector(".js-total").textContent =
        response.data.finalTotal;
      //console.log(response.data);
      cartData = response.data.carts;
      let str = "";
      cartData.forEach(function (item) {
        str += `<tr>
        <td>
            <div class="cardItem-title">
                <img src=${item.product.images} alt="">
                <p>${item.product.title}</p>
            </div>
        </td>
        <td>NT$${item.product.price}</td>
        <td>${item.quantity}</td>
        <td>NT$${item.product.price * item.quantity}</td>
        <td class="discardBtn">
            <a href="#" class="material-icons" data-id="${item.id}">
                clear
            </a>
        </td>
    </tr>`;
      });

      cartList.innerHTML = str;
    });
}

// 讀取刪除按鈕，監聽
cartList.addEventListener("click", function (e) {
  e.preventDefault();
  // 取得按鈕刪除語法
  console.log(e.target);
  // 撈取購物車資料id非商品資料id
  const cartId = e.target.getAttribute("data-id");
  if (cartId == null) {
    alert("你點到其他地方");
    return;
  }
  console.log(cartId);
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`
    )
    .then(function (response) {
      alert("刪除單筆購物車資料");
      getCartList();
    });
});

const discardAllBtn = document.querySelector(".discardAllBtn");
discardAllBtn.addEventListener("click", function (e) {
  e.preventDefault();
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`
    )
    .then(function (response) {
      alert("刪除全部購物車資料");
      getCartList();
    })
    .catch(function (response) {
      alert("購物車已清空，請勿重複點擊");
    });
});

// 送出訂單
const orderInfoBtn = document.querySelector(".orderInfo-btn");
orderInfoBtn.addEventListener("click", function (e) {
  e.preventDefault();
  //console.log("你被點");
  if (cartData.length == 0) {
    alert("請加入購物車");
    return;
  }

  const customerName = document.querySelector("#customerName").value;
  const customerPhone = document.querySelector("#customerPhone").value;
  const customerEmail = document.querySelector("#customerEmail").value;
  const customerAddress = document.querySelector("#customerAddress").value;
  const customerTradeWay = document.querySelector("#tradeWay").value;

  if (
    customerName == "" ||
    customerPhone == "" ||
    customerEmail == "" ||
    customerAddress == "" ||
    customerTradeWay == ""
  ) {
    alert("請輸入正確訂單資訊");
    return;
  }

  axios
    .post(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,
      {
        data: {
          user: {
            name: customerName,
            tel: customerPhone,
            email: customerEmail,
            address: customerAddress,
            payment: customerTradeWay,
          },
        },
      }
    )
    .then(function (response) {
      alert("訂單建立成功");
      document.querySelector("#customerName").value = "";
      document.querySelector("#customerPhone").value = "";
      document.querySelector("#customerEmail").value = "";
      document.querySelector("#customerAddress").value = "";
      document.querySelector("#tradeWay").value = "ATM";
      getCartList();
    })
    .catch(function (response) {
      alert("訂單已送出，請勿重複點擊");
    });
});
