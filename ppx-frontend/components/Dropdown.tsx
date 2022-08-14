import clsx from "clsx";
import { useState } from "react";

export const Dropdown: React.FC = () => {
  const [drop] = useState(false);

  return (
    <button className="relative px-3 py-2 text-sm font-semibold leading-relaxed text-gray-800 bg-white border border-gray-300 rounded-lg dropdown:block transition-colors duration-150 focus:outline-none hover:border-gray-600 focus:shadow-outline focus:border-gray-900">
      <div className="flex items-center">
        <svg
          className="w-4 h-4 text-gray-500 fill-current"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z"></path>
        </svg>
        <span className="px-2 text-gray-700">Sort</span>
        <svg
          className="w-4 h-4 text-gray-500 fill-current"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
            fillRule="evenodd"
          ></path>
        </svg>
      </div>
      <ul
        className={clsx(
          "absolute left-0 w-auto p-2 mt-3 text-sm bg-white border border-gray-100 rounded-lg shadow-lg space-y-2 z-40 overflow-scroll",
          !drop && "hidden"
        )}
        aria-label="submenu"
        style={{ maxHeight: 256 }}
      >
        <a
          className="inline-block w-full px-2 py-1 font-medium text-gray-600 transition-colors duration-150 rounded-md hover:text-gray-900 focus:outline-none focus:shadow-outline hover:bg-gray-100"
          href="#"
        >
          Ascending
        </a>
        <a
          className="inline-block w-full px-2 py-1 font-medium text-gray-600 transition-colors duration-150 rounded-md hover:text-gray-900 focus:outline-none focus:shadow-outline hover:bg-gray-100"
          href="#"
        >
          Descending
        </a>
        <a
          className="inline-block w-full px-2 py-1 font-medium text-gray-600 transition-colors duration-150 rounded-md hover:text-gray-900 focus:outline-none focus:shadow-outline hover:bg-gray-100"
          href="#"
        >
          Ascending
        </a>
      </ul>
    </button>
  );
};
