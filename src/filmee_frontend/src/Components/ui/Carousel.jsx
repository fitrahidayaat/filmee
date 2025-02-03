import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { ClipLoader } from "react-spinners";  // Import the loader

const Carousel = forwardRef(({ title, movies, scroll }, ref) => {
  return (
    <div className="relative mt-20 px-10 md:px-20">
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      <div className="relative flex items-center">
        <button
          className="absolute left-0 z-100 bg-gray-900 p-3 rounded-full"
          onClick={() => scroll(ref, "left")}
        >
          <FaChevronLeft size={24} />
        </button>
        <div
          ref={ref}
          className="overflow-x-auto flex gap-6 space-x-4 w-full px-12"
          style={{
            msOverflowStyle: "none",
            scrollbarWidth: "none", // Applies to Firefox
          }}
        >
          {movies ? (
            movies.map((movie, index) => (
              <Link
                to={`/movie/${movie.title}`}
                key={index}
                className="min-w-[250px] bg-gray-800 p-4 rounded-4xl shadow-lg relative transform transition-all duration-300 scale-95 hover:scale-100 hover:shadow-xl hover:z-20"
                style={{
                  backgroundImage: `url(${movie.poster_url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "300px", // Set the height for the card
                }}
              >
                {/* Overlay with background opacity */}
                <div className="absolute inset-0 bg-black opacity-20 rounded-4xl"></div>

                <div className="relative z-10 h-full p-4 rounded-4xl flex flex-col justify-end">
                  <h4 className="text-xl font-bold text-white">{movie.title}</h4>
                  <p className="text-xs text-gray-300 line-clamp-2">{movie.overview}</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="flex justify-center items-center w-full h-80">
              <ClipLoader size={50} color={"#ffffff"} loading={true} />
            </div>
          )}
        </div>
        <button
          className="absolute right-0 z-100 bg-gray-900 p-3 rounded-full"
          onClick={() => scroll(ref, "right")}
        >
          <FaChevronRight size={24} />
        </button>
      </div>
    </div>
  );
});

export default Carousel;
