use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Contract {
    pub students: u64,
    // List of student public keys
    #[max_len(20)]
    pub students_list: Vec<Pubkey>,
}

impl Contract {
    pub const SEED_PREFIX: &'static [u8] = b"state";
}
