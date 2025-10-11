import axios from "axios"
import { PDF_BASE_URL } from "../config"; 

const API = axios.create({
  baseURL: PDF_BASE_URL,
  withCredentials: true,         
})

export default API