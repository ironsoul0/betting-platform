import { FunctionComponent } from "react";

export const TakeBetBtn: FunctionComponent = (props) => {
  return (
    <button
      type="button"
      className="px-5 mb-2 mr-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
    >
      Bet
    </button>
  );
};
