import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { FaListAlt, FaPlus, FaUserAlt, FaCog } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const router = useRouter();
  
  const navLinks = [
    { href: '/', label: 'Orders', icon: <FaListAlt /> },
    { href: '/create', label: 'Create Order', icon: <FaPlus /> },
    { href: '/portfolio', label: 'My Orders', icon: <FaUserAlt /> },
    { href: '/admin', label: 'Admin', icon: <FaCog /> },
  ];
  
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" passHref legacyBehavior>
              <a className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-green-500 text-transparent bg-clip-text">
                P2P Token Market
              </a>
            </Link>
            
            <nav className="hidden md:flex ml-8">
              <ul className="flex space-x-1">
                {navLinks.map(({ href, label, icon }) => (
                  <li key={href}>
                    <Link href={href} passHref legacyBehavior>
                      <a className={`flex items-center px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
                        router.pathname === href 
                          ? 'bg-gray-100 text-primary' 
                          : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                      }`}>
                        <span className="mr-2">{icon}</span>
                        <span>{label}</span>
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <ConnectButton />
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <nav className="md:hidden mt-3 pb-1">
          <ul className="flex justify-between">
            {navLinks.map(({ href, label, icon }) => (
              <li key={href}>
                <Link href={href} passHref legacyBehavior>
                  <a className={`flex flex-col items-center p-2 rounded-lg text-xs ${
                    router.pathname === href 
                      ? 'text-primary' 
                      : 'text-gray-500 hover:text-primary'
                  }`}>
                    <span className="text-lg mb-1">{icon}</span>
                    <span>{label}</span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;