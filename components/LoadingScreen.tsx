// Loading screen component for game bootstrap
"use client";

import { useEffect, useState } from 'react';
import { BootstrapStatus, BootstrapState } from '@/lib/bootstrap';

interface LoadingScreenProps {
  bootstrapState: BootstrapState;
}

export default function LoadingScreen({ bootstrapState }: LoadingScreenProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: BootstrapStatus) => {
    switch (status) {
      case BootstrapStatus.ERROR:
        return 'text-red-500';
      case BootstrapStatus.READY:
        return 'text-green-500';
      case BootstrapStatus.VALIDATING:
        return 'text-yellow-500';
      default:
        return 'text-blue-500';
    }
  };

  const getStatusIcon = (status: BootstrapStatus) => {
    switch (status) {
      case BootstrapStatus.INITIALIZING:
        return '🔄';
      case BootstrapStatus.VALIDATING:
        return '🔍';
      case BootstrapStatus.LOADING:
        return '📦';
      case BootstrapStatus.READY:
        return '✅';
      case BootstrapStatus.ERROR:
        return '❌';
      default:
        return '⏳';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-gray-800 rounded-lg shadow-2xl p-8 border-2 border-purple-700">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🎭 Underground Club Manager 🎭
          </h1>
          <p className="text-gray-400 text-sm">Secure Boot Sequence</p>
        </div>

        {/* Status */}
        <div className="mb-6">
          <div className="flex items-center justify-center mb-4">
            <span className="text-4xl mr-3">{getStatusIcon(bootstrapState.status)}</span>
            <span className={`text-xl font-semibold ${getStatusColor(bootstrapState.status)}`}>
              {bootstrapState.status.toUpperCase()}
            </span>
          </div>
          <p className="text-center text-gray-300">
            {bootstrapState.message}{dots}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-500 ease-out"
              style={{ width: `${bootstrapState.progress}%` }}
            >
              <div className="h-full w-full animate-pulse bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>
            </div>
          </div>
          <p className="text-center text-gray-400 text-sm mt-2">
            {bootstrapState.progress}%
          </p>
        </div>

        {/* Warnings */}
        {bootstrapState.warnings.length > 0 && (
          <div className="bg-yellow-900 bg-opacity-30 border border-yellow-600 rounded p-4 mb-4">
            <h3 className="text-yellow-500 font-semibold mb-2 flex items-center">
              ⚠️ Warnings
            </h3>
            <ul className="text-yellow-200 text-sm space-y-1">
              {bootstrapState.warnings.map((warning, index) => (
                <li key={index}>• {warning}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Error */}
        {bootstrapState.error && (
          <div className="bg-red-900 bg-opacity-30 border border-red-600 rounded p-4">
            <h3 className="text-red-500 font-semibold mb-2 flex items-center">
              ❌ Error
            </h3>
            <p className="text-red-200 text-sm">{bootstrapState.error}</p>
          </div>
        )}

        {/* Loading animation */}
        {bootstrapState.status !== BootstrapStatus.READY && 
         bootstrapState.status !== BootstrapStatus.ERROR && (
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}

        {/* Anti-cheat info */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-center text-gray-500 text-xs">
            🔒 Protected by Anti-Cheat System v1.0
          </p>
          <p className="text-center text-gray-600 text-xs mt-1">
            Save file integrity verification enabled
          </p>
        </div>
      </div>
    </div>
  );
}
