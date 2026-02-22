import axios from "axios"

export default axios.create({
  baseURL: "https://localhost:7286/api"
})