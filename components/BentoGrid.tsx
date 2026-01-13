
import React from 'react';
import { motion } from 'framer-motion';

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ children, className = "" }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px] ${className}`}>
      {children}
    </div>
  );
};

interface BentoItemProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
  rowSpan?: number;
}

export const BentoItem: React.FC<BentoItemProps> = ({ 
  children, 
  className = "", 
  colSpan = 1, 
  rowSpan = 1 
}) => {
  const colClass = {
    1: 'md:col-span-1',
    2: 'md:col-span-2',
    3: 'md:col-span-3',
    4: 'md:col-span-4',
  }[colSpan];

  const rowClass = {
    1: 'row-span-1',
    2: 'row-span-2',
    3: 'row-span-3',
  }[rowSpan];

  return (
    <motion.div
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
      className={`${colClass} ${rowClass} bg-[#141414] border border-[#222] rounded-3xl p-6 relative overflow-hidden bento-inner-shadow group transition-all ${className}`}
    >
      {children}
    </motion.div>
  );
};
