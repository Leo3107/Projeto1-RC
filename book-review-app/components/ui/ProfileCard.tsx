"use client";

import { useState } from "react";
import Image from "next/image";
import { User } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";

interface ProfileCardProps {
  user: User;
  onUpdateProfile: (updatedUser: User) => void;
}

export default function ProfileCard({
  user,
  onUpdateProfile,
}: ProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...user,
      name,
      bio,
    });
    setIsEditing(false);
  };

  const totalBooks =
    user.shelves.read.length +
    user.shelves.currentlyReading.length +
    user.shelves.wantToRead.length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden">
              <Image
                src={user.avatar || "/images/default-avatar.svg"}
                alt={user.name}
                fill
                className="object-cover"
              />
            </div>
            {!isEditing ? (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {user.name}
                </h2>
                {user.bio && (
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    {user.bio}
                  </p>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex-1">
                <TextField
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <TextField
                  label="Bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  multiline
                />
                <div className="mt-4 flex space-x-2">
                  <Button type="submit">Save</Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setName(user.name);
                      setBio(user.bio || "");
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              variant="secondary"
              size="small"
            >
              Edit Profile
            </Button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <Badge className="mb-1">{user.shelves.read.length}</Badge>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Read</p>
          </div>
          <div className="text-center">
            <Badge className="mb-1">
              {user.shelves.currentlyReading.length}
            </Badge>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Reading</p>
          </div>
          <div className="text-center">
            <Badge className="mb-1">{user.shelves.wantToRead.length}</Badge>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Want to Read
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            <span className="font-medium">{totalBooks}</span> books in total
          </p>
        </div>
      </div>
    </div>
  );
}
