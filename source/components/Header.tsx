import { Eye } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full py-6 px-4 sm:px-6 lg:px-8 bg-card/50 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto flex items-center justify-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-primary">
          <Eye className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Retina Scan AI
        </h1>
      </div>
    </header>
  );
};

export default Header;
