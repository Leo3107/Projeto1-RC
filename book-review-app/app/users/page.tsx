"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/lib/types";
import { getUsers } from "@/lib/utils/localStorage";
import { useUserStore } from "@/lib/store/userStore";
import AppLayout from "@/components/ui/AppLayout";
import UserCard from "@/components/ui/UserCard";
import UserForm from "@/components/ui/UserForm";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

export default function UsersPage() {
  const router = useRouter();
  const { activeUser, setActiveUser } = useUserStore();
  const [users, setUsers] = useState<User[]>([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Load users on component mount
  useEffect(() => {
    const loadedUsers = getUsers();
    setUsers(loadedUsers);
  }, []);

  const handleUserSelect = (userId: string) => {
    setActiveUser(userId);
    router.push("/");
  };

  const handleAddUserClick = () => {
    setShowAddUserModal(true);
  };

  const handleUserAdded = () => {
    // Reload users after adding a new one
    const updatedUsers = getUsers();
    setUsers(updatedUsers);
    setShowAddUserModal(false);
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Select User
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Choose an existing user or create a new one to start your reading
            journey.
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {users.length} {users.length === 1 ? "User" : "Users"}
          </h2>
          <Button onClick={handleAddUserClick}>
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add User
            </span>
          </Button>
        </div>

        {users.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {users.map((user) => (
              <div key={user.id}>
                <UserCard
                  user={user}
                  isActive={activeUser?.id === user.id}
                  onClick={() => handleUserSelect(user.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No users found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create a new user to get started with your book collection.
            </p>
            <Button onClick={handleAddUserClick}>Add Your First User</Button>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        title="Create New User"
        size="md"
      >
        <UserForm onSuccess={handleUserAdded} />
      </Modal>
    </AppLayout>
  );
}
