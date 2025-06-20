/* =====================================================
|   Api.Js
|
|   Lisensi : Freeware
========================================================*/
import axios from "axios";

const apiInstance = axios.create({
  baseURL:  import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json", // Default untuk semua request
  },
});

const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL ,
});


// **Flag untuk mencegah banyak request refresh bersamaan**
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

apiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Ambil token dari storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Tambahkan ke setiap request
  }
  return config;
});

// **Interceptor untuk menangani token kadaluarsa**
apiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Jika token kadaluarsa (401)
    if (error.response && error.response.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const rememberme = localStorage.getItem("rememberme") ?? "false";
          const rem = (rememberme === "true") ? true : false;
          const refreshResponse = await axios.post("http://localhost:5230/api/auth/refreshtoken", {
            accessToken: localStorage.getItem("token") ?? "",
            refreshToken: localStorage.getItem("refreshtoken") ?? "",
            rememberme: rem,
          });

          if (refreshResponse.data.success) {
            alert("Berhasil Refresh token");
            // console.log(refreshResponse.data.token);
            localStorage.setItem("token", refreshResponse.data.token);
            localStorage.setItem("refreshtoken", refreshResponse.data.refreshtoken);

            // Beri tahu semua request yang tertunda bahwa token baru tersedia
            onTokenRefreshed(refreshResponse.data.token);

            isRefreshing = false;

            // Kirim ulang request yang gagal
            originalRequest.headers["Authorization"] = `Bearer ${refreshResponse.data.token}`;
            return apiInstance(originalRequest);
          } else {
            //alert("Gagal refresh token 2:", refreshError);
            window.location.href = "/login"; // Redirect jika gagal refresh
          }
        } catch (refreshError) {
          //alert("Gagal refresh token:", refreshError);
          console.error("Gagal refresh token 1:", refreshError);
          window.location.href = "/login";
        }
      } else {
        // Jika sudah ada refresh token berjalan, tunggu sampai selesai
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            resolve(apiInstance(originalRequest));
          });
        });
      }
    }

    return Promise.reject(error);
  }
);

export default apiInstance;
