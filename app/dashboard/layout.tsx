import Bar from './component/bars'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Bar/>
      {children}
    </div>
  )
}