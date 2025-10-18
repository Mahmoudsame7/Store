import { Toast } from "toastify-react-native";
import Globals from "../Utils/Globals";
import customFetch from "./CustomFetch";
import Endpoints from "./Endpoints";

export const FetchProducts = async (page=1) => {
  const limit = 10;
  const skip = (page - 1) * limit;

  let response = await customFetch(Endpoints.Products + `?limit=${limit}&skip=${skip}&select=title,thumbnail`, {
    method: "GET",
    token: Globals.token
  });

  if(response?.message){
    throw new Error(response.message)
  }
  const totalPages = Math.ceil(response.total / limit);
  return {
    products: response.products,
    currentPage: page,
    totalPages,
  };
 
};


export const FetchCategories = async () => {
 
  let response = await customFetch(Endpoints.Categories, {
    method: "GET",
    token: Globals.token
  });

  if(response?.message){
    throw new Error(response.message)
  }
  
  return response;
 
};

export const FetchProductByCategory = async (category) => {
 
  let response = await customFetch(Endpoints.ProductByCategory+category, {
    method: "GET",
    token: Globals.token
  });

 
  if(response?.message){
    
    throw new Error(response.message)
  }
  
  return response;
 
};

export const DeleteProduct = async (id) => {
 
  let response = await customFetch(Endpoints.DeleteProduct+id, {
    method: "DELETE",
    token: Globals.token
  });

 
  if(response?.message){
    
    throw new Error(response.message)
  }

  return response;
 
};

