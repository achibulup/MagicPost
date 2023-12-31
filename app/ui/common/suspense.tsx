// 'use client'

// import { DispatchWithoutAction, useEffect, useReducer, useState } from 'react'
// import { useRerender } from '@/app/ui/common/hooks'

// type Supplier<T> = (() => Promise<T>) | (() => T)

// export default function Suspense<T>({ fallback, main, supplier }: {
//   fallback: React.ReactNode,
//   main: (arg: { data: T, rerender?: DispatchWithoutAction, refresh?: DispatchWithoutAction}) => React.ReactNode,
//   supplier: Supplier<T>,
// }) {
//   const [data, setData] = useState<T | null>(null);
//   const [def, refresh] = useReducer((x: number) => x + 1, 0);
//   const rerender = useRerender();

//   useEffect(() => {
//     (async()=>{
//       setData(null);
//       const data = await supplier();
//       setData(data);
//     })();
//   }, [def])

//   if (data) {
//     return main({ data, rerender, refresh });
//   }
//   return fallback
// }