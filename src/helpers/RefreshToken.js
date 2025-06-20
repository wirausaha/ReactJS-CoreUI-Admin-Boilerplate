/* =====================================================
|   RefreshToken.Js
|   Dimodifikasi oleh : Fajrie R Aradea
|   Lisensi : Freeware
========================================================*/
export const refreshToken = async () => { // Tambahkan 'async'
  try {
    const refreshToken = localStorage.getItem("refreshtoken") ?? "";
    const accessToken = localStorage.getItem("token") ?? "";
    const rememberMe = localStorage.getItem("rememberme") ?? "false";
    const rem = (rememberMe == "true");

    const response = await fetch("/api/auth/refreshtoken", { // Gunakan 'await'
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ accessToken, refreshToken, rememberme: rem }),
    });

    const data = await response.json(); // Tunggu JSON dikonversi

    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshtoken", data.refreshtoken);
      return data.token; // Return token baru
    } else {
      console.error("Refresh token error:", data.message);
      return null;
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};
