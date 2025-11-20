import { useState } from 'react';
import { User, Mail, Calendar, Award, BookOpen, Edit3, Save, X } from 'lucide-react';

const ProfilePage = () => {
  const [user, setUser] = useState(() => {
    // Initialize user data from localStorage
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(() => {
    // Initialize edit data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      return {
        name: parsedUser.name || '',
        email: parsedUser.email || ''
      };
    }
    return { name: '', email: '' };
  });

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel edit - reset data
      setEditData({
        name: user?.name || '',
        email: user?.email || ''
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Update user data
    const updatedUser = {
      ...user,
      name: editData.name,
      email: editData.email
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsEditing(false);

    // TODO: Add API call to update user profile
    // await fetch(`http://localhost:3000/api/users/${user.id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(editData)
    // });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-indigo-500 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-200 mb-2">My Profile</h1>
              <p className="text-slate-400">Manage your account settings and preferences</p>
            </div>
            <button
              onClick={handleEditToggle}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/60 border border-slate-600 text-slate-200 rounded-lg hover:bg-slate-700 transition-colors"
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-8 shadow-lg backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-slate-200 mb-6">Profile Information</h2>
              
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-700/30 border border-slate-700 rounded-lg">
                      <User className="w-5 h-5 text-slate-500" />
                      <span className="text-slate-200">{user.name}</span>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-700/30 border border-slate-700 rounded-lg">
                      <Mail className="w-5 h-5 text-slate-500" />
                      <span className="text-slate-200">{user.email}</span>
                    </div>
                  )}
                </div>

                {/* Member Since */}
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Member Since
                  </label>
                  <div className="flex items-center gap-3 px-4 py-3 bg-slate-700/30 border border-slate-700 rounded-lg">
                    <Calendar className="w-5 h-5 text-slate-500" />
                    <span className="text-slate-200">
                      {new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              {isEditing && (
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleSave}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-indigo-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-indigo-600 transition-all shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Activity Summary */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 shadow-lg backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-slate-200 mb-4">Activity Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-green-400" />
                    <span className="text-slate-300 text-sm">Resources Viewed</span>
                  </div>
                  <span className="text-slate-200 font-semibold">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-indigo-400" />
                    <span className="text-slate-300 text-sm">Resources Shared</span>
                  </div>
                  <span className="text-slate-200 font-semibold">3</span>
                </div>
              </div>
            </div>

            {/* Achievements Card */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 shadow-lg backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-slate-200 mb-4">Achievements</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <Award className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="text-sm font-medium text-green-300">Welcome Aboard!</div>
                    <div className="text-xs text-green-400/80">Joined EcoMealHub</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  <div>
                    <div className="text-sm font-medium text-indigo-300">Knowledge Seeker</div>
                    <div className="text-xs text-indigo-400/80">Viewed 10+ resources</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
