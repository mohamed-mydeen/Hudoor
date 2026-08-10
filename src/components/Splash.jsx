import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export const Splash = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // 3 second loading
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      className="absolute inset-0 z-[100] bg-cover bg-center flex flex-col items-center justify-center text-white"
      style={{ backgroundImage: `url('/bg.png')` }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* Blurred Dark Overlay */}
      <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-md" />

      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15, delay: 0.2 }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm shadow-xl border border-white/20">
          <CheckCircle size={48} className="text-white" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Hudoor</h1>
        <p className="text-blue-200 font-medium tracking-widest text-sm uppercase">Loading Workspace</p>
      </motion.div>
      
      <div className="absolute bottom-24 flex flex-col items-center z-10">
        <div className="w-12 h-1 bg-white/30 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.8, ease: "easeInOut" }}
          />
        </div>
      </div>
      

    </motion.div>
  );
};
