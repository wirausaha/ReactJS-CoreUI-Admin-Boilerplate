/* =====================================================
|   Komponen UserTable.Jsx
|   Komponnen untuk meng-overide password kalau pengguna lupa passwordnya
|   Ditulis oleh : Fajrie R Aradea
|   Lisensi : Freeware
========================================================*/

import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import {  FaEye, FaTrash, FaUnlock } from "react-icons/fa"; // Contoh menggunakan react-icons
import usePagination from "../../hooks/usePagination";
import { debounce, set } from "lodash"; // membatasi waktu pengetikan

import CIcon from '@coreui/icons-react'
import { cilPlus, cilPencil, cilUser,  cilCloudDownload, cilSave, cilActionUndo } from '@coreui/icons'

import defaultData from './id'
import PaginationComponent from '../../components/PaginationComponent';

// Column Definitions
const columnHelper = createColumnHelper()
import { CTableHead } from '@coreui/react'

const UserTable = ({ isOveriding, isEditing, isViewProfile, table, limit, setSelectedRow, handleRowClick, page, setPage, maxPage }) => {
  const showTable = ! (isEditing || isOveriding || isViewProfile);
  if (!showTable) return null;

  return (
    <div style={{ marginBottom: "10px" }}>
      <table className="table table-small table-bordered table-hover">
        <CTableHead color="light">
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id}>
              {group.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </CTableHead>
        <tbody>
          {table.getRowModel().rows.slice(0, limit).map((row) => (
            <tr
              key={row.id}
              onClick={(e) => setSelectedRow(e.currentTarget)}
              style={{ cursor: "pointer" }}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  onClick={() => handleRowClick(cell.row.original)}
                  style={{ cursor: "pointer" }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <PaginationComponent page={page} setPage={setPage} maxPage={maxPage} pagesPerGroup={10} />
    </div>
  );
};

export default UserTable;
