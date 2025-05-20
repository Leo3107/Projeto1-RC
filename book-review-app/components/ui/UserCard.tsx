import React from "react";
import Image from "next/image";
import { User } from "@/lib/types";
import Card from "../ui/Card";

interface UserCardProps {
  user: User;
  isActive?: boolean;
  onClick: () => void;
}

export default function UserCard({
  user,
  isActive = false,
  onClick,
}: UserCardProps) {
  // Get book counts for each shelf
  const readCount = user.shelves.read.length;
  const readingCount = user.shelves.currentlyReading.length;
  const wantToReadCount = user.shelves.wantToRead.length;

  return (
    <Card
      hoverable
      onClick={onClick}
      className={`h-full ${isActive ? "ring-2 ring-blue-500" : ""}`}
    >
      <div className="p-4 flex flex-col items-center">
        <div className="relative w-20 h-20 mb-3">
          <Image
            src={user.avatar || "/images/default-avatar.svg"}
            alt={user.name}
            fill
            className="rounded-full object-cover"
          />
          {isActive && (
            <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>

        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1 text-center">
          {user.name}
        </h3>

        {user.bio && (
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4 line-clamp-2">
            {user.bio}
          </p>
        )}

        <div className="mt-auto w-full pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-3 gap-1 text-center text-xs text-gray-600 dark:text-gray-400">
            <div>
              <span className="font-semibold text-gray-800 dark:text-gray-200 block">
                {readCount}
              </span>
              Read
            </div>
            <div>
              <span className="font-semibold text-gray-800 dark:text-gray-200 block">
                {readingCount}
              </span>
              Reading
            </div>
            <div>
              <span className="font-semibold text-gray-800 dark:text-gray-200 block">
                {wantToReadCount}
              </span>
              Want to Read
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
