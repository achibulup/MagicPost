import Bar from '../ui/bars'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Bar/>
      {children}
    </div>
  )
}