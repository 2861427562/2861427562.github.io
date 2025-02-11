export default function Avatar({ src, size = 'md' }) {
  // 修改默认头像地址为 SVG
  const defaultAvatarSrc = '/default-avatar.svg'
  
  // 定义不同尺寸的类名映射
  const sizeClasses = {
    'sm': 'w-8 h-8',
    'md': 'w-12 h-12',
    'lg': 'w-16 h-16'
  }

  return (
    <div className={`relative inline-block ${sizeClasses[size] || sizeClasses.md}`}>
      <img 
        src={src || defaultAvatarSrc} 
        alt="用户头像"
        className="rounded-full w-full h-full object-cover"
        onError={(e) => {
          e.target.src = defaultAvatarSrc;
        }}
      />
    </div>
  )
} 