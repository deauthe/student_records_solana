# student_records_solana

attempting to put student records on solana

# student_records

## Overview

This smart contract manages student records on Solana, enabling initialization, updates, and authority-based access control. It supports features such as adding achievements and managing authorized groups for data operations. Below is a detailed explanation of the contract's functionality, including functions, parameters, and contexts.

---

## Functions

### **1. Initialize Contract**

#### **Function**: `intialize_contract(ctx: Context<InitializeContract>) -> Result<()>`

- **Description**:  
   Initializes the contract state, setting the student count to zero and preparing an empty list to store student public keys.
- **Context**:
  - **Account**: `contract_state` (mutable): The account to hold the contract state.
- **Parameters**:  
   None.
- **Workflow**:  
   This function must be called first to set up the base state for managing students.

---

### **2. Initialize Student**

#### **Function**: `intitialize_student(ctx: Context<InitializeStudent>, name: String, gpa: u8, roll_no: String) -> Result<()>`

- **Description**:  
   Creates a new student account, initializing it with the provided details. It also updates the contract state to track the student count and stores the student's public key.
- **Context**:
  - **Account**:
    - `student` (mutable): The student account being initialized.
    - `authority`: The signer who initializes the student account.
    - `contract_state` (mutable): The main contract state to track students.
- **Parameters**:
  - `name` (String): Student's name.
  - `gpa` (u8): Student's GPA.
  - `roll_no` (String): Student's roll number.
- **Workflow**:
  - Creates a student account with the specified name, GPA, and roll number.
  - Increments the total student count in the `contract_state`.

---

### **3. Update Student**

#### **Function**: `update_student(ctx: Context<UpdateStudent>, name: String, gpa: u8) -> Result<()>`

- **Description**:  
   Updates the name and GPA of an existing student account.
- **Context**:
  - **Account**:
    - `student` (mutable): The account being updated.
    - `authority`: The signer authorized to make changes.
    - `authority_group`: The group account verifying the authority.
- **Parameters**:
  - `name` (String): Updated name.
  - `gpa` (u8): Updated GPA.
- **Workflow**:
  - Validates authority through the `authority_group`.
  - Updates the student account with new details.

---

### **4. Add Achievement**

#### **Function**: `add_achievement(ctx: Context<AddAchievement>, achievement: String) -> Result<()>`

- **Description**:  
   Adds an achievement to a student’s profile.
- **Context**:
  - **Account**:
    - `student` (mutable): The account to update.
    - `authority`: The signer authorized to make changes.
    - `authority_group`: The group account verifying the authority.
- **Parameters**:
  - `achievement` (String): The achievement to add.
- **Workflow**:
  - Validates authority through the `authority_group`.
  - Appends the achievement to the `achievements` array in the student account.

---

### **5. Initialize Authority Group**

#### **Function**: `intialize_authority_group(ctx: Context<InitializeAuthorityGroup>, authorities: Vec<Pubkey>) -> Result<()>`

- **Description**:  
   Creates a new authority group and initializes it with a list of authorized public keys.
- **Context**:
  - **Account**:
    - `authority_group` (mutable): The group account being initialized.
    - `initializer`: The signer initializing the authority group.
- **Parameters**:
  - `authorities` (Vec): List of public keys to be added as initial authorities.
- **Workflow**:
  - Creates an authority group and stores the provided list of authorities.

---

### **6. Add Authority**

#### **Function**: `add_authority(ctx: Context<AddAuthority>, authority: Pubkey) -> Result<()>`

- **Description**:  
   Adds a new authority to an existing authority group.
- **Context**:
  - **Account**:
    - `authority_group` (mutable): The authority group being updated.
    - `authority`: The signer requesting the addition.
- **Parameters**:
  - `authority` (Pubkey): Public key of the authority to add.
- **Workflow**:
  - Validates the signer against the existing authority group.
  - Adds the new authority to the group if validation succeeds.

---

## Accounts

### **1. Student**

- **Fields**:
  - `authority` (Pubkey): The creator/owner of the student account.
  - `roll_no` (String): Student's roll number.
  - `name` (String): Student's name.
  - `gpa` (u8): Student's GPA.
  - `achievements` (Vec): A list of achievements.

### **2. Contract**

- **Fields**:
  - `students` (u64): The total number of students.
  - `students_list` (Vec): List of public keys for all student accounts.

### **3. Authority Group**

- **Fields**:
  - `authorities` (Vec): List of public keys authorized to make changes.

---

## Getting Started

### Prerequisites

- Node v18.18.0 or higher

- Rust v1.77.2 or higher
- Anchor CLI 0.30.1 or higher
- Solana CLI 1.18.17 or higher

### Installation

#### Clone the repo

```shell
git clone <repo-url>
cd <repo-name>
```

#### Install Dependencies

```shell
pnpm install
```

#### Start the web app

```
pnpm dev
```

## Apps

### anchor

This is a Solana program written in Rust using the Anchor framework.

#### Commands

You can use any normal anchor commands. Either move to the `anchor` directory and run the `anchor` command or prefix the command with `pnpm`, eg: `pnpm anchor`.

#### Sync the program id:

Running this command will create a new keypair in the `anchor/target/deploy` directory and save the address to the Anchor config file and update the `declare_id!` macro in the `./src/lib.rs` file of the program.

You will manually need to update the constant in `anchor/lib/counter-exports.ts` to match the new program id.

```shell
pnpm anchor keys sync
```

#### Build the program:

```shell
pnpm anchor-build
```

#### Start the test validator with the program deployed:

```shell
pnpm anchor-localnet
```

#### Run the tests

```shell
pnpm anchor-test
```

#### Deploy to Devnet

```shell
pnpm anchor deploy --provider.cluster devnet
```

### web

This is a React app that uses the Anchor generated client to interact with the Solana program.

#### Commands

Start the web app

```shell
pnpm dev
```

Build the web app

```shell
pnpm build
```
