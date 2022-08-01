use crate::utils::*;
use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum BetStatus {
    InProgress,
    Matched,
    Completed,
}

#[account]
pub struct Bet {
    pub event_id: String,
    pub maker_side: u8,
    pub result_side: u8,
    pub bet_size: u64,
    pub status: BetStatus,
    pub maker: Pubkey,
    pub taker: Pubkey,
    pub bet_resolver: Pubkey,
}

const BET_EVENT_ID_SIZE: usize = 8;

impl Bet {
    pub const LEN: usize =
        { DISCRIMINATOR + BET_EVENT_ID_SIZE + PUBKEY + PUBKEY + U64 + U64 + U64 + U64 };
}
