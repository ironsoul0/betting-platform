import { useCallback, useEffect, useState } from "react";

import { config } from "../config";
import { BetAccount, Match } from "./useMatches";
import { useSolana } from "./useSolana";

type BetWithMatch = BetAccount & { match: Match } & {
  textStatus: string;
  statusColor: string;
};

export type Bets = {
  maker: BetWithMatch[];
  taker: BetWithMatch[];
};

const mergeMatchAndBets = (
  accounts: BetAccount[],
  matches: Match[]
): BetWithMatch[] => {
  const getStatus = (account: BetAccount) => {
    if (account.status["inProgress"]) {
      return { textStatus: "Awaiting taker", statusColor: "red" };
    } else if (account.status["matched"]) {
      return {
        textStatus: "Matched, awaiting game result",
        statusColor: "yellow",
      };
    } else {
      return {
        textStatus: "Completed and resolved",
        statusColor: "rgb(74, 222, 128)",
      };
    }
  };

  return accounts.map((account) => {
    const validMatches = matches.filter(
      (match) => String(match.matchID) === account.eventId
    );
    return {
      ...account,
      ...getStatus(account),
      match: validMatches[0],
    };
  });
};

export const useUserBets = () => {
  const { program, wallet } = useSolana();
  const [bets, setBets] = useState<Bets | null>(null);

  const fetchBets = useCallback(async () => {
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
      maker: mergeMatchAndBets(makerBets, matches),
      taker: mergeMatchAndBets(takerBets, matches),
    });
  }, [program, wallet]);

  useEffect(() => {
    fetchBets();
  }, [fetchBets]);

  return { bets };
};
