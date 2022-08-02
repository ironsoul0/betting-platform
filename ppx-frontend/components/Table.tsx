import { FunctionComponent } from "react";

export const Table : FunctionComponent = props => {
    return (
        <div className="overflow-x-auto relative">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                      <th scope="col" className="py-3 px-6">
                          Event
                      </th>
                      <th scope="col" className="py-3 px-6">
                          Bet On
                      </th>
                      <th scope="col" className="py-3 px-6">
                          Multipler
                      </th>
                      <th scope="col" className="py-3 px-6">
                          
                      </th>
                  </tr>
              </thead>
              <tbody>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          EDG VS RNG
                      </th>
                      <td className="py-4 px-6">
                          RNG
                      </td>
                      <td className="py-4 px-6">
                          1x
                      </td>
                      <td className="py-4 px-6">
                        <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Take Bet</a>
                      </td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          T1 VS GENG
                      </th>
                      <td className="py-4 px-6">
                          T1
                      </td>
                      <td className="py-4 px-6">
                          1x
                      </td>
                      <td className="py-4 px-6">
                        <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Take Bet</a>
                      </td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                      <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          G2 VS FNC
                      </th>
                      <td className="py-4 px-6">
                          G2
                      </td>
                      <td className="py-4 px-6">
                          2x
                      </td>
                      <td className="py-4 px-6">
                        <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Take Bet</a>
                      </td>
                  </tr>
              </tbody>
          </table>
      </div>
    )




}
