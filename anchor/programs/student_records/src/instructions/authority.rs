use crate::state::authority::AuthorityGroup;
use anchor_lang::prelude::*;

pub fn intialize_authority_group<'info>(
    ctx: Context<InitializeAuthorityGroup>,
    authorities: Vec<Pubkey>,
) -> Result<()> {
    let authority_group = &mut ctx.accounts.authority_group;
    authority_group.authorities = authorities;
    Ok(())
}

pub fn add_authority(ctx: Context<AddAuthority>, authority: Pubkey) -> Result<()> {
    let authority_group = &mut ctx.accounts.authority_group;
    let signer = &mut ctx.accounts.authority;

    // Check if the signer is already in the list of authorities
    for existing_authority in &authority_group.authorities {
        if signer.key() == *existing_authority {
            msg!("Signer is already an authority. Adding new authority...");
            break;
        }
    }

    // If the authority isn't in the list, add it
    if !authority_group.authorities.contains(&authority) {
        authority_group.authorities.push(authority);
        msg!("New authorities: {:?}", authority_group.authorities);
    } else {
        msg!("Authority already exists in the list.");
    }

    Ok(())
}


#[derive(Accounts)]
pub struct InitializeAuthorityGroup<'info> {
    #[account(init, payer = initializer, space = 8 + AuthorityGroup::INIT_SPACE, seeds = [AuthorityGroup::SEED_PREFIX], bump)]
    pub authority_group: Account<'info, AuthorityGroup>,
    #[account(mut)]
    pub initializer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddAuthority<'info> {
    #[account(mut, seeds = [AuthorityGroup::SEED_PREFIX], bump)]
    pub authority_group: Account<'info, AuthorityGroup>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}
