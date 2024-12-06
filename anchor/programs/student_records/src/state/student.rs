use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Student {
    pub authority: Pubkey,
    #[max_len(26)]
    pub name: String,
    pub gpa: u8,
    #[max_len(6, 20)]
    pub achievements: Vec<String>,
    #[max_len(20)]
    pub roll_no : String,
}
