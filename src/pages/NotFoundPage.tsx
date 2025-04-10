
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Oops! This page doesn't exist</p>
        <Button asChild>
          <Link to="/">Go back to home</Link>
        </Button>
      </main>
    </div>
  );
};

export default NotFoundPage;
