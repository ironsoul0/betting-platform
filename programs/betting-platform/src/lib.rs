use anchor_lang::prelude::*;

pub mod instructions;
pub mod states;
pub mod utils;

pub use instructions::*;

declare_id!("2NTiJusDD3jS5CehvWskRbQQvshceFeZfRZbzKDrURty");

#[program]
pub mod betting_platform {
    use super::*;

    pub fn create_bet(
        ctx: Context<CreateBet>,
        event_id: String,
        maker_side: u8,
        bet_size: u64,
    ) -> Result<()> {
        instructions::create_bet::handler(ctx, event_id, maker_side, bet_size)
    }

    pub fn match_bet(ctx: Context<MatchBet>) -> Result<()> {
        instructions::match_bet::handler(ctx)
    }

    pub fn resolve_bet(ctx: Context<ResolveBet>, result_side: u8) -> Result<()> {
        instructions::resolve_bet::handler(ctx, result_side)
    }
}
