import React, { useState } from "react";
import { createUser } from "@/lib/utils/localStorage";
import { useUserStore } from "@/lib/store/userStore";
import TextField from "./TextField";
import Button from "./Button";

interface UserFormProps {
  onSuccess?: () => void;
}

export default function UserForm({ onSuccess }: UserFormProps) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [bio, setBio] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    avatar: "",
  });

  const { addUser } = useUserStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setErrors({ name: "", avatar: "" });

    // Validate form
    let isValid = true;
    const newErrors = { name: "", avatar: "" };

    if (!name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!avatar.trim()) {
      newErrors.avatar = "Avatar URL is required";
      isValid = false;
    } else if (!isValidUrl(avatar)) {
      newErrors.avatar = "Please enter a valid URL";
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    // Create user
    const newUser = createUser({
      name: name.trim(),
      avatar: avatar.trim(),
      bio: bio.trim(),
    });

    // Update the global store
    addUser(newUser);

    // Reset form
    setName("");
    setAvatar("");
    setBio("");

    // Call success callback
    if (onSuccess) {
      onSuccess();
    }
  };

  // Simple URL validation
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  // For demo purposes, let's add some placeholder avatar options
  const placeholderAvatars = [
    "https://i.pravatar.cc/150?img=1",
    "https://i.pravatar.cc/150?img=2",
    "https://i.pravatar.cc/150?img=3",
    "https://i.pravatar.cc/150?img=4",
  ];

  const handleSelectAvatar = (url: string) => {
    setAvatar(url);
    setErrors({ ...errors, avatar: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextField
        id="name"
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        required
        autoFocus
      />

      <div>
        <TextField
          id="avatar"
          label="Avatar URL"
          type="url"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          error={errors.avatar}
          required
          placeholder="https://example.com/avatar.jpg"
        />

        <div className="mt-2">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Or select one of these avatars:
          </p>
          <div className="flex space-x-2">
            {placeholderAvatars.map((url, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectAvatar(url)}
                className={`w-10 h-10 rounded-full overflow-hidden border-2 ${
                  avatar === url
                    ? "border-blue-500"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <img
                  src={url}
                  alt={`Avatar option ${index + 1}`}
                  className="w-full h-full"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="bio"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Bio (Optional)
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
          placeholder="Tell us about yourself..."
        />
      </div>

      <Button type="submit" fullWidth>
        Create User
      </Button>
    </form>
  );
}
