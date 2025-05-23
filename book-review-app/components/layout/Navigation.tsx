import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Button from '../ui/Button'
import { useUserStore } from '@/lib/store/userStore'

export default function Navigation() {
  const pathname = usePathname()
  const { activeUser, setActiveUser } = useUserStore()

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-blue-600 dark:text-blue-400">
          BookReview
        </Link>
        
        <div className="flex items-center gap-4">
          <Link 
            href="/books" 
            className={`px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${
              pathname === '/books' ? 'font-medium text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            Browse
          </Link>
          
          <Link 
            href="/my-books" 
            className={`px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${
              pathname === '/my-books' ? 'font-medium text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            My Books
          </Link>
          
          {activeUser ? (
            <div className="flex items-center gap-2">
              <Link 
                href="/users" 
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-sm font-medium text-blue-600 dark:text-blue-300">
                  {activeUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline">{activeUser.name}</span>
              </Link>
                <Button 
                variant="ghost" 
                onClick={() => setActiveUser("")} 
                size="sm"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
