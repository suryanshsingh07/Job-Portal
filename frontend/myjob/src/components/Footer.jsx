import { Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t bg-muted/30 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-bold">
             <img src="/logo.png" className="w-10 h-10" />
              My Job
            </div>
            <p className="text-sm text-muted-foreground">
              Connecting talented professionals with amazing opportunities.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">For Job Seekers</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/login" className="hover:text-primary transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-primary transition-colors">
                  Create Profile
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">For Employers</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/login" className="hover:text-primary transition-colors">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/employer-dashboard" className="hover:text-primary transition-colors">
                  Employer Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="https://www.linkedin.com/in/suryansh-singh-thakur/" className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                  About Us
                </a>
              </li>
              <li>
                <a href="https://github.com/suryanshsingh07" className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p className="mb-4">© {new Date().getFullYear()} - All Rights Reserved</p>
          <a href='https://suryanshsingh.vercel.app' target='_blank' rel="noopener noreferrer"
          className="items-center gap-1.5 bg-slate-400 px-4 py-2 rounded-full border border-slate-800">
            <span>Made by </span>
            <span className="text-[#ff0000] font-bold">
              Suryansh Singh
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
