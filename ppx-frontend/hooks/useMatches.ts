import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { useCallback, useEffect, useState } from "react";

import { config } from "../config";
import { useSolana } from "./useSolana";

export type Match = {
  matchID: number;
  date: number;
  title: string;
  team1: string;
  team2: string;
};

export type BetAccount = {
  publicKey: PublicKey;
  eventId: string;
  makerSide: number;
  maker: PublicKey;
  taker: PublicKey;
  betResolver: PublicKey;
  betSize: anchor.BN;
  resultSide: number;
  status: Record<string, never>;
};

export type MatchBets = {
  match: Match;
  teamA: BetAccount[];
  teamB: BetAccount[];
};

export const useMatches = () => {
  const { program } = useSolana();
  const [matches, setMatches] = useState<MatchBets[] | null>(null);

  const fetchMatches = useCallback(async () => {
    if (!program) return;

    const matches = (
      (await fetch(`${config.apiUrl}/matches?over=false`).then((data) =>
        data.json()
      )) as Match[]
    ).sort((x, y) => (x.date < y.date ? -1 : 1));

    const bets = await program.account.bet.all();
    const validBets = bets.filter((bet) => {
      const status = bet.account.status as any;
      return status["inProgress"];
    });

    const matchBets = matches
      .map((match) => {
        const specificMatchBets = validBets
          .filter((bet) => bet.account.eventId == String(match.matchID))
          .sort((x, y) => (x.account.betSize.lt(y.account.betSize) ? 1 : -1));

        const teamABets = specificMatchBets
          .filter((bet) => bet.account.makerSide === 0)
          .map((bet) => ({
            publicKey: bet.publicKey,
            ...bet.account,
          }));
        const teamBBets = specificMatchBets
          .filter((bet) => bet.account.makerSide === 1)
          .map((bet) => ({
            publicKey: bet.publicKey,
            ...bet.account,
          }));

        return {
          match,
          teamA: teamABets,
          teamB: teamBBets,
        };
      })
      .filter((match) => match.teamA.length > 0 || match.teamB.length > 0);

    setMatches(matchBets);
  }, [program]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return { matches, fetchMatches };
};
