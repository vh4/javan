"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input"

interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [accounts, setAccounts] = useState<User[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);

  const fetchAccounts = async () => {
    setIsLoadingAccounts(true);
    try {
      const response = await fetch("/api/mongodb/insert");
      const data = await response.json();

      if (data.success) {
        setAccounts(data.users);
      } else {
        console.error('Failed to fetch accounts:', data.error);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/mongodb/insert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`Success! User ID: ${data.insertedId}`);
        setFormData({ name: "", email: "", password: "" });
        // Refresh accounts list after successful submission
        await fetchAccounts();
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch {
      setMessage("Error: Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  // Load accounts when component mounts
  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to Tony&apos;s App</h1>
                <p className="text-gray-600 mb-2">Insert data into MongoDB Atlas database &apos;tony&apos;</p>
                <p className="text-gray-500 text-sm">Account List Below</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {/* Form Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">Create New Account</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                          type="text"
                          placeholder="Name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                        <Input
                          type="email"
                          placeholder="Email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                        <Input
                          type="password"
                          placeholder="Password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
                        >
                            {isLoading ? "Saving..." : "Save to MongoDB Atlas"}
                        </button>
                    </form>

                    {message && (
                      <div className={`mt-4 p-3 rounded text-sm ${
                        message.includes("Success")
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-red-100 text-red-700 border border-red-200"
                      }`}>
                        {message}
                      </div>
                    )}
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">Created Accounts</h2>
                        <button
                          onClick={fetchAccounts}
                          disabled={isLoadingAccounts}
                          className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 disabled:bg-gray-300 transition-colors"
                        >
                            {isLoadingAccounts ? "Refreshing..." : "Refresh"}
                        </button>
                    </div>

                    {isLoadingAccounts ? (
                      <div className="text-center py-8 text-gray-500">
                        Loading accounts...
                      </div>
                    ) : accounts.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No accounts created yet. Create your first account using the form.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100 border-b">
                                    <th className="text-left p-3 font-semibold text-gray-700">Name</th>
                                    <th className="text-left p-3 font-semibold text-gray-700">Email</th>
                                    <th className="text-left p-3 font-semibold text-gray-700">Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {accounts.map((account, index) => (
                                    <tr key={account._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="p-3 border-b border-gray-200">
                                            <div className="font-medium text-gray-800">{account.name}</div>
                                        </td>
                                        <td className="p-3 border-b border-gray-200">
                                            <div className="text-gray-600 text-sm">{account.email}</div>
                                        </td>
                                        <td className="p-3 border-b border-gray-200">
                                            <div className="text-gray-500 text-xs">
                                                {new Date(account.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-4 text-sm text-gray-500 text-center">
                            Total: {accounts.length} {accounts.length === 1 ? 'account' : 'accounts'}
                        </div>
                    </div>
                )}
                </div>
            </div>
        </div>
    </div>
  );
}
