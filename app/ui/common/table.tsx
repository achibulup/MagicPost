import { ReactNode } from 'react';

export const revalidate = 1;

export function BasicTable({ children }: { children: ReactNode }) {
  return (
    <div className="mt-6 overflow-x-auto align-middle">
      <div className="inline-block min-w-full rounded-md bg-gray-50 p-2 md:pt-0">
        {children}
      </div>
    </div>
  );
}

export function BasicDesktopTable({ columnTitles, rows }: { 
  columnTitles: ReactNode[],
  rows: { id: any, entries: ReactNode[] }[]
}) {
  return (
    <table className="hidden min-w-full rounded-md text-gray-900 md:table">
      <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
        <tr>
          {columnTitles.map((title, index) => (
            <th key={index} scope="col" className="px-4 py-5 font-medium sm:pl-6">
              {title}
            </th>
          ))}
        </tr>
        
      </thead>

      <tbody className="divide-y divide-gray-200 text-gray-900">
        {rows.map((row) => (
          <tr key={row.id} className="group">
            <td key={0} className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
              <p>{row.entries[0]}</p>
            </td>
            {row.entries.slice(1).map((entry, index) => (
              <td key={index + 1} className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                {entry}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>)
}