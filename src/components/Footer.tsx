import Link from 'next/link';
import { Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background py-4 mt-auto">
      <div className="max-w-xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <a
            href="https://github.com/JuannFerrari/factcheck-ai-frontend"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:underline"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
