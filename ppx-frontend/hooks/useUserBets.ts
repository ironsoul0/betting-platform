import * as anchor from "@project-serum/anchor";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useCallback, useEffect, useState } from "react";

import { config } from "../config";
import { BetAccount, Match } from "./useMatches";
import { useSolana } from "./useSolana";

const TAKER_BET_SIZE = new anchor.BN(1e8);
const TAKER_FEE_SIZE = new anchor.BN(2e6);

type BetWithMatch = BetAccount & { match: Match } & {
  textStatus: string;
  statusColor: string;
  result?: string;
};

export type Bets = {
  maker: {
    bets: BetWithMatch[];
    pnl: number;
  };
  taker: {
    bets: BetWithMatch[];
    pnl: number;
  };
};

const mergeMatchAndBets = (
  accounts: BetAccount[],
  matches: Match[],
  taker: boolean
): { bets: BetWithMatch[]; pnl: number } => {
  const getStatus = (account: BetAccount) => {
    if (account.status["inProgress"]) {
      return { textStatus: "Awaiting taker", statusColor: "cyan" };
    } else if (account.status["matched"]) {
      return {
        textStatus: "Matched, awaiting game result",
        statusColor: "yellow",
      };
    } else {
      if (account.taker.toString() == config.defaultTaker.toString()) {
        return {
          textStatus: "Completed with no taker found",
          statusColor: "cyan",
        };
      }

      let result = "";

      if (taker) {
        if (account.makerSide === account.resultSide) {
          result = "Won";
        } else {
          result = "Lost";
        }
      } else {
        if (account.makerSide === account.resultSide) {
          result = "Lost";
        } else {
          result = "Won";
        }
      }

      return {
        textStatus: "Completed and resolved",
        statusColor: result === "Won" ? "rgb(74, 222, 128)" : "red",
        result,
      };
    }
  };

  const bets = accounts.map((account) => {
    const validMatches = matches.filter(
      (match) => String(match.matchID) === account.eventId
    );
    return {
      ...account,
      ...getStatus(account),
      match: validMatches[0],
    };
  });

  let pnl = new anchor.BN(0.0);
  bets.forEach((bet) => {
    if (taker) {
      if (bet.result === "Won") {
        pnl = pnl.add(bet.betSize);
        pnl = pnl.sub(TAKER_FEE_SIZE);
      } else if (bet.result === "Lost") {
        pnl = pnl.sub(TAKER_BET_SIZE);
        pnl = pnl.sub(TAKER_FEE_SIZE);
      }
    } else {
      if (bet.result === "Won") {
        pnl = pnl.add(TAKER_BET_SIZE);
      } else if (bet.result === "Lost") {
        pnl = pnl.sub(bet.betSize);
      }
    }
  });

  return { bets, pnl: pnl.toNumber() / LAMPORTS_PER_SOL };
};

export const useUserBets = () => {
  const { program, wallet } = useSolana();
  const [bets, setBets] = useState<Bets | null>(null);

  const fetchBets = useCallback(async () => {
    if (!program) return;

    const matches = (
      (await fetch(`${config.apiUrl}/matches`).then((data) =>
        data.json()
      )) as Match[]
    ).sort((x, y) => (x.date < y.date ? -1 : 1));

    const bets = await program.account.bet.all();
    const makerBets = bets
      .filter(
        (bet) => bet.account.maker.toString() === wallet.publicKey?.toString()
      )
      .map((bet) => ({
        publicKey: bet.publicKey,
        ...bet.account,
      }));
    const takerBets = bets
      .filter(
        (bet) => bet.account.taker.toString() === wallet.publicKey?.toString()
      )
      .map((bet) => ({
        publicKey: bet.publicKey,
        ...bet.account,
      }));

    setBets({
      maker: mergeMatchAndBets(makerBets, matches, false),
      taker: mergeMatchAndBets(takerBets, matches, true),
    });
  }, [program, wallet]);

  useEffect(() => {
    fetchBets();
  }, [fetchBets]);

  return { bets };
};
