import * as anchor from "@project-serum/anchor";
import { LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js";
import clsx from "clsx";
import React, { useCallback, useRef, useState } from "react";
import { toast } from "react-toastify";

import { config } from "../config";
import { useModalContext } from "../config/context";
import { MatchBets, useMatches, useSolana } from "../hooks";

export const BetModal: React.FC<{ fetchMatches?: () => Promise<void> }> = ({
  fetchMatches,
}) => {
  const { show, setShow } = useModalContext();
  const { matches } = useMatches();
  const [matchChoice, setMatchChoice] = useState<MatchBets | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [makerSide, setMakerSide] = useState<number | null>(null);
  const [multiplier, setMultiplier] = useState<number | null>(null);
  const { program, wallet } = useSolana();
  const loadingBet = useRef<any>(null);

  const createBet = useCallback(async () => {
    if (!program) return;

    if (!matchChoice || makerSide === null || multiplier === null) return;

    loadingBet.current = toast.loading("Creating bet on-chain..");
    const betAccount = anchor.web3.Keypair.generate();

    try {
      console.log("creating bet..", {
        matchID: matchChoice.match.matchID.toString(),
        makerSide,
        multiplier,
        money: new anchor.BN((multiplier * LAMPORTS_PER_SOL) / 10).toNumber(),
      });

      await program.methods
        .createBet(
          matchChoice.match.matchID.toString(),
          makerSide,
          new anchor.BN((multiplier * LAMPORTS_PER_SOL) / 10)
        )
        .accounts({
          initializer: wallet.publicKey?.toString(),
          betAccount: betAccount.publicKey.toString(),
          betResolver: config.betResolver,
          systemProgram: SystemProgram.programId,
        })
        .signers([betAccount])
        .rpc();
    } catch (err) {
      console.log(err);

      toast.update(loadingBet.current, {
        render: "Transaction failed..",
        type: "error",
        isLoading: false,
      });

      const id = setTimeout(() => {
        toast.dismiss(loadingBet.current);
        loadingBet.current = null;
        clearTimeout(id);
      }, 2000);
    }

    config.connection.onAccountChange(betAccount.publicKey, async () => {
      toast.update(loadingBet.current, {
        render: "Bet is created!",
        type: "success",
        isLoading: false,
      });

      const id = setTimeout(() => {
        toast.dismiss(loadingBet.current);
        loadingBet.current = null;
        clearTimeout(id);
      }, 2000);

      fetchMatches?.();
      setShow(false);
    });
  }, [
    makerSide,
    matchChoice,
    multiplier,
    program,
    wallet,
    setShow,
    fetchMatches,
  ]);

  return (
    <div
      className={clsx(
        "flex items-center justify-center h-screen bg-gray-200 modal-body absolute text-black",
        show && "modal-active"
      )}
    >
      <div
        className={clsx(
          "fixed top-0 left-0 flex items-center justify-center w-full h-full modal",
          !show && "opacity-0 pointer-events-none"
        )}
      >
        <div
          className="absolute w-full h-full bg-gray-900 opacity-50 modal-overlay"
          onClick={() => setShow(false)}
          onKeyDown={() => setShow(false)}
        />
        <div className="z-50 w-11/12 mx-auto overflow-y-auto bg-white rounded shadow-lg modal-container md:max-w-lg">
          <div className="px-6 py-4 text-left modal-content">
            <div className="flex items-center justify-between pb-3">
              <p className="mt-3 text-2xl font-bold">Creating bet</p>
              <div
                className="z-50 cursor-pointer modal-close"
                onClick={() => setShow(false)}
                onKeyDown={() => setShow(false)}
              >
                <svg
                  className="text-black fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                >
                  <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                </svg>
              </div>
            </div>
            {stepIndex === 0 && (
              <>
                <p className="mb-3">Please choose upcoming match to bet on:</p>
                {matches && (
                  <div
                    style={{ maxHeight: 256 }}
                    className="px-4 py-2 overflow-scroll border-2 rounded-md"
                  >
                    {matches.map((match, i) => (
                      <div
                        key={i}
                        className={clsx(
                          "mb-3 cursor-pointer transition-colors",
                          match === matchChoice && "text-indigo-500"
                        )}
                        onClick={() => setMatchChoice(match)}
                        onKeyDown={() => setMatchChoice(match)}
                      >
                        <p className="text-base font-medium">
                          {match.match.title}
                        </p>
                        <p className="text-sm font-medium">
                          {match.match.team1} VS. {match.match.team2}
                        </p>
                        <p className="text-sm font-medium">
                          {new Date(match.match.date).toDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            {stepIndex === 1 && (
              <>
                <p className="text-lg font-medium">
                  {matchChoice?.match.title}
                </p>
                <p className="mb-5 text-base">
                  {new Date(matchChoice?.match.date as number).toDateString()}
                </p>
                <p className="mb-1 text-lg font-medium">Which team?</p>
                <button
                  className={clsx(
                    "block text-base outline-none",
                    makerSide === 0 && "text-indigo-500"
                  )}
                  onClick={() => setMakerSide(0)}
                >
                  {matchChoice?.match.team1}
                </button>
                <button
                  className={clsx(
                    "block text-base outline-none",
                    makerSide === 1 && "text-indigo-500"
                  )}
                  onClick={() => setMakerSide(1)}
                >
                  {matchChoice?.match.team2}
                </button>
                <input
                  type="number"
                  className="px-4 py-1 mt-3 border-2 rounded-md"
                  style={{ maxWidth: 160 }}
                  placeholder="Bet multiplier"
                  onChange={(e) => setMultiplier(parseFloat(e.target.value))}
                />
              </>
            )}
            <div className="flex justify-between pt-2 mt-3">
              {stepIndex === 1 && (
                <button
                  className="px-4 py-2 text-white bg-indigo-500 rounded-lg modal-close hover:bg-indigo-400 transition-all disabled:bg-gray-500 disabled:cursor-not-allowed"
                  disabled={!matchChoice}
                  onClick={() => setStepIndex(0)}
                >
                  Back
                </button>
              )}
              {stepIndex === 0 && (
                <button
                  className="px-4 py-2 ml-auto text-white bg-indigo-500 rounded-lg modal-close hover:bg-indigo-400 transition-all disabled:bg-gray-500 disabled:cursor-not-allowed"
                  disabled={!matchChoice}
                  onClick={() => setStepIndex(1)}
                >
                  Next
                </button>
              )}
              {stepIndex === 1 && (
                <button
                  className="px-4 py-2 text-white bg-indigo-500 rounded-lg modal-close hover:bg-indigo-400 transition-all disabled:bg-gray-500 disabled:cursor-not-allowed"
                  disabled={
                    makerSide === null ||
                    !Number.isFinite(multiplier) ||
                    loadingBet.current
                  }
                  onClick={createBet}
                >
                  Create bet
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
