
import React from 'react';
import { motion } from 'framer-motion';
import { NavigationTab } from '../types';
import { Terminal, Database, Lightbulb, Home } from 'lucide-react';

interface NavigationProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: NavigationTab.HOME, label: 'Home', icon: <Home size={18} /> },
    { id: NavigationTab.SWE, label: 'SWE', icon: <Terminal size={18} /> },
    { id: NavigationTab.DS, label: 'Data Science', icon: <Database size={18} /> },
    { id: NavigationTab.STRATEGY, label: 'Strategy', icon: <Lightbulb size={18} /> },
  ];

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#141414]/80 backdrop-blur-xl border border-[#333] p-1.5 rounded-full shadow-2xl">
      <div className="flex items-center gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab.id ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-0 bg-[#333] rounded-full -z-10"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
