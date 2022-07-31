use crate::utils::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;

pub fn handler(
    ctx: Context<CreateBet>,
    event_id: String,
    maker_side: u8,
    multiplier: u32,
) -> Result<()> {
    let bet_account = &mut ctx.accounts.bet_account;
    bet_account.event_id = event_id;
    bet_account.maker_side = maker_side;
    bet_account.bet_status = BetStatus::InProgress;
    bet_account.resolver = ctx.accounts.resolver.key();
    bet_account.multiplier = multiplier;

    invoke(
        &system_instruction::transfer(
            ctx.accounts.buyer.key,
            ctx.accounts.seller.key,
            ctx.accounts.escrow_info.list_price as u64,
        ),
        &[
            ctx.accounts.buyer.to_account_info().clone(),
            ctx.accounts.seller.clone(),
            ctx.accounts.system_program.to_account_info().clone(),
        ],
    )?;

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub enum BetStatus {
    InProgress,
    CompletedWithoutMatch,
    Completed,
}

#[account]
pub struct Bet {
    pub event_id: String,
    pub maker_side: u8,
    pub multiplier: u32,
    pub bet_status: BetStatus,
    pub resolver: Pubkey,
}

#[derive(Accounts)]
#[instruction(event_id: String)]
pub struct CreateBet<'info> {
    #[account(mut)]
    pub initializer: Signer<'info>,
    #[account(
        init,
        space = Bet::LEN(),
        payer = initializer,
    )]
    pub bet_account: Account<'info, Bet>,
    pub resolver: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

impl Bet {
    pub fn LEN() -> usize {
        return PUBKEY + 200;
    }
}
