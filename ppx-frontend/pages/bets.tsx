import { LAMPORTS_PER_SOL } from "@solana/web3.js";
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
          <div className="mt-6 grid md:grid-cols-2 gap-5 grid-cols-1">
            {bets.taker.length === 0 && <p>No bets on taker side</p>}
            {bets.taker.map((bet, i) => (
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
          <h2 className="mt-6 text-xl font-medium md:text-2xl">Maker side</h2>
          <div className="mt-6 grid md:grid-cols-2 gap-5 grid-cols-1">
            {bets.maker.length === 0 && <p>No bets on maker side</p>}
            {bets.maker.map((bet, i) => (
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
      )}
      <BetModal />
    </div>
  );
};

export default Bets;
