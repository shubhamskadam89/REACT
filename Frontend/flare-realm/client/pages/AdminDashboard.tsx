import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const UserIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 34 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.57916 24.9396C8.27885 25.1606 7.89924 25.2571 7.53092 25.2003C7.15694 25.1494 6.8226 24.9452 6.59598 24.6449C6.37496 24.3446 6.27851 23.965 6.33531 23.591C6.39183 23.2226 6.59036 22.8883 6.89066 22.6616C9.81448 20.4912 13.362 19.3239 17.0002 19.3239C20.638 19.3239 24.1855 20.4912 27.1091 22.6616C27.4097 22.8883 27.6079 23.2226 27.6644 23.591C27.7212 23.965 27.6248 24.3446 27.4038 24.6449C27.1771 24.9452 26.8428 25.1494 26.4688 25.2003C26.1005 25.2571 25.7208 25.1606 25.4206 24.9396C22.984 23.1318 20.0316 22.1572 16.9998 22.1572C13.968 22.1572 11.0157 23.1318 8.57898 24.9396H8.57916Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 17.0004C0 12.4951 1.79091 8.16563 4.981 4.98101C8.16576 1.79092 12.4948 0 17.0003 0C21.5053 0 25.8343 1.79092 29.0189 4.98101C32.2093 8.16577 33.9999 12.4948 33.9999 17.0004C33.9999 21.5053 32.2093 25.8344 29.0189 29.019C25.8342 32.2094 21.5052 34 17.0003 34C12.4951 34 8.16562 32.2094 4.981 29.019C1.79091 25.8342 0 21.5052 0 17.0004ZM2.83355 17.0004C2.83355 13.2434 4.32947 9.63916 6.98139 6.98147C9.63922 4.32954 13.2432 2.83362 17.0003 2.83362C20.7573 2.83362 24.3614 4.32954 27.0191 6.98147C29.6711 9.63931 31.1673 13.2433 31.1673 17.0004C31.1673 20.7574 29.6711 24.3616 27.0191 27.0192C24.3616 29.6712 20.7576 31.1674 17.0003 31.1674C13.2429 31.1674 9.63908 29.6712 6.98139 27.0192C4.32947 24.3617 2.83355 20.7577 2.83355 17.0004Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.4161 12.2119C11.4161 10.7216 12.0055 9.2878 13.0597 8.23387C14.1136 7.17993 15.5474 6.59059 17.0377 6.58498C18.528 6.58498 19.9615 7.17998 21.0157 8.23387C22.0697 9.2878 22.6646 10.7216 22.6646 12.2119C22.6646 13.7022 22.0696 15.1357 21.0157 16.1899C19.9615 17.2439 18.528 17.8388 17.0377 17.8388C15.5474 17.8388 14.1136 17.2438 13.0597 16.1899C12.0054 15.1357 11.4161 13.7022 11.4105 12.2119M14.2497 12.2119C14.2497 11.4696 14.5384 10.7613 15.0657 10.2399C15.587 9.71292 16.2953 9.42385 17.0377 9.41824C17.78 9.41824 18.4883 9.71293 19.0097 10.2399C19.5367 10.7612 19.8258 11.4695 19.8258 12.2119C19.8258 12.9543 19.5367 13.6626 19.0097 14.1839C18.4884 14.7109 17.7801 15.0056 17.0377 15.0056C16.2953 15.0056 15.5871 14.7109 15.0657 14.1839C14.5384 13.6626 14.2497 12.9543 14.244 12.2119"
      fill="currentColor"
    />
  </svg>
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-white font-cantata max-w-md mx-auto lg:max-w-lg xl:max-w-xl">
      {/* Header */}
      <div className="w-full h-[56px] bg-blue-600 flex items-center justify-between px-4">
        <div className="text-white text-xl font-normal">Admin Dashboard</div>
        <div className="flex items-center gap-2">
          <UserIcon className="w-8 h-8 text-white" />
          <button
            onClick={handleLogout}
            className="text-white text-sm hover:underline"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Admin Content */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Welcome, Administrator!
        </h1>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">
              System Overview
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Active Users:</span> 156
              </div>
              <div>
                <span className="font-medium">Active Drivers:</span> 23
              </div>
              <div>
                <span className="font-medium">Pending Requests:</span> 8
              </div>
              <div>
                <span className="font-medium">Completed Today:</span> 45
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-green-800 mb-2">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition">
                View All Users
              </button>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition">
                Manage Drivers
              </button>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition">
                System Reports
              </button>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">
              Recent Activity
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>New user registration</span>
                <span className="text-gray-500">2 min ago</span>
              </div>
              <div className="flex justify-between">
                <span>Driver accepted request</span>
                <span className="text-gray-500">5 min ago</span>
              </div>
              <div className="flex justify-between">
                <span>Emergency request completed</span>
                <span className="text-gray-500">12 min ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 