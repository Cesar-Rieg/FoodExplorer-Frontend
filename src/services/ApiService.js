import axios from "axios";

export const API = axios.create({
  baseURL: 'https://foodexplorer-3skd.onrender.com'
});