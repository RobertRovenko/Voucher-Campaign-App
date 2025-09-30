export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-600 py-6 mt-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm">
        {/* Left: copyright */}
        <span>© {new Date().getFullYear()} Voucher Manager</span>

        {/* Right: optional links */}
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a
            href="#"
            className="hover:text-black transition-colors duration-200"
          >
            Privacy
          </a>
          <a
            href="#"
            className="hover:text-black transition-colors duration-200"
          >
            Terms
          </a>
          <a
            href="#"
            className="hover:text-black transition-colors duration-200"
          >
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}
