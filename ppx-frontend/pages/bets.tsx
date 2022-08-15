import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import clsx from "clsx";
import { NextPage } from "next";

import { BetModal } from "../components/BetModal";
import { Spinner } from "../components/Spinner";
import { useUserBets } from "../hooks/useUserBets";

const Bets: NextPage = () => {
  const { bets } = useUserBets();

  return (
    <div className="px-6 mb-12 text-opacity-80">
      {!bets && (
        <div className="text-center">
          <Spinner className="w-10 h-10 mx-auto mt-10" />
        </div>
      )}
      {bets && (
        <div>
          <h2 className="text-xl font-medium md:text-2xl">Taker side</h2>
          <div className="mt-3">
            {bets.taker.bets.length === 0 && <p>No bets on taker side</p>}
            {bets.taker.bets.length > 0 && (
              <p
                className={clsx(
                  "mb-6 text-xl",
                  bets.taker.pnl > 0 ? "text-green-400" : "text-red-500"
                )}
              >
                PNL: {bets.taker.pnl > 0 && "+"}
                {bets.taker.pnl.toFixed(3)} SOL
              </p>
            )}
            <div className="grid md:grid-cols-2 gap-5 grid-cols-1">
              {bets.taker.bets.map((bet, i) => (
                <div key={i} className="px-4 py-4 border rounded-md">
                  <p>
                    Tournament:{" "}
                    <span className="font-medium">{bet.match.title}</span>
                  </p>
                  <p>
                    Event:{" "}
                    <span className="font-medium">
                      {bet.match.team1} vs. {bet.match.team2}
                    </span>
                  </p>
                  <p>
                    Date:{" "}
                    <span className="font-medium">
                      {new Date(bet.match.date).toDateString()}
                    </span>
                  </p>
                  <p>
                    Status:{" "}
                    <span
                      className="font-medium"
                      style={{ color: bet.statusColor }}
                    >
                      {bet.textStatus}
                      {bet.result && ` - ${bet.result}`}
                    </span>
                  </p>
                  <p>
                    Betting on win of:
                    <span className="font-medium">
                      {" "}
                      {bet.makerSide === 0 ? bet.match.team1 : bet.match.team2}
                    </span>
                  </p>
                  <p>
                    Bet multiplier:{" "}
                    {((bet.betSize.toNumber() / LAMPORTS_PER_SOL) * 10).toFixed(
                      2
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <h2 className="mt-6 text-xl font-medium md:text-2xl">Maker side</h2>
          <div className="mt-3">
            {bets.maker.bets.length === 0 && <p>No bets on maker side</p>}
            {bets.maker.bets.length > 0 && (
              <p
                className={clsx(
                  "mb-6 text-xl",
                  bets.maker.pnl >= 0 ? "text-green-400" : "text-red-500"
                )}
              >
                PNL: {bets.maker.pnl > 0 && "+"}
                {bets.maker.pnl.toFixed(3)} SOL
              </p>
            )}
            <div className="grid md:grid-cols-2 gap-5 grid-cols-1">
              {bets.maker.bets.map((bet, i) => (
                <div key={i} className="px-4 py-4 border rounded-md">
                  <p>
                    Tournament:{" "}
                    <span className="font-medium">{bet.match.title}</span>
                  </p>
                  <p>
                    Event:{" "}
                    <span className="font-medium">
                      {bet.match.team1} vs. {bet.match.team2}
                    </span>
                  </p>
                  <p>
                    Date:{" "}
                    <span className="font-medium">
                      {new Date(bet.match.date).toDateString()}
                    </span>
                  </p>
                  <p>
                    Status:{" "}
                    <span
                      className="font-medium"
                      style={{ color: bet.statusColor }}
                    >
                      {bet.textStatus}
                      {bet.result && ` - ${bet.result}`}
                    </span>
                  </p>
                  <p>
                    Market making on win of:
                    <span className="font-medium">
                      {" "}
                      {bet.makerSide === 0 ? bet.match.team1 : bet.match.team2}
                    </span>
                  </p>
                  <p>
                    Bet multiplier:{" "}
                    {((bet.betSize.toNumber() / LAMPORTS_PER_SOL) * 10).toFixed(
                      2
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <BetModal />
    </div>
  );
};

export default Bets;
