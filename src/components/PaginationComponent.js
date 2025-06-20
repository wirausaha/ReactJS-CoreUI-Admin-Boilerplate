/* =====================================================
|   PaginationComponent.Js
|   Mengelola data pengguna
|   Ditulis oleh : Fajrie R Aradea
|   Lisensi : Freeware
========================================================*/
import React from 'react'
import {
  CPagination,
  CPaginationItem,
} from '@coreui/react'

const PaginationComponent = ({ page, setPage, maxPage, pagesPerGroup }) => {
  const startPage = Math.floor((page - 1) / pagesPerGroup) * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, maxPage);

  return (
    <CPagination aria-label="Page navigation">
      <CPaginationItem style={{cursor: "pointer"}} onClick={() => setPage(page - 1)} disabled={page === 1}>
        Prev
      </CPaginationItem>

      {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((num) => (
        <CPaginationItem style={{cursor: "pointer"}}
          key={num}
          onClick={() => setPage(num)}
          className={page === num ? "active" : ""}
        >
          {num}
        </CPaginationItem>
      ))}

      {endPage < maxPage && (
        <CPaginationItem style={{cursor: "pointer"}} onClick={() => setPage(endPage + 1)}>
          ...
        </CPaginationItem>
      )}

      <CPaginationItem style={{cursor: "pointer"}} onClick={() => setPage(page + 1)} disabled={page === maxPage}>
        Next
      </CPaginationItem>
    </CPagination>
  );
};

export default PaginationComponent;
