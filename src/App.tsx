import { Home } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
          <Home className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Welcome to Your App
        </h1>
        <p className="text-lg text-slate-600">
          Your application is now running successfully
        </p>
      </div>
    </div>
  );
}

export default App;
