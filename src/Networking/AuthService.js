import Globals from "../Utils/Globals";
import customFetch from "./CustomFetch";
import Endpoints from "./Endpoints";

export const Login = async (body) => {
  let response = await customFetch(Endpoints.Login, {
    method: "POST",
    bodyReq: body,
  });
  if(response.message){
    throw new Error(response.message)
  }
  return response;
};


export const LoadUser = async () => {
  let response = await customFetch(Endpoints.User, {
    method: "GET",
    token: Globals.token
  });
  if(response.message){
    throw new Error(response.message)
  }
  return response;
};