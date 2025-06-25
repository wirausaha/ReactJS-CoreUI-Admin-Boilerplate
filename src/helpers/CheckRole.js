import apiInstance from "./Api";

export const checkUserRole = async () => {
  try {
    const res = await apiInstance.get("/api/user/getmyrole");
    if (res.data.success) {
      return res.data.role;
    }
  } catch (err) {
    console.error("Gagal ambil role:", err);
  }
  return null;
};
