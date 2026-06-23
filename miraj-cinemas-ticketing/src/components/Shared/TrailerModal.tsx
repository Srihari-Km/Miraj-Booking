/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play } from 'lucide-react';
import { Movie } from '../../types';

interface TrailerModalProps {
  movie: Movie;
  isOpen: boolean;
  onClose: () => void;
}

export default function TrailerModal({ movie, isOpen, onClose }: TrailerModalProps) {
  // ESC key closes
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  const hasLocal = !!movie.localVideoUrl;
  const hasYoutube = !!movie.trailerYoutubeId;

  const modal = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="trailer-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8"
          style={{ background: 'rgba(0,0,0,0.92)' }}
          onClick={e => { if (e.target === e.currentTarget) onClose(); }}
          role="dialog"
          aria-modal="true"
          aria-label={`${movie.title} trailer`}
        >
          <motion.div
            key="trailer-panel"
            initial={{ scale: 0.88, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-zinc-800"
            style={{ background: '#000' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-zinc-900/80 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Play className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                </div>
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-wider font-mono leading-none">{movie.title}</p>
                  <p className="text-[10px] text-zinc-400 font-semibold leading-none mt-0.5">Official Trailer</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-lg border border-zinc-700 bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all cursor-pointer"
                id="trailer-modal-close"
                aria-label="Close trailer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Video Area */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              {hasLocal ? (
                <video
                  src={movie.localVideoUrl}
                  controls
                  autoPlay
                  className="absolute inset-0 w-full h-full object-contain bg-black"
                  style={{ outline: 'none' }}
                  onError={(e) => {
                    // Fallback to YouTube if local video fails
                    (e.target as HTMLVideoElement).style.display = 'none';
                  }}
                />
              ) : hasYoutube ? (
                <iframe
                  src={`https://www.youtube.com/embed/${movie.trailerYoutubeId}?autoplay=1&rel=0&modestbranding=1`}
                  title={`${movie.title} Official Trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              ) : movie.backdropUrl ? (
                <img
                  src={movie.backdropUrl}
                  alt={movie.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                  <p className="text-zinc-400 text-sm">No trailer available</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
}
