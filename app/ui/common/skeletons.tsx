import { ReactNode } from "react";

export function RowSkeleton({ ncolumns, nbuttons } : { ncolumns: number, nbuttons?: number }) {
  return (
    <tr className="w-full border-b border-gray-100 last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
      {Array(ncolumns - (nbuttons != null ? 1 : 0)).fill(undefined).map((_, index) => (
        <td key={index} className="whitespace-nowrap px-3 py-3">
          <div className="h-6 w-32 rounded bg-gray-100"></div>
        </td>
      ))}
      
      {nbuttons != null && 
        <td className="whitespace-nowrap py-3 pl-6 pr-3">
          <div className="flex justify-end gap-3">
            {Array(nbuttons).fill(undefined).map((_, index) => (
              <div key={index} className="h-6 w-6 rounded bg-gray-100"></div>
            ))}
          </div>
        </td>
      }
      
    </tr>
  );
}

export function MobileRowSkeleton() {
  return (
    <div className="mb-2 w-full rounded-md bg-white p-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-8">
        <div className="flex items-center">
          <div className="mr-2 h-8 w-8 rounded-full bg-gray-100"></div>
          <div className="h-6 w-16 rounded bg-gray-100"></div>
        </div>
        <div className="h-6 w-16 rounded bg-gray-100"></div>
      </div>
      <div className="flex w-full items-center justify-between pt-4">
        <div>
          <div className="h-6 w-16 rounded bg-gray-100"></div>
          <div className="mt-2 h-6 w-24 rounded bg-gray-100"></div>
        </div>
        <div className="flex justify-end gap-2">
          <div className="h-10 w-10 rounded bg-gray-100"></div>
          <div className="h-10 w-10 rounded bg-gray-100"></div>
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ columns, nbuttons, mobileSkeleton = MobileRowSkeleton} : {
  columns: string[],
  nbuttons?: number
  mobileSkeleton?: (props: any) => ReactNode
}) {
  return (
    <div className="mt-6 flow-root overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {Array(6).fill(undefined).map((_, index) => (
              <MobileRowSkeleton key={index} />
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                {columns.map((column) => (
                  <th key={column} scope="col" className="px-4 py-5 font-medium">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {Array(6).fill(undefined).map((_, index) => (
                <RowSkeleton key={index} ncolumns={columns.length} nbuttons={nbuttons} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
