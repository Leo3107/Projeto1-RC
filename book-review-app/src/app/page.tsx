import Link from "next/link";
import { useState, useEffect } from "react";
import { Book } from "@/lib/types";
import BookSection from "@/components/book/BookSection";
import SearchBar from "@/components/book/SearchBar";
import { useBookSearchStore } from "@/lib/store/bookSearchStore";
import { useRouter } from "next/navigation";

export default function Home() {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { setSearchQuery } = useBookSearchStore();

  useEffect(() => {
    // Simulação de carregamento de livros em destaque
    const fetchFeaturedBooks = async () => {
      try {
        // Em um aplicativo real, você faria uma chamada de API aqui
        // Exemplo: const response = await fetch('/api/featured-books');
        // const data = await response.json();
        
        // Simulando um atraso de carregamento
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Dados mockados para exemplo
        const mockBooks: Book[] = [
          {
            id: "1",
            title: "The Great Gatsby",
            author: ["F. Scott Fitzgerald"],
            year: 1925,
            coverUrl: "https://covers.openlibrary.org/b/id/8424495-L.jpg"
          },
          {
            id: "2",
            title: "To Kill a Mockingbird",
            author: ["Harper Lee"],
            year: 1960,
            coverUrl: "https://covers.openlibrary.org/b/id/12009522-L.jpg"
          },
          {
            id: "3",
            title: "1984",
            author: ["George Orwell"],
            year: 1949,
            coverUrl: "https://covers.openlibrary.org/b/id/8575111-L.jpg"
          },
          {
            id: "4",
            title: "The Catcher in the Rye",
            author: ["J.D. Salinger"],
            year: 1951,
            coverUrl: "https://covers.openlibrary.org/b/id/6926521-L.jpg"
          }
        ];
        
        setFeaturedBooks(mockBooks);
      } catch (error) {
        console.error("Failed to fetch featured books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedBooks();
  }, []);

  const handleBookSearch = (query: string) => {
    setSearchQuery(query);
    router.push("/books");
  };

  const handleBookClick = (bookId: string) => {
    router.push(`/book/${bookId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
                Discover Your Next Great Read
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-600 dark:text-gray-300">
                Track your reading journey, find new books, and share your thoughts with a community of readers.
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto mb-8">
              <SearchBar 
                onSearch={(query) => handleBookSearch(query)} 
                initialQuery="" 
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/books" 
                className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-center text-base px-6 py-3 transition-colors"
              >
                Browse Books
              </Link>
              <Link 
                href="/auth/signup" 
                className="rounded-full border border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 font-medium text-center text-base px-6 py-3 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900 dark:text-white">Why Use Our Book Review App?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Track Your Reading</h3>
              <p className="text-gray-600 dark:text-gray-300">Keep track of books you&apos;ve read, currently reading, or want to read in the future.</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Write Reviews</h3>
              <p className="text-gray-600 dark:text-gray-300">Share your thoughts, ratings, and detailed reviews with the community.</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Join the Community</h3>
              <p className="text-gray-600 dark:text-gray-300">Connect with other readers, discover new books, and expand your reading horizons.</p>
            </div>
          </div>
        </div>
      </section>      <div className="bg-gray-50 dark:bg-gray-900 py-10 flex justify-center">
        <div className="w-full max-w-7xl">
          {/* Featured Books Section */}
          <BookSection
            title="Featured Books"
            books={featuredBooks}
            loading={loading}
            onBookClick={handleBookClick}
            viewAllLink="/books"
            showShelfControls={false}
          />
        </div>
        
        {/* We'll add these sections if there's functionality for them later */}
        {/* 
        <BookSection
          title="New Releases"
          books={[]}
          loading={false} 
          onBookClick={handleBookClick}
          viewAllLink="/books?filter=new"
          showShelfControls={false}
          emptyMessage="New releases will be available soon."
        />
        
        <BookSection
          title="Popular in Community"
          books={[]}
          loading={false}
          onBookClick={handleBookClick}
          viewAllLink="/books?filter=popular"
          showShelfControls={false}
          emptyMessage="Popular books will appear here as users add reviews."
        /> 
        */}
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 py-8 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Book Review App. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              Terms
            </Link>
            <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              Privacy
            </Link>
            <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
