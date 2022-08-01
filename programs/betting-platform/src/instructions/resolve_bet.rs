use crate::{states::*, utils::*};
use anchor_lang::solana_program::program::invoke;
use anchor_lang::{prelude::*, solana_program::system_instruction};

pub fn handler(ctx: Context<ResolveBet>, result_side: u8) -> Result<()> {
    let bet_account = &mut ctx.accounts.bet_account;
    let maker_side = bet_account.maker_side;

    let transfer_details = {
        if bet_account.taker == Pubkey::new_from_array(DEFAULT_TAKER) {
            (ctx.accounts.maker_account.clone(), bet_account.bet_size)
        } else if maker_side == result_side {
            (
                ctx.accounts.taker_account.clone(),
                TAKER_BET_SIZE + bet_account.bet_size,
            )
        } else {
            (
                ctx.accounts.maker_account.clone(),
                TAKER_BET_SIZE + bet_account.bet_size,
            )
        }
    };

    invoke(
        &system_instruction::transfer(
            ctx.accounts.bet_resolver.key,
            transfer_details.0.key,
            transfer_details.1,
        ),
        &[
            ctx.accounts.bet_resolver.to_account_info().clone(),
            transfer_details.0,
            ctx.accounts.system_program.to_account_info().clone(),
        ],
    )?;

    bet_account.status = BetStatus::Completed;
    bet_account.result_side = result_side;

    Ok(())
}

#[derive(Accounts)]
pub struct ResolveBet<'info> {
    #[account(mut)]
    pub bet_resolver: Signer<'info>,
    #[account(
        mut,
        constraint = bet_account.bet_resolver == bet_resolver.key(),
        constraint = bet_account.maker == maker_account.key(),
        constraint = bet_account.taker == taker_account.key(),
        constraint = bet_account.status != BetStatus::Completed
    )]
    pub bet_account: Account<'info, Bet>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub maker_account: AccountInfo<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub taker_account: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}
