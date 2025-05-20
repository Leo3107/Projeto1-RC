# BookShelf - Book Review Application

BookShelf is a full-stack book review application built with React, TypeScript, Tailwind CSS, and Next.js. It allows users to create profiles, maintain personal book shelves, search for books via the OpenLibrary API, and share reviews.

## Features

- **User System**: Local user profiles stored in browser's localStorage
- **Book Shelves**: Organize books into "Read", "Currently Reading", and "Want to Read" shelves
- **Book Search**: Search for books using the OpenLibrary API with filters for genre and year
- **Book Details**: View detailed information about books, including covers and publication details
- **Reviews & Ratings**: Add, edit, and delete reviews with ratings and spoiler warnings
- **Responsive Design**: Fully responsive UI that works across desktop and mobile devices
- **Dark Mode**: Toggle between light and dark themes
- **Book Caching**: Efficient data loading with memory and localStorage cache

## Tech Stack

- **Frontend**: Next.js 14 (App Router) with React 18
- **Styling**: Tailwind CSS with custom UI components
- **State Management**: Zustand for client-side state
- **API Integration**: OpenLibrary for book search and cover images
- **Storage**: Browser localStorage for user data persistence
- **Performance**: In-memory caching with localStorage backup

## Project Structure

```
book-review-app/
├── app/                      # Next.js app router pages
│   ├── page.tsx              # Home page (search functionality)
│   ├── book/[id]/page.tsx    # Book detail page
│   ├── my-books/page.tsx     # User's book shelves page
│   └── users/page.tsx        # User selection and creation page
├── components/               # React components
│   ├── book/                 # Book-related components
│   ├── review/               # Review-related components
│   └── ui/                   # UI components (buttons, cards, etc.)
├── lib/                      # Application logic
│   ├── hooks/                # Custom React hooks
│   ├── store/                # Zustand stores
│   ├── types/                # TypeScript type definitions
│   └── utils/                # Utility functions
└── public/                   # Static assets
    └── images/               # Images and icons
```

## Key Concepts

### Data Architecture

- **User data**: Stored in localStorage for persistence
- **Book data**: Fetched from OpenLibrary API and cached in memory and localStorage
- **Reviews**: User-generated content stored in localStorage
- **Shelves**: Book collections organized by reading status

### State Management

- **userStore**: Manages active user and user list
- **bookSearchStore**: Handles book search queries and results
- **bookShelfStore**: Manages user's book shelves and shelf operations
- **uiStore**: Controls UI state like dark mode preference

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
