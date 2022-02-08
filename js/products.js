import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js";
const apiUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "mingyo";

let ProductModal = "";
let delProductModal = "";

const app = createApp({
  data() {
    return {
      products: [],
      isNew: false,
      tempProduct: {
        imagesUrl:[],
      },
    }
  },
  methods: {
    // 登入驗證
    checkAdmin() {
      const url = `${apiUrl}/api/user/check`;
      axios
        .post(url)
        .then(() => {
          this.getData();
        })
        .catch((err) => {
          alert(err.data.message);
          window.location = "index.html";
        });
    },

    //取得產品資料
    getData() {
      const url = `${apiUrl}/api/${apiPath}/admin/products`;
      axios
        .get(url)
        .then((res) => {
          this.products = res.data.products;
          console.log(this.products);
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },

    // 開啟 modal畫面
    openModal(status, item) {
      if (status === "new") {
        this.tempProduct = {
          imagesUrl:[],
        };
        this.isNew = true;
        ProductModal.show();
        console.log(this.isNew);
      }else if(status === "edit"){
        this.tempProduct = {...item};
        this.isNew = false;
        ProductModal.show();
        console.log(this.tempProduct);
      }else if(status === "delete"){
        this.tempProduct = {...item};
        delProductModal.show();
        console.log(this.tempProduct);
      }
    },

    // 新增 & 編輯產品
    updateProduct() {
      let url = `${apiUrl}/api/${apiPath}/admin/product`;
      let http = "post";

      if(!this.isNew){
        url = `${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`;
        http = "put";
      }
      axios[http](url,{data:this.tempProduct})
      .then((res)=>{
        alert(res.data.message);
        ProductModal.hide();
        this.getData();
      })
      .catch((err)=>{
        alert(err.data.message);
      });
    },

    // 刪除產品
    delProduct() {
      const url = `${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`;

      axios.delete(url)
      .then((res)=>{
        alert(res.data.message);
        delProductModal.hide();
        this.getData();
      })
      .catch((err)=>{
        alert(err.data.message);
      });
    }
  },
  mounted() {
    // 將token 存到 Cookie
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common["Authorization"] = token;

    // check api 驗證
    this.checkAdmin();

    // 建立 bootstrap Modal
    ProductModal = new bootstrap.Modal(
      document.querySelector("#productModal"),
      { keyboard: false, backdrop: "static" }
    );
    delProductModal = new bootstrap.Modal(
      document.querySelector("#delProductModal"),
      { keyboard: false, backdrop: "static" }
    );
  },
});

//掛載
app.mount("#app");
