import { type ReactNode } from 'react';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

export default function Table<T extends { id: number }>({ data, columns, onEdit, onDelete }: TableProps<T>) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f3f4f6' }}>
            {columns.map((col) => (
              <th key={col.key} style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>
                {col.header}
              </th>
            ))}
            {(onEdit || onDelete) && <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} style={{ padding: '2rem', textAlign: 'center' }}>
                No hay datos
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                {columns.map((col) => (
                  <td key={col.key} style={{ padding: '0.75rem' }}>
                    {col.render ? col.render(item) : (item as Record<string, unknown>)[col.key]?.toString()}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td style={{ padding: '0.75rem' }}>
                    {onEdit && (
                      <button onClick={() => onEdit(item)} style={{ marginRight: '0.5rem', padding: '0.25rem 0.5rem', cursor: 'pointer' }}>
                        Editar
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(item)} style={{ padding: '0.25rem 0.5rem', cursor: 'pointer', color: '#dc2626' }}>
                        Eliminar
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}