import { LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js";
import type { NextPage } from "next";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

import { Spinner } from "../components/Spinner";
import { config } from "../config";
import { BetAccount, MatchBets, useMatches, useSolana } from "../hooks";

const INTERVAL_MS = 1000;

const formatNumber = (n: number) => {
  if (n < 10) {
    return `0${n}`;
  }
  return n;
};

const MatchRow = ({
  match,
  teamA,
  teamB,
  currentDate,
  fetchMatches,
}: MatchBets & { currentDate: Date; fetchMatches: () => Promise<void> }) => {
  const loadingBet = useRef<any>(null);
  const { wallet, program } = useSolana();
  const target = useMemo(() => new Date(match.date), [match.date]);
  const { days, hours, minutes, seconds, live } = useMemo(() => {
    let delta = (target.getTime() - currentDate.getTime()) / INTERVAL_MS;
    if (delta < 0) {
      return {
        days: formatNumber(0),
        hours: formatNumber(0),
        minutes: formatNumber(0),
        seconds: formatNumber(0),
        live: true,
      };
    }

    const days = Math.floor(delta / 86400);
    delta -= days * 86400;
    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    const seconds = Math.floor(delta % 60);

    return {
      days: formatNumber(days),
      hours: formatNumber(hours),
      minutes: formatNumber(minutes),
      seconds: formatNumber(seconds),
    };
  }, [currentDate, target]);

  const teamABet = useMemo(() => {
    if (!teamA[0]) return "";
    const bet = teamA[0].betSize;
    return ((bet.toNumber() / LAMPORTS_PER_SOL) * 10).toFixed(2);
  }, [teamA]);

  const teamBBet = useMemo(() => {
    if (!teamB[0]) return "";
    const bet = teamB[0].betSize;
    return ((bet.toNumber() / LAMPORTS_PER_SOL) * 10).toFixed(2);
  }, [teamB]);

  const acceptBet = useCallback(
    (betAccount: BetAccount) => {
      return async () => {
        loadingBet.current = toast.loading("Accepting bet on-chain..");

        try {
          await program.methods
            .matchBet()
            .accounts({
              initializer: wallet.publicKey?.toString(),
              betAccount: betAccount.publicKey.toString(),
              betResolver: betAccount.betResolver.toString(),
              systemProgram: SystemProgram.programId,
            })
            .rpc();
        } catch {
          toast.update(loadingBet.current, {
            render: "Transaction failed..",
            type: "error",
            isLoading: false,
          });

          const id = setTimeout(() => {
            toast.dismiss(loadingBet.current);
            clearTimeout(id);
          }, 2000);
        }

        config.connection.onAccountChange(betAccount.publicKey, async () => {
          toast.update(loadingBet.current, {
            render: "Bet is accepted!",
            type: "success",
            isLoading: false,
          });
          const id = setTimeout(() => {
            toast.dismiss(loadingBet.current);
            clearTimeout(id);
          }, 2000);

          fetchMatches();
        });
      };
    },
    [program, wallet, fetchMatches]
  );

  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white overflow-ellipsis"
        style={{ width: 1 }}
      >
        <p
          style={{ maxWidth: 250 }}
          className="overflow-hidden overflow-ellipsis whitespace-nowrap"
        >
          {match.title}
        </p>
      </th>
      <td className="px-6 py-4">{match.team1}</td>
      <td className="px-6 py-4">{match.team2}</td>
      <td className="px-6 py-4" style={{ width: 1 }}>
        {!live ? (
          <p
            style={{ width: 150 }}
          >{`${days}d ${hours}h ${minutes}m ${seconds}s`}</p>
        ) : (
          <p className="font-medium text-red-500">LIVE!</p>
        )}
      </td>
      <td className="px-6 py-4" style={{ width: 1 }}>
        <button
          className="w-32 h-12 px-4 mr-3 text-white bg-blue-500 hover:bg-opacity-80 transition-all disabled:bg-gray-500 disabled:cursor-not-allowed rounded-md"
          disabled={
            !wallet.connected ||
            !teamABet ||
            loadingBet === teamA[0].publicKey.toString()
          }
          onClick={acceptBet(teamA[0])}
        >
          Team A {teamABet && `- ${teamABet}`}
        </button>
        <button
          className="w-32 h-12 px-4 text-white bg-green-600 hover:bg-opacity-80 transition-all disabled:bg-gray-500 disabled:cursor-not-allowed rounded-md"
          disabled={
            !wallet.connected ||
            !teamBBet ||
            loadingBet === teamB[0].publicKey.toString()
          }
          onClick={acceptBet(teamB[0])}
        >
          Team B {teamBBet && `- ${teamBBet}`}
        </button>
      </td>
    </tr>
  );
};

const Home: NextPage = () => {
  const { matches, fetchMatches } = useMatches();
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    setInterval(() => {
      setCurrentDate(new Date());
    }, INTERVAL_MS);
  }, []);

  return (
    <div className="relative mb-8">
      <div className="items-center justify-center mx-auto">
        <div className="relative overflow-x-auto md:px-6">
          {matches ? (
            <table className="w-full text-sm text-left text-gray-500 table-auto dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Event
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Team A
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Team B
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Time Left
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Betting
                  </th>
                </tr>
              </thead>
              <tbody>
                {matches.map((match, i) => (
                  <MatchRow
                    {...match}
                    currentDate={currentDate}
                    fetchMatches={fetchMatches}
                    key={i}
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center">
              <Spinner className="w-10 h-10 mx-auto mt-10" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
