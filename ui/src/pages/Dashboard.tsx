import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { toast } from "react-toastify";

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const auth = useAuth();
  const token = auth.token;

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const fetchUsers = useCallback(async (search: string = "") => {
    if (!token) return;
    
    setLoading(true);
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Authorization": token,
    };
    
    try {
      const url = search
        ? `http://localhost:4000/api/user?search=${encodeURIComponent(search)}`
        : 'http://localhost:4000/api/user';
      
      const resp = await fetch(url, {
        method: "GET",
        headers,
      });
      const data = await resp.json();
      
      if (data.success) {
        setContacts(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const getBalance = async () => {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = token;
      }
      try {
        const resp = await fetch('http://localhost:4000/api/user/balance', {
          method: "GET",
          headers,
        });
        const data = await resp.json();
        setBalance(data.balance);
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      }
    };
    getBalance();
    fetchUsers();
  }, [token, fetchUsers]);

  // Debounced search - fetch users after user stops typing for 500ms
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers(searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, fetchUsers]);

  
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="w-full py-4 px-6 flex items-center justify-between border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Sendme</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-700">Hello!</span>
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold">
            {auth.user?.firstName.charAt(0).toUpperCase()}
          </div>
          <button
            onClick={handleLogout}
            className="bg-blue-900 hover:bg-blue-950 text-white font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Log out
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        {/* Balance Section */}
        <div className="mb-8">
          <h2 className="text-xl text-gray-700">
            Your Balance: ₹{balance}
          </h2>
        </div>

        {/* Contacts Section */}
        <div className="bg-blue-900 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6">Contacts</h2>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-400 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {/* Contacts List */}
          <div className="space-y-2">
            {loading ? (
              <div className="text-blue-200 text-center py-8">Loading...</div>
            ) : contacts.length === 0 ? (
              <div className="text-blue-200 text-center py-8">
                {searchQuery ? "No contacts found" : "No contacts available"}
              </div>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between bg-white rounded-lg p-4 hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold text-lg shrink-0">
                      {contact.firstName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-900 font-medium text-lg">
                      {contact.firstName} {contact.lastName}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate("/send-money", { state: { contact } })}
                    className="bg-blue-900 hover:bg-blue-950 text-white font-semibold px-6 py-2 rounded-lg transition-colors shrink-0"
                  >
                    Send Money
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
