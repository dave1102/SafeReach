export default function GlassCard({ children, className = '', as: Tag = 'div', ...props }) {
  return (
    <Tag className={`glass-card p-5 animate-fadeUp ${className}`} {...props}>
      {children}
    </Tag>
  )
}
