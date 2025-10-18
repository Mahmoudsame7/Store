import selectedEnv from "../Configurations/env";



export default endpoints = {
  Login: selectedEnv.BASE_URL + "auth/login",
  User: selectedEnv.BASE_URL + "auth/me",
  Products: selectedEnv.BASE_URL + "products",
  Categories: selectedEnv.BASE_URL + "products/category-list",
  ProductByCategory: selectedEnv.BASE_URL + "products/category/",
  DeleteProduct: selectedEnv.BASE_URL + "products/",
}