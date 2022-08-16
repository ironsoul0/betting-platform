import { NextPage } from "next";
import { BsTwitter } from "react-icons/bs";

const About: NextPage = () => {
  return (
    <div className="px-6 text-opacity-80">
      <div className="max-w-4xl">
        <p className="mb-4">
          This project was created while participating in{" "}
          <a
            href="https://solana.com/summercamp"
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            Solana Summer Camp
          </a>{" "}
          in Singapore.
        </p>
        <p className="mb-4">
          <span className="font-bold">PPX</span> is a fully decentralized P2P
          betting platform built on Solana. We allow our users to market make
          the bets and search for people willing to take the opppside side of a
          bet.
        </p>
        <p>
          Bet market makers create on-chain bets for some event and put
          multiplier for the outcome. Takers can accept the bet by depositing
          0.1 SOL into contract. Their potential win is{" "}
          <span className="font-medium">0.1 SOL * multiplier </span> provided by
          a market maker.
        </p>
      </div>

      <div className="flex items-center justify-center mt-10">
        <a
          href="https://twitter.com/PPXBet?s=20&t=Zjuk60SAH89bPvXt6V5Lwg/"
          target="_blank"
        >
          <BsTwitter />
        </a>
      </div>
    </div>
  );
};

export default About;
