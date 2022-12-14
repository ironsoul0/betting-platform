use crate::states::*;
use crate::utils::DEFAULT_TAKER;
use anchor_lang::solana_program::program::invoke;
use anchor_lang::{prelude::*, solana_program::system_instruction};

pub fn handler(
    ctx: Context<CreateBet>,
    event_id: String,
    maker_side: u8,
    bet_size: u64,
) -> Result<()> {
    let bet_account = &mut ctx.accounts.bet_account;
    bet_account.event_id = event_id;
    bet_account.maker_side = maker_side;
    bet_account.status = BetStatus::InProgress;
    bet_account.bet_resolver = ctx.accounts.bet_resolver.key();
    bet_account.bet_size = bet_size;
    bet_account.maker = ctx.accounts.initializer.key();
    bet_account.taker = Pubkey::new_from_array(DEFAULT_TAKER);

    invoke(
        &system_instruction::transfer(
            ctx.accounts.initializer.key,
            ctx.accounts.bet_resolver.key,
            bet_size as u64,
        ),
        &[
            ctx.accounts.initializer.to_account_info().clone(),
            ctx.accounts.bet_resolver.clone(),
            ctx.accounts.system_program.to_account_info().clone(),
        ],
    )?;

    Ok(())
}

#[derive(Accounts)]
#[instruction(event_id: String)]
pub struct CreateBet<'info> {
    #[account(mut)]
    pub initializer: Signer<'info>,
    #[account(
        init,
        space = Bet::LEN,
        payer = initializer,
    )]
    pub bet_account: Account<'info, Bet>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub bet_resolver: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}