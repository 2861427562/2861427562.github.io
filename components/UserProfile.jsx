export default function UserProfile({ user }) {
  return (
    <div className="user-profile flex items-center bg-white p-6">
      <div className="avatar-wrapper">
        <Avatar 
          src={user?.avatar || undefined}
          size="lg"
        />
      </div>
      
      <div className="info-wrapper ml-[50px]"> {/* 严格保持50px间距 */}
        <div className="name-container border rounded p-3 mb-3 bg-gray-50">
          <h2 className="text-lg font-medium">
            {user?.name || '未设置昵称'}
          </h2>
        </div>
        
        <div className="bio-container border rounded p-3 bg-gray-50">
          <p className="text-gray-600">
            {user?.bio || '这个人很懒，还没有填写简介'}
          </p>
        </div>
      </div>
    </div>
  )
} 