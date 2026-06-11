import axios from "axios";

const API = axios.create({
  baseURL: "https://task-manager-app-o71q.onrender.com/api",
});

export default API;