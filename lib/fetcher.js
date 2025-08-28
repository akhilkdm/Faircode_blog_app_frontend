import axios from "axios";
const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
export const api = axios.create({ baseURL: backend });
export default function fetcher(url) {
  return api.get(url).then((r) => r.data);
}
