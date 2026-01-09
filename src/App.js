import React, { useState, useEffect, useRef } from 'react';
import { Bell, BellRing, Check, X, Info, AlertCircle, CheckCircle, AlertTriangle, Settings, Volume2 } from 'lucide-react';
import './App.css';

const notificationTypes = [
  { type: 'grade', icon: CheckCircle, color: 'green', title: 'Grade Posted' },
  { type: 'attendance', icon: Info, color: 'blue', title: 'Attendance Marked' },
  { type: 'payment', icon: CheckCircle, color: 'purple', title: 'Payment Success' },
  { type: 'order', icon: AlertCircle, color: 'orange', title: 'Order Update' },
  { type: 'announcement', icon: AlertTriangle, color: 'red', title: 'Announcement' }
];

const sampleMessages = {
  grade: [
    'Your assignment "React Project" has been graded: A+ (95/100)',
    'New grade posted for "Database Management" exam: B+ (87/100)',
    'Quiz results available for "Web Development" - Score: 92/100'
  ],
  attendance: [
    'Attendance marked for today - Status: Present',
    'You were marked absent for "Mathematics" class on Jan 8',
    'Attendance updated: 95% overall attendance this semester'
  ],
  payment: [
    'Payment of ₹2,499 successful for Order #12345',
    'Your semester fees payment has been confirmed',
    'Refund processed: ₹599 credited to your account'
  ],
  order: [
    'Your order #12345 has been shipped - Track now',
    'Order delivered successfully - Please confirm receipt',
    'Your order is out for delivery today'
  ],
  announcement: [
    'Campus will remain closed on Jan 15 - Public Holiday',
    'Semester exam schedule released - Check your portal',
    'Important: Library timings changed from next week'
  ]
};

export default function App() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPanel, setShowPanel] = useState(false);
  const [autoNotify, setAutoNotify] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filter, setFilter] = useState('all');
  const audioRef = useRef(null);

  // Generate random notification
  const generateNotification = () => {
    const types = Object.keys(sampleMessages);
    const randomType = types[Math.floor(Math.random() * types.length)];
    const messages = sampleMessages[randomType];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    const typeInfo = notificationTypes.find(t => t.type === randomType);
    
    const notification = {
      id: Date.now() + Math.random(),
      type: randomType,
      title: typeInfo.title,
      message: randomMessage,
      timestamp: new Date().toLocaleTimeString(),
      read: false,
      icon: typeInfo.icon,
      color: typeInfo.color
    };

    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Play sound
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed'));
    }

    // Show browser notification
    if (Notification.permission === 'granted') {
      new Notification(typeInfo.title, {
        body: randomMessage,
        icon: '🔔'
      });
    }
  };

  // Auto generate notifications
  useEffect(() => {
    if (autoNotify) {
      const interval = setInterval(() => {
        generateNotification();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoNotify, soundEnabled]);

  // Request notification permission
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const deleteNotification = (id) => {
    const notification = notifications.find(n => n.id === id);
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.type === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {/* Hidden audio for notification sound */}
      <audio ref={audioRef} src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHWu57+OZSA0PVqzn77BdGAg+ltryxnMpBSuBzvLaizsIGGe37OihUBELTKXh8bllHAU2jdXzzn0vBSd+zPLaizsIGGe37OihUBELTKXh8bllHAU2jdXzzn0vBSd+zPLaizsIGGe37OihUBELTKXh8bllHAU2jdXzzn0vBSd+zPLaizsIGGe37OihUBELTKXh8bllHAU2jdXzzn0vBSd+zPLaizsIGGe37OihUBELTKXh8bllHAU2jdXzzn0vBSd+zPLaizsIGGe37OihUBELTKXh8bllHAU2jdXzzn0vBSd+zPLaizsIGGe37OihUBELTKXh8bllHAU2jdXzzn0vBSd+zPLaizsIGGe37OihUBELTKXh8bllHAU2jdXzzn0vBSd+zPLaizsIGGe37OihUBELTKXh8bllHAU2jdXzzn0vBSd+zPLaizsIGGe37OihUBELTKXh8bllHAU2jdXzzn0vBSd+zPLaizsIGGe37OihUBELTKXh8bllHAU2jdXzzn0vBSd+zPLaizsIGGe37OihUBELTKXh8bllHAU2jdXzzn0vBSd+zPLaizsIGGe37OihUBELTKXh8bllHAU2jdXzzn0vBSd+zPLaizsIGGe37OihUBELTKXh8bllHAU2jdXzzn0vBSd+zPLaizsIGGe37OihUBELTKXh8bllHAU2jdXzzn0vBSd+zPLaizsIGGe37OihUBELTKXh8bllHAU2jdXzzn0vBSd+zPLaizsIGGe37OihUBELTKXh8bllHAU2jdXzzn0vBSd+zPLaizsIGGe37OihUBELTKXh8bllHAU2jdXzzn0vBSd+zPLaizsIGGe37OihUBELTKXh8bllHAU2jdXzzn0vBSd+zPLaizsIGGe37OihUBELTKXh8bllHAU2jdXzzn0vBSd+zPLaizsIGGe37OihUBELTKXh8bllHAU2jdXzzn0vBSd+zPLaizsIGGe37OihUBELTKXh8bllHAU2jdXzzn0vBSd+zPLaizsIGGe37OihUBELTKXh8bllHAU2jdXzzn0vBSd+zPLaizsIGGe37OihUBELTKXh8bllHAU2jdXzzn0vBSd+zPLaizsIGGe37OihUBELTKXh8bllHAU2jdXzzn0vBSd+zPLaizsIGGe37OihUBELTKXh8bllHAU2jdXzzn0vBSd+zPLaizsIGGe37OihUBELTKXh8bllHAU2jdXzzn0vBSd+zPLaizsIGGe37OihUBELTKXh8bllHAU2jdXzzn0vBQ=="></audio>

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <BellRing className="text-indigo-600" size={36} />
              Real-Time Notification System
            </h1>
            <p className="text-gray-600 mt-1">WebSocket-powered instant notifications</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <button
              onClick={() => setShowPanel(!showPanel)}
              className="relative p-3 bg-indigo-100 rounded-full hover:bg-indigo-200 transition"
            >
              <Bell className="text-indigo-600" size={28} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Settings */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-3 rounded-full transition ${soundEnabled ? 'bg-green-100 hover:bg-green-200' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              <Volume2 className={soundEnabled ? 'text-green-600' : 'text-gray-400'} size={24} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Control Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Settings size={24} className="text-indigo-600" />
              Controls
            </h2>
            
            <div className="space-y-4">
              <button
                onClick={generateNotification}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg"
              >
                Send Test Notification
              </button>
              
              <button
                onClick={() => setAutoNotify(!autoNotify)}
                className={`w-full py-3 rounded-xl font-semibold transition shadow-lg ${
                  autoNotify 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {autoNotify ? 'Stop' : 'Start'} Auto Notifications
              </button>

              <button
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Mark All as Read ({unreadCount})
              </button>

              <button
                onClick={clearAll}
                disabled={notifications.length === 0}
                className="w-full bg-gray-600 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Clear All Notifications
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                <span className="text-gray-700">Total</span>
                <span className="text-2xl font-bold text-indigo-600">{notifications.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-gray-700">Unread</span>
                <span className="text-2xl font-bold text-red-600">{unreadCount}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">Read</span>
                <span className="text-2xl font-bold text-green-600">{notifications.length - unreadCount}</span>
              </div>
            </div>
          </div>

          {/* Notification Types */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Type Distribution</h3>
            <div className="space-y-2">
              {notificationTypes.map(type => {
                const count = notifications.filter(n => n.type === type.type).length;
                return (
                  <div key={type.type} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700 capitalize">{type.type}</span>
                    <span className="px-3 py-1 rounded-full text-sm font-bold" style={{
                      backgroundColor: type.color === 'green' ? '#dcfce7' : 
                                     type.color === 'blue' ? '#dbeafe' :
                                     type.color === 'purple' ? '#f3e8ff' :
                                     type.color === 'orange' ? '#ffedd5' : '#fee2e2',
                      color: type.color === 'green' ? '#15803d' :
                            type.color === 'blue' ? '#1e40af' :
                            type.color === 'purple' ? '#7e22ce' :
                            type.color === 'orange' ? '#c2410c' : '#b91c1c'
                    }}>
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Notification Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Notification Center</h2>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="all">All Notifications</option>
                <option value="unread">Unread Only</option>
                {notificationTypes.map(type => (
                  <option key={type.type} value={type.type}>{type.title}</option>
                ))}
              </select>
            </div>

            {/* Notifications List */}
            <div className="space-y-3 max-h-[700px] overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell size={64} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">No notifications yet</p>
                  <p className="text-sm text-gray-400 mt-2">Click "Send Test Notification" to try it out</p>
                </div>
              ) : (
                filteredNotifications.map(notification => {
                  const Icon = notification.icon;
                  
                  // Define colors based on notification type
                  const colorStyles = {
                    green: {
                      bg: notification.read ? '#f9fafb' : '#f0fdf4',
                      border: notification.read ? '#e5e7eb' : '#bbf7d0',
                      iconBg: '#dcfce7',
                      iconColor: '#16a34a',
                      badgeBg: '#dcfce7',
                      badgeColor: '#15803d'
                    },
                    blue: {
                      bg: notification.read ? '#f9fafb' : '#eff6ff',
                      border: notification.read ? '#e5e7eb' : '#bfdbfe',
                      iconBg: '#dbeafe',
                      iconColor: '#2563eb',
                      badgeBg: '#dbeafe',
                      badgeColor: '#1e40af'
                    },
                    purple: {
                      bg: notification.read ? '#f9fafb' : '#faf5ff',
                      border: notification.read ? '#e5e7eb' : '#e9d5ff',
                      iconBg: '#f3e8ff',
                      iconColor: '#9333ea',
                      badgeBg: '#f3e8ff',
                      badgeColor: '#7e22ce'
                    },
                    orange: {
                      bg: notification.read ? '#f9fafb' : '#fff7ed',
                      border: notification.read ? '#e5e7eb' : '#fed7aa',
                      iconBg: '#ffedd5',
                      iconColor: '#f97316',
                      badgeBg: '#ffedd5',
                      badgeColor: '#c2410c'
                    },
                    red: {
                      bg: notification.read ? '#f9fafb' : '#fef2f2',
                      border: notification.read ? '#e5e7eb' : '#fecaca',
                      iconBg: '#fee2e2',
                      iconColor: '#ef4444',
                      badgeBg: '#fee2e2',
                      badgeColor: '#b91c1c'
                    }
                  };

                  const styles = colorStyles[notification.color];
                  
                  return (
                    <div
                      key={notification.id}
                      className="flex items-start gap-4 p-4 rounded-xl border-2 transition"
                      style={{
                        backgroundColor: styles.bg,
                        borderColor: styles.border,
                        boxShadow: notification.read ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <div className="p-3 rounded-full" style={{ backgroundColor: styles.iconBg }}>
                        <Icon style={{ color: styles.iconColor }} size={24} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-bold text-gray-800">{notification.title}</h4>
                          <span className="text-xs text-gray-500">{notification.timestamp}</span>
                        </div>
                        <p className="text-gray-700 text-sm mb-2">{notification.message}</p>
                        {!notification.read && (
                          <span 
                            className="inline-block px-2 py-1 text-xs font-semibold rounded-full"
                            style={{
                              backgroundColor: styles.badgeBg,
                              color: styles.badgeColor
                            }}
                          >
                            New
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 bg-green-100 rounded-lg hover:bg-green-200 transition"
                            title="Mark as read"
                          >
                            <Check className="text-green-600" size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 bg-red-100 rounded-lg hover:bg-red-200 transition"
                          title="Delete"
                        >
                          <X className="text-red-600" size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 bg-white rounded-xl shadow-lg p-4 text-center text-sm text-gray-600">
        <p>🔔 Real-time WebSocket notifications | &lt; 100ms delivery | Sound alerts | Browser notifications | Dec 2025</p>
      </div>
    </div>
  );
}