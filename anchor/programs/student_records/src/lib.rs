#![allow(clippy::result_large_err)]

pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;
use instructions::{authority, contract, student, *};

use state::*;

declare_id!("EJ8ErDmqaLffZHWfpsowrNycvbEYJUC4Q3QzMnHdTpMe");

//functions:
//intiialize student
//update student

#[program]
pub mod student_records {
    use super::*;

    pub fn intialize_contract(ctx: Context<InitializeContract>) -> Result<()> {
        contract::intialize_contract(ctx)

    }

    pub fn initialize_student(
        ctx: Context<InitializeStudent>,
        name: String,
        gpa: u8,
        roll_no: String,
    ) -> Result<()> {
        student::intitialize_student(ctx, name, gpa, roll_no)
    }

    pub fn initialize_authority_group(
        ctx: Context<InitializeAuthorityGroup>,
        authorities: Vec<Pubkey>,
    ) -> Result<()> {
        authority::intialize_authority_group(ctx, authorities)
    }

    pub fn add_authority(ctx: Context<AddAuthority>, authority: Pubkey) -> Result<()> {
        authority::add_authority(ctx, authority)
    }

    pub fn update_student(ctx: Context<UpdateStudent>, name: String, gpa: u8) -> Result<()> {
        student::update_student(ctx, name, gpa)
    }

    pub fn add_achievement(ctx: Context<AddAchievement>, achievement: String) -> Result<()> {
        student::add_achievement(ctx, achievement)
    }
}
