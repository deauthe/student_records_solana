use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct AuthorityGroup {
    #[max_len(10, 32)]
    pub authorities: Vec<Pubkey>,
}

impl AuthorityGroup {
    pub const SEED_PREFIX: &'static [u8] = b"authority";
}
