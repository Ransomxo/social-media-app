'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function SignupForm() {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 gradient-bg">
        <div className="flex flex-col justify-center items-start w-full max-w-lg mx-auto px-16 text-white">
          <h2 className="text-5xl font-bold mb-4">Capturing Moments,</h2>
          <h2 className="text-5xl font-bold">Creating Memories</h2>
        </div>
      </div>
      
      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-16 bg-gray-900">
        <div className="flex justify-between items-center mb-12">
          <div className="text-3xl font-bold text-white">AMU</div>
          <Link href="/" className="text-purple-400 hover:text-purple-300 font-medium">
            Back to website
          </Link>
        </div>
        
        <div className="flex-grow">
          <h1 className="text-4xl font-bold mb-4 text-white">Create an account</h1>
          <p className="text-gray-400 mb-8">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-400 hover:text-purple-300">
              Log in
            </Link>
          </p>
          
          <form className="form-section mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First name"
                className="form-input bg-white"
              />
              <input
                type="text"
                placeholder="Last name"
                className="form-input bg-white"
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              className="form-input bg-white"
            />
            <div className="relative">
              <input
                type="password"
                placeholder="Enter your password"
                className="form-input bg-white pr-12"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            
            <div className="flex items-start space-x-3 mt-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-600 focus:ring-offset-0"
              />
              <label htmlFor="terms" className="text-sm text-gray-300">
                I agree to the{' '}
                <Link href="/terms" className="text-purple-400 hover:text-purple-300 font-medium">
                  Terms &amp; Conditions
                </Link>
              </label>
            </div>
            
            <button
              type="submit"
              className="btn-primary mt-6"
            >
              Create account
            </button>
          </form>
          
          <div className="mt-8 max-w-md mx-auto w-full">
            <div className="form-divider">Or register with</div>
            <div className="grid grid-cols-2 gap-4">
              <button className="social-btn">
                <Image src="/google-icon.svg" alt="Google" width={24} height={24} />
                <span className="font-medium">Google</span>
              </button>
              <button className="social-btn">
                <Image src="/apple-icon.svg" alt="Apple" width={24} height={24} />
                <span className="font-medium">Apple</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
