use anchor_lang::prelude::*;

pub mod instructions;
pub mod utils;

pub use instructions::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod betting_platform {
    use super::*;

    pub fn create_bet(
        ctx: Context<CreateBet>,
        event_id: String,
        maker_side: u8,
        multiplier: u32,
    ) -> Result<()> {
        instructions::create_bet::handler(ctx, event_id, maker_side, multiplier)
    }
}

#[derive(Accounts)]
pub struct Initialize {}
