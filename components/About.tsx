import React from 'react';
import { Twitter, Linkedin, Briefcase, FileText, ExternalLink } from 'lucide-react';

const About: React.FC = () => {
  const links = [
    { label: "Website", url: "https://www.raiku.com/", icon: <ExternalLink size={18} /> },
    { label: "Docs", url: "https://docs.raiku.com/", icon: <FileText size={18} /> },
    { label: "Twitter", url: "https://x.com/raikucom", icon: <Twitter size={18} /> },
    { label: "LinkedIn", url: "https://www.linkedin.com/company/raikucom/", icon: <Linkedin size={18} /> },
    { label: "Careers", url: "https://jobs.ashbyhq.com/raiku", icon: <Briefcase size={18} /> },
  ];

  return (
    <footer className="bg-raiku-dark border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-white">About Raiku</h2>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              Raiku is pioneering deterministic scheduling on Solana. We are building the infrastructure to make transaction flow predictable, fair, and protected against malicious MEV. Join the community and help us build the future of high-performance blockchains.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-raiku-primary transition-colors p-2"
              >
                {link.icon}
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">© {new Date().getFullYear()} Raiku. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
             <span className="text-gray-600 text-sm">Vibecoded by chrollo69420</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default About;