import type { ReactNode } from "react";

export type Column<T> = {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
};

export function DataTable<T extends { id: string | number }>({
  columns,
  rows,
  emptyMessage = "No hay registros para mostrar.",
}: {
  columns: Column<T>[];
  rows: T[];
  emptyMessage?: string;
}) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead><tr>{columns.map((column) => <th className={column.className} key={column.key}>{column.header}</th>)}</tr></thead>
        <tbody>
          {rows.map((row) => <tr key={row.id}>{columns.map((column) => <td className={column.className} key={column.key}>{column.cell(row)}</td>)}</tr>)}
        </tbody>
      </table>
      {!rows.length && <div className="table-empty">{emptyMessage}</div>}
    </div>
  );
}
