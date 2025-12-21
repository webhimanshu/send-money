import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { toast } from "react-toastify";

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
}

export default function SendMoney() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const token = auth.token;
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);

  // Get contact from location state
  const contact = location.state?.contact as Contact | undefined;

  useEffect(() => {
    if (!contact) {
      toast.error("No contact selected");
      navigate("/dashboard");
      return;
    }

    // Fetch current balance
    const getBalance = async () => {
      if (!token) return;
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        "Authorization": token,
      };
      try {
        const resp = await fetch('http://localhost:4000/api/user/balance', {
          method: "GET",
          headers,
        });
        const data = await resp.json();
        if (data.success) {
          setBalance(data.balance);
        }
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      }
    };
    getBalance();
  }, [contact, token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact || !token) return;

    // const amountInPaise = Math.round(parseFloat(amount) * 100).toString();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (balance && parseFloat(amount) > balance) {
      toast.error("Insufficient balance");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/transfer', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        },
        body: JSON.stringify({
          toUserId: contact.id,
          amount: amount,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(`Successfully sent ₹${amount} to ${contact.firstName} ${contact.lastName}`);
        navigate("/dashboard");
      } else {
        toast.error(data.message || "Transfer failed. Please try again.");
      }
    } catch (error) {
      console.error("Failed to send money:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!contact) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="w-full py-4 px-6 flex items-center justify-between border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Sendme</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-gray-700 hover:text-gray-900 font-medium"
        >
          ← Back to Dashboard
        </button>
      </nav>

      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Send Money</h2>

        {/* Recipient Info */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <p className="text-gray-600 mb-2">Sending to:</p>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold text-xl">
              {contact.firstName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-900">
                {contact.firstName} {contact.lastName}
              </p>
              {contact.email && (
                <p className="text-gray-600">{contact.email}</p>
              )}
            </div>
          </div>
        </div>

        {/* Balance Display */}
        {balance !== null && (
          <div className="mb-6">
            <p className="text-gray-600 mb-1">Your Balance:</p>
            <p className="text-2xl font-bold text-gray-900">
              ₹{balance.toLocaleString("en-IN")}
            </p>
          </div>
        )}

        {/* Send Money Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="mb-6">
            <label htmlFor="amount" className="block text-gray-700 font-medium mb-2">
              Amount (₹)
            </label>
            <input
              type="number"
              id="amount"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-900 transition-colors text-lg"
            />
            {balance && amount && parseFloat(amount) > balance && (
              <p className="text-red-600 text-sm mt-2">Insufficient balance</p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !amount || parseFloat(amount) <= 0 || (balance !== null && parseFloat(amount) > balance)}
              className="flex-1 bg-blue-900 hover:bg-blue-950 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Money"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

