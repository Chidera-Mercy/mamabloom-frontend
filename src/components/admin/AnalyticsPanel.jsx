export const AnalyticsPanel = ({ stats }) => {
    if (!stats) return <div>Loading...</div>;
  
    return (
      <div>
        <h2 className="font-poppins text-2xl font-bold mb-6 text-[#013f40]">Analytics Overview</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <h3 className="font-poppins text-lg font-bold mb-4 text-[#013f40]">Top Resources</h3>
            <div className="space-y-4">
              {stats.topResources?.map(resource => (
                <div key={resource.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{resource.title}</h4>
                      <p className="text-sm text-gray-600">Type: {resource.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#013f40]">{resource.view_count}</p>
                      <p className="text-sm text-gray-600">views</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
  
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <h3 className="font-poppins text-lg font-bold mb-4 text-[#013f40]">Forum Activity</h3>
            <div className="space-y-4">
              {stats.forumActivity?.map(category => (
                <div key={category.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{category.name}</h4>
                      <p className="text-sm text-gray-600">
                        {category.thread_count} threads • {category.reply_count} replies
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#013f40]">{category.engagement_rate}%</p>
                      <p className="text-sm text-gray-600">engagement</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
  
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <h3 className="font-poppins text-lg font-bold mb-4 text-[#013f40]">User Growth</h3>
            <div className="h-64">
              {/* Add a chart component here if needed */}
            </div>
          </div>
  
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <h3 className="font-poppins text-lg font-bold mb-4 text-[#013f40]">Activity Overview</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">New Users (30d)</p>
                  <p className="text-2xl font-bold text-[#013f40]">{stats.newUsers30d}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Active Users (30d)</p>
                  <p className="text-2xl font-bold text-[#013f40]">{stats.activeUsers30d}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">New Threads (30d)</p>
                  <p className="text-2xl font-bold text-[#013f40]">{stats.newThreads30d}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">New Resources (30d)</p>
                  <p className="text-2xl font-bold text-[#013f40]">{stats.newResources30d}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
