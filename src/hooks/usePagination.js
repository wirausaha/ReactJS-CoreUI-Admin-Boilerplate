/* =====================================================
|   usePagination.Js
|   Mengelola data pengguna
|   Lisensi : Freeware
========================================================*/
import { useState } from "react";

const usePagination = (initialPage, limit, totalRecords) => {
  const [page, setPage] = useState(initialPage);
  const [maxPage, setMaxPage] = useState(Math.ceil(totalRecords / limit));

  const nextPage = () => setPage((prev) => (prev < maxPage ? prev + 1 : prev));
  const prevPage = () => setPage((prev) => (prev > 1 ? prev - 1 : prev));

  return { page, maxPage, setMaxPage, setPage, nextPage, prevPage };
};

export default usePagination;
