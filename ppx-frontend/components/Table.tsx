import { FunctionComponent } from "react";
import { TakeBetBtn } from "./TakeBetBtn";

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
                          Team A
                      </th>
                      <th scope="col" className="py-3 px-6">
                          Team B
                      </th>
                      <th scope="col" className="py-3 px-6">
                          Prediction
                      </th>
                      <th scope="col" className="py-3 px-6">
                          Time Left
                      </th>
                      <th scope="col" className="py-3 px-6">
                          Size(SOL)
                      </th>
                      <th scope="col" className="py-3 px-6">
                          Payout
                      </th>
                      <th scope="col" className="py-3 px-6">
                          
                      </th>
                  </tr>
              </thead>
              <tbody>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          LOL LCK Summer 2022
                      </th>
                      <td className="py-4 px-6">
                          T1
                      </td>
                      <td className="py-4 px-6">
                          GEN G
                      </td>
                      <td className="py-4 px-6">
                        T1
                      </td>
                      <td className="py-4 px-6">
                          1hr 20mins
                      </td>
                      <td className="py-4 px-6">
                          1
                      </td>
                      <td className="py-4 px-6">
                          120%
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-red-500">Filled</p>
                      </td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          LOL LCK Summer 2022
                      </th>
                      <td className="py-4 px-6">
                          T1
                      </td>
                      <td className="py-4 px-6">
                          GEN G
                      </td>
                      <td className="py-4 px-6">
                        T1
                      </td>
                      <td className="py-4 px-6">
                          1hr 20mins
                      </td>
                      <td className="py-4 px-6">
                          1
                      </td>
                      <td className="py-4 px-6">
                          120%
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-red-500">Filled</p>
                      </td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                  <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          LOL LCK Summer 2022
                      </th>
                      <td className="py-4 px-6">
                          T1
                      </td>
                      <td className="py-4 px-6">
                          GEN G
                      </td>
                      <td className="py-4 px-6">
                      GEN G
                      </td>
                      <td className="py-4 px-6">
                          1hr 20mins
                      </td>
                      <td className="py-4 px-6">
                          1
                      </td>
                      <td className="py-4 px-6">
                          120%
                      </td>
                      <td className="py-4 px-6">
                       <TakeBetBtn/>
                      </td>
                  </tr>
              </tbody>
          </table>
      </div>
    )
}
