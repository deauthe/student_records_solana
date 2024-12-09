use anchor_lang::{prelude::*, solana_program::address_lookup_table::instruction};

use crate::{AuthorityGroup, Contract, Student};

pub fn intitialize_student(
    ctx: Context<InitializeStudent>,
    name: String,
    gpa: u8,
    roll_no: String,
) -> Result<()> {
    msg!("Student PDA seeds: {:?}", (b"student", roll_no.as_bytes()));
    let (expected_pda, bump) =
        Pubkey::find_program_address(&[b"student", roll_no.as_bytes()], ctx.program_id);
    msg!("Expected PDA: {}", expected_pda);

    let student = &mut ctx.accounts.student;
    let contract_state = &mut ctx.accounts.contract_state;
    student.name = name;
    student.gpa = gpa;
    student.achievements = vec![];
    student.roll_no = roll_no;
    // Increment the student counter in the contract state
    contract_state.students += 1;

    // Optionally, store the student's public key in the contract's list of students
    contract_state.students_list.push(student.key());
    Ok(())
}

pub fn update_student(
    ctx: Context<UpdateStudent>,
    roll_no: String,
    name: String,
    gpa: u8,
) -> Result<()> {
    let student = &mut ctx.accounts.student;
    student.name = name;
    student.gpa = gpa;
    Ok(())
}

pub fn add_achievement(ctx: Context<AddAchievement>, achievement: String) -> Result<()> {
    let student = &mut ctx.accounts.student;
    student.achievements.push(achievement);
    Ok(())
}

//

#[derive(Accounts)]
#[instruction(name : String, gpa : u8, roll_no : String)]
pub struct InitializeStudent<'info> {
    #[account(init, payer = authority, space = 8 + Student::INIT_SPACE,
      seeds = [b"student" , roll_no.as_bytes()],
      bump
    )]
    pub student: Account<'info, Student>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,

    #[account(mut, seeds = [b"state"], bump)]
    pub contract_state: Account<'info, Contract>,
}

#[derive(Accounts)]
#[instruction(roll_no : String)]
pub struct UpdateStudent<'info> {
    #[account(mut,seeds = [b"student", roll_no.as_bytes()], bump)]
    pub student: Account<'info, Student>, // Student account to be updated
    #[account(mut)]
    pub authority: Signer<'info>, // Authority updating the profile
    #[account(mut)]
    pub authority_group: Account<'info, AuthorityGroup>,
}

#[derive(Accounts)]
pub struct AddAchievement<'info> {
    #[account(mut)]
    pub student: Account<'info, Student>, // Student account to be updated
    #[account(mut)]
    pub authority: Signer<'info>, // Authority updating the profile
    #[account(mut)]
    pub authority_group: Account<'info, AuthorityGroup>,
}
