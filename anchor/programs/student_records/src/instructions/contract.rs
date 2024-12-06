use crate::state::contract_state::Contract;
use anchor_lang::prelude::*;

pub fn intialize_contract(ctx: Context<InitializeContract>) -> Result<()> {
    let contract_state = &mut ctx.accounts.contract_state;
    contract_state.students = 0;
    contract_state.students_list = Vec::new();
    Ok(())
}

#[derive(Accounts)]
pub struct InitializeContract<'info> {
    #[account(init, payer = user, space = 8 + Contract::INIT_SPACE, seeds = [b"state"], bump)]
    pub contract_state: Account<'info, Contract>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}
