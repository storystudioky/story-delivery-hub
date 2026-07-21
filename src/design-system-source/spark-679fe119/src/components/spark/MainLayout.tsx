import { ReactNode } from 'react';
import { SparkHeader } from './SparkHeader';

interface MainLayoutProps {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  mainClassName?: string;
}

const maxWidthClasses = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-5xl',
  xl: 'max-w-7xl',
  full: 'max-w-full'
};

export function MainLayout({ children, maxWidth = 'xl', mainClassName }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-muted/30">
      <SparkHeader />
      <main
        className={`mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-8 ${maxWidthClasses[maxWidth]} ${mainClassName ?? ''}`}
      >
        {children}
      </main>
    </div>
  );
}
