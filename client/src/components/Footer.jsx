import React from "react";
import { Link } from "react-router-dom";
import { BsFacebook, BsInstagram, BsTelegram } from "react-icons/bs";
import { FaFacebookF, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { IoLocation } from "react-icons/io5";
import { FaPhone } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-cyan-950">
      <div className="mx-auto max-w-screen-xl px-4 pb-6 pt-16 sm:px-6 lg:px-8 lg:pt-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <Link to="/" className="dark:text-white">
              <div className="flex items-center">
                <img src="/logo.png" className="mr-2 h-8" alt="Flowbite Logo" />
                <span className="font-bold text-2xl font-poppins text-white">marifah.id</span>
              </div>
            </Link>
            <p className="mt-6 max-w-md text-center leading-relaxed text-white sm:max-w-xs sm:text-left">Menebar ilmu dibumi meraih ridho Ilahi meraih kebahagiaan yang hakiki</p>
            {/* Social links Start */}
            <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
              <li>
                <a href="#" rel="noreferrer" target="_blank" className="text-white transition hover:text-indigo-600">
                  <span className="sr-only">Facebook</span>
                  <FaFacebookF className="size-6" />
                </a>
              </li>
              <li>
                <a href="#" rel="noreferrer" target="_blank" className="text-white transition hover:text-indigo-600">
                  <span className="sr-only">Instagram</span>
                  <FaInstagram className="size-6" />
                </a>
              </li>
              <li>
                <a href="https://github.com/faqihfnf" rel="noreferrer" target="_blank" className="text-white transition hover:text-indigo-600">
                  <span className="sr-only">GitHub</span>
                  <FaGithub className="size-6" />
                </a>
              </li>

              <li>
                <a href="https://www.linkedin.com/in/faqih-nur-fahmi-b51bb1ab/" rel="noreferrer" target="_blank" className="text-white transition hover:text-indigo-600">
                  <span className="sr-only">LinkedIn</span>
                  <FaLinkedin className="size-6" />
                </a>
              </li>
            </ul>
            {/* Social links End */}
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:col-span-2">
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-white">Our Services</p>

              {/* <ul className="mt-8 space-y-4 text-sm">
                <li>
                  <a className="text-white/70 transition hover:text-indigo-600" href="/wawancara">
                    Mock Interview
                  </a>
                </li>

                <li>
                  <a className="text-white/70 transition hover:text-indigo-600 relative" href="/cv-review">
                    <span>CV Review</span>
                    <span className="text-yellow-400 text-xs font-bold absolute top-[-6px] ml-1">soon</span>
                  </a>
                </li>

                <li>
                  <a className="text-white/70 transition hover:text-indigo-600 relative" href="/cv-maker">
                    <span>CV Maker</span>
                    <span className="text-yellow-400 text-xs font-bold absolute top-[-6px] ml-1">soon</span>
                  </a>
                </li>
              </ul> */}
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-white">Helpful Links</p>

              <ul className="mt-8 space-y-4 text-sm">
                <li>
                  <a className="text-white/70 transition hover:text-indigo-600" href="#faq">
                    {" "}
                    FAQs{" "}
                  </a>
                </li>

                <li>
                  <a
                    href="https://wa.me/628996423135" // Menggunakan wa.me untuk tautan langsung
                    target="_blank" // Membuka di tab baru
                    rel="noopener noreferrer" // Untuk keamanan
                    className="text-white/70 transition hover:text-indigo-600"
                  >
                    {" "}
                    Support{" "}
                  </a>
                </li>

                <li>
                  <a
                    href="https://wa.me/628996423135" // Menggunakan wa.me untuk tautan langsung
                    target="_blank" // Membuka di tab baru
                    rel="noopener noreferrer" // Untuk keamanan
                    className="group flex gap-1.5 sm:justify-start justify-center items-center"
                  >
                    <span className="text-white/70 transition group-hover:text-indigo-600">Live Chat</span>
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>
                      <span className="relative inline-flex size-2 rounded-full bg-teal-500"></span>
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-white">Kontak Kami</p>

              <ul className="mt-8 space-y-4 text-sm">
                <li>
                  <a className="flex items-center justify-center gap-1.5 " href="#">
                    <MdOutlineEmail className="size-5 shrink-0 text-white" />
                    <span className="sm:flex-1 text-white/70">faqih.fnf@gmail.com</span>
                  </a>
                </li>

                <li>
                  <a className="flex items-center justify-center gap-1.5 " href="#">
                    <FaPhone className="size-4 shrink-0 text-white" />
                    <span className="sm:flex-1 text-white/70">+62 899 6423 135</span>
                  </a>
                </li>

                <li className="flex items-start justify-center gap-1.5 ">
                  <IoLocation className="size-5 shrink-0 text-white" />
                  <address className="-mt-0.5 sm:flex-1 not-italic text-white/70">
                    Kampung Makasar, Jakarta Timur, <br /> DKI Jakarta - Indonesia
                  </address>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-100 pt-6">
          <div className="text-center sm:flex sm:justify-between sm:text-left">
            <p className="text-sm text-gray-300">
              Created with ❤️ by <span className="bg-gradient-to-l from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-md font-extrabold text-transparent sm:text-md">Faqih Nur Fahmi</span>
            </p>
            <p className="mt-4 text-sm text-gray-300 sm:order-first sm:mt-0">Copyright &copy; {new Date().getFullYear()} All Rights Reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
