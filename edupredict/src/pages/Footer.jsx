import React from 'react'
import {
  ClockIcon,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedinIcon,
} from 'lucide-react';

function Footer() {
 return (
    <footer className="bg-[#121631] text-gray-300 py-12 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About us */}
          <div>
            <h3 className="text-white text-xl font-bold mb-6">About us</h3>
            <p className="mb-6 text-sm">
              orporate clients and leisure travelers has been relying on
              Groundlink for dependable safe, and professional chauffeured car
              end service in major cities across World.
            </p>
            <div className="flex items-start">
              <div className="bg-indigo-600 p-2 mr-4">
                <ClockIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold">OPENING HOURES</h4>
                <p className="text-sm">Mon - Sat(8.00 - 6.00)</p>
                <p className="text-sm">Sunday - Closed</p>
              </div>
            </div>
          </div>
          {/* Useful Links */}
          <div>
            <h3 className="text-white text-xl font-bold mb-6">Usefull Links</h3>
            <ul className="space-y-3 text-sm">
              <li>About Us</li>
              <li>Teachers</li>
              <li>Partner</li>
              <li>Room-Details</li>
              <li>Gallery</li>
            </ul>
          </div>
          {/* Course */}
          <div>
            <h3 className="text-white text-xl font-bold mb-6">Course</h3>
            <ul className="space-y-3 text-sm">
              <li>Ui Ux Design</li>
              <li>Web Development</li>
              <li>Business Strategy</li>
              <li>Software Development</li>
              <li>Business English</li>
            </ul>
          </div>
          {/* Recent Post */}
          <div>
            <h3 className="text-white text-xl font-bold mb-6">Recent Post</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                  alt="Business people"
                  className="w-16 h-16 object-cover"
                />
                <div>
                  <p className="text-xs text-gray-400">02 Apr 2024</p>
                  <p className="font-medium">Best Your Business</p>
                </div>
              </div>
              <div className="flex gap-3">
                <img
                  src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                  alt="Business woman"
                  className="w-16 h-16 object-cover"
                />
                <div>
                  <p className="text-xs text-gray-400">02 Apr 2024</p>
                  <p className="font-medium">Keep Your Business</p>
                </div>
              </div>
              <div className="flex gap-3">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                  alt="Business man"
                  className="w-16 h-16 object-cover"
                />
                <div>
                  <p className="text-xs text-gray-400">02 Apr 2024</p>
                  <p className="font-medium">Nice Your Business</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom section */}
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-6 md:mb-0">
            <span className="text-white text-2xl font-bold">
              <span className="text-indigo-500">Edu</span>rock
            </span>
            <span className="ml-4 text-sm">
              Copyright © 2024 by edurock. All Rights Reserved.
            </span>
          </div>
          <div className="flex space-x-4">
            <a
              href="#"
              className="bg-gray-800 p-2 rounded-sm hover:bg-gray-700"
            >
              <FacebookIcon className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="bg-gray-800 p-2 rounded-sm hover:bg-gray-700"
            >
              <TwitterIcon className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="bg-gray-800 p-2 rounded-sm hover:bg-gray-700"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="bg-gray-800 p-2 rounded-sm hover:bg-gray-700"
            >
              <LinkedinIcon className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="bg-gray-800 p-2 rounded-sm hover:bg-gray-700"
            >
              <div className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer