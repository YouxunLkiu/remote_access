import Link from 'next/link';
import styles from '../styles/globals.css';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Header Section */}
      <header className={styles.header}>
        <div className="container mx-auto flex justify-between items-center px-6">
          <h1 className={styles.title}>Remote Trainer Monitor</h1>
          <nav className={styles.body}>
            <Link href="/auth/login" className={styles.navItem}>
              Login
            </Link>
            <Link href="/auth/register" className={styles.navItem}>
              Register
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-16 px-6">
        <h2 className={styles.heroTitle}>
          Welcome to Your Training & Monitoring App
        </h2>
        <p className="text-lg mb-8">
          Effortlessly train and monitor your models with real-time updates and seamless controls.
        </p>
        <div className="flex space-x-4">
          {/* Tailwind Buttons */}
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-500 transition">
            Get Started
          </button>
          <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg shadow hover:bg-gray-300 transition">
            Learn More
          </button>
        </div>
      </section>
    </div>
  );
}
