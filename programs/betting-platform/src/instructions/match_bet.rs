use crate::{states::*, utils::*};
use anchor_lang::solana_program::program::invoke;
use anchor_lang::{prelude::*, solana_program::system_instruction};

pub fn handler(ctx: Context<MatchBet>) -> Result<()> {
    let bet_account = &mut ctx.accounts.bet_account;

    require!(
        bet_account.status == BetStatus::InProgress,
        ErrorCode::BetMatched
    );

    invoke(
        &system_instruction::transfer(
            ctx.accounts.initializer.key,
            ctx.accounts.bet_resolver.key,
            TAKER_BET_SIZE + TAKER_FEE_SIZE as u64,
        ),
        &[
            ctx.accounts.initializer.to_account_info().clone(),
            ctx.accounts.bet_resolver.clone(),
            ctx.accounts.system_program.to_account_info().clone(),
        ],
    )?;

    bet_account.taker = ctx.accounts.initializer.key();
    bet_account.status = BetStatus::Matched;

    Ok(())
}

#[derive(Accounts)]
pub struct MatchBet<'info> {
    #[account(mut)]
    pub initializer: Signer<'info>,
    #[account(mut, constraint = bet_account.bet_resolver == bet_resolver.key())]
    pub bet_account: Account<'info, Bet>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub bet_resolver: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Can not match bet because it is filled already.")]
    BetMatched,
}
