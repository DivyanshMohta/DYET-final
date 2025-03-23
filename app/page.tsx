import Image from 'next/image'
import { AcademicCapIcon, DocumentTextIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { FaLinkedin, FaFacebook, FaInstagram } from 'react-icons/fa'

export default function Home() {
  return (
    <main className="min-h-screen bg-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image
              src="/logo.png"
              alt="Disha Yash Eduteck"
              width={60}
              height={40}
              className="cursor-pointer"
            />
            <h2 className="text-xl font-semibold text-gray-900">Disha Yash Eduteck</h2>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-900">Log in</button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Sign up for free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-6xl font-bold text-center mb-8">
          Free study notes, summaries & answers for your studies
        </h1>
        <p className="text-xl text-center text-gray-600 mb-12">
          Study easier, faster & better.
        </p>
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for a document, course or university"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="absolute right-2 top-2 bg-blue-500 text-white p-2 rounded-md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <AcademicCapIcon className="h-16 w-16 mx-auto mb-4 text-blue-500" />
              <div className="text-4xl font-bold mb-2">3.68 M</div>
              <div className="text-gray-600">Happy students</div>
            </div>
            <div>
              <DocumentTextIcon className="h-16 w-16 mx-auto mb-4 text-blue-500" />
              <div className="text-4xl font-bold mb-2">1.39 M</div>
              <div className="text-gray-600">Helpful documents</div>
            </div>
            <div>
              <ChatBubbleLeftIcon className="h-16 w-16 mx-auto mb-4 text-blue-500" />
              <div className="text-4xl font-bold mb-2">18.41 M</div>
              <div className="text-gray-600">Answered questions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">
            University or college studying has never been easier
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <DocumentTextIcon className="h-8 w-8 text-blue-500" />
                <h3 className="font-semibold">Find all relevant study materials for your courses</h3>
              </div>
              
              <div className="flex items-center space-x-4 bg-blue-50  rounded-lg w-full">
                <DocumentTextIcon className="h-8 w-8 text-blue-500" />
                <h3 className="font-semibold">Learn more efficiently (e.g. with our flash card tool)</h3>
              </div>
              
              <div className="flex items-center space-x-4">
                <ChatBubbleLeftIcon className="h-8 w-8 text-blue-500" />
                <h3 className="font-semibold">Find answers to your questions in our community</h3>
              </div>
              
              <div className="flex items-center space-x-4">
                <AcademicCapIcon className="h-8 w-8 text-blue-500" />
                <h3 className="font-semibold">Share your study materials and receive great rewards</h3>
              </div>
              
              <button className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600">
                Sign up for free
              </button>
            </div>
            <div className="relative">
              <Image
                src="/dashboard.png"
                alt="Dashboard Preview"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="bg-orange-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Image
                src="/students.jpg"
                alt="Happy Students"
                width={600}
                height={400}
                className="rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-5xl font-bold mb-8">90% of our students improve their exam results</h2>
              <button className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600">
                Sign up for free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className='grid md:grid-cols-2 gap-12 items-center'>
        <div>
          <h2 className="text-5xl font-bold mb-8">Add your courses and ace every lecture, seminar and test</h2>
          <p>Our company connects students and encourages them to help each other. Together we master every exam, every assignment and every job interview.</p>
          <p className='pt-10 text-blue-500 underline cursor-pointer'>Know about Disha Yash More</p>
        </div>
            <div> 
              <Image
                src="/about_us.jpg"
                alt="Happy Students"
                width={700}
                height={200}
                className="rounded-lg"
              />
            </div>
        </div>
      </div>
      </section>

      {/* End of the page */}
      <section>
        <div className='text-center '>
          <div className='text-5xl font-bold py-10'>
          <h2 >Study Easier, Study Faster & better</h2>
          </div>
          <button className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600">
            Sign up for free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* For students */}
            <div>
              <h3 className="text-lg font-semibold mb-4">For students</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Search study materials</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Rewards store</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Community Guidelines</a></li>
              </ul>
            </div>

            {/* For companies */}
            <div>
              <h3 className="text-lg font-semibold mb-4">For companies</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Press</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Find talents</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Employer branding</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Arrange a demo</a></li>
              </ul>
            </div>

            {/* App Store Links */}
            <div className="md:col-span-2">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-start space-y-4 md:space-y-0 md:space-x-8">
                <div>
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                    alt="Download on App Store"
                    width={140}
                    height={42}
                    className="cursor-pointer"
                  />
                  <div className="flex items-center mt-2">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(5)}
                    </div>
                    <span className="ml-2 text-gray-600">4.7</span>
                  </div>
                </div>
                <div>
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                    alt="Get it on Google Play"
                    width={160}
                    height={48}
                    className="cursor-pointer"
                  />
                  <div className="flex items-center mt-2">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(4)}{'☆'.repeat(1)}
                    </div>
                    <span className="ml-2 text-gray-600">4.3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap gap-4 mb-4 md:mb-0">
              <a href="#" className="text-gray-600 hover:text-gray-900">Terms of Use</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Imprint</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">About us</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Privacy Settings</a>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">English (US)</span>
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-gray-900"><FaLinkedin size={24} /></a>
                <a href="#" className="text-gray-600 hover:text-gray-900"><FaFacebook size={24} /></a>
                <a href="#" className="text-gray-600 hover:text-gray-900"><FaInstagram size={24} /></a>
              </div>
            </div>
          </div>
          <div className="text-center md:text-right mt-4 text-gray-600">
            Copyright © Disha Yash Eduteck 2021 - 2025
          </div>
        </div>
      </footer>
    </main>
  )
}