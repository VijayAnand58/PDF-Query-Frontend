import axios from "axios"

const API = axios.create({
  baseURL: "https://pdf-quey.azurewebsites.net",
  withCredentials: true,         
})

export default API