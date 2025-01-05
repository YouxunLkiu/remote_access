import Link from 'next/link';
import styles from '../styles/globals.css';

export default function Home() {
  return (
    <div className="min-h-screen bg-secondary dark:bg-primary text-gray-800 dark:text-gray-200">
      {/* Header Section */}
      <link rel="icon" href="/favicon.ico"/>
      <header className={styles.header}>
        <div className="container mx-auto flex justify-between items-center px-6 py-2">
          <h1 className="font-mono font-extrabold mb-4">
            Remote Trainer Monitor
          </h1>
          <nav className="navbar-spacing">
            <Link href="/auth/login" className="button-navigation">
              Login
            </Link>
            <Link href="/auth/register" className="button-navigation-darker">
              Register
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-16 px-6">
        <h2 className="heroTitle">
          Welcome to Your Training & Monitoring App
        </h2>
        <p className="text mb-8">
          Effortlessly train and monitor your models with real-time updates and seamless controls.
        </p>
        <div className="flex space-x-4">
          {/* Tailwind Buttons */}
  
          <button className="button-primary-light">
            Learn More
          </button>
        </div>
      </section>
    </div>
  );
}
