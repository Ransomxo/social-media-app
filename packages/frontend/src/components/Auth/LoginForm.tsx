'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginForm() {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 gradient-bg">
        <div className="flex flex-col justify-center items-start w-full max-w-lg mx-auto px-16 text-white">
          <h2 className="text-5xl font-bold mb-4">Welcome Back to</h2>
          <h2 className="text-5xl font-bold">Your Social Hub</h2>
        </div>
      </div>
      
      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-16">
        <div className="flex justify-between items-center mb-12">
          <div className="text-3xl font-bold text-gray-900">AMU</div>
          <Link href="/" className="text-purple-600 hover:text-purple-700 font-medium">
            Back to website
          </Link>
        </div>
        
        <div className="flex-grow">
          <h1 className="text-4xl font-bold mb-4">Log in</h1>
          <p className="text-gray-600 mb-8">
            Don't have an account?{' '}
            <Link href="/signup" className="text-purple-600 hover:text-purple-700">
              Create one
            </Link>
          </p>
          
          <form className="form-section">
            <input
              type="email"
              placeholder="Email"
              className="form-input"
            />
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                className="form-input"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            
            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm text-purple-600 hover:text-purple-700">
                Forgot password?
              </Link>
            </div>
            
            <button
              type="submit"
              className="btn-primary"
            >
              Log in
            </button>
          </form>
          
          <div className="mt-8">
            <div className="form-divider">Or continue with</div>
            <div className="grid grid-cols-2 gap-4">
              <button className="social-btn">
                <Image src="/google-icon.svg" alt="Google" width={24} height={24} className="mr-2" />
                <span className="font-medium">Google</span>
              </button>
              <button className="social-btn">
                <Image src="/apple-icon.svg" alt="Apple" width={24} height={24} className="mr-2" />
                <span className="font-medium">Apple</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
