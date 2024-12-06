import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { StudentRecords } from "../target/types/student_records";
import { log } from "console";

describe("student_records", () => {
	// Configure the client to use the local cluster.
	const provider = anchor.AnchorProvider.env();
	anchor.setProvider(provider);
	const payer = provider.wallet as anchor.Wallet;
	const program = anchor.workspace.StudentRecords as Program<StudentRecords>;

	// Define seeds and bump utilities
	const contractStateSeed = Buffer.from("state");
	const authorityGroupSeed = Buffer.from("authority");

	// Keypairs for accounts
	const studentKeypair = Keypair.generate();
	const authorityKeypair = Keypair.generate();

	// Derived PDAs
	let contractStatePda: PublicKey;
	let authorityGroupPda: PublicKey;

	beforeAll(async () => {
		// Calculate PDA for contract state
		[contractStatePda] = await PublicKey.findProgramAddress(
			[contractStateSeed],
			program.programId
		);
		console.log("contract state", contractStatePda);

		// Calculate PDA for authority group
		[authorityGroupPda] = await PublicKey.findProgramAddress(
			[authorityGroupSeed],
			program.programId
		);
	});

	it("Initializes the contract state", async () => {
		await program.methods
			.intializeContract()
			.accountsStrict({
				contractState: contractStatePda,
				user: payer.publicKey,
				systemProgram: SystemProgram.programId,
			})
			.rpc();

		const state = await program.account.contract.fetch(contractStatePda);
		expect(state.students.toNumber()).toEqual(0);
		expect(state.studentsList).toHaveLength(0);
	});

	it("Initializes a student", async () => {
		const rollNo = "12345"; // Student roll number
		const studentSeed = anchor.utils.bytes.utf8.encode("student");
		const studentRollNo = anchor.utils.bytes.utf8.encode(rollNo);

		// Calculate the student PDA
		const [studentPda, studentBump] = await PublicKey.findProgramAddress(
			[studentSeed],
			program.programId
		);
		console.log("student PDA:", studentPda.toBase58());

		// Call the program method to initialize the student
		await program.methods
			.initializeStudent("John Doe", 7, rollNo)
			.accounts({
				authority: payer.publicKey,
			})
			.rpc();

		// Fetch the initialized student account
		const student = await program.account.student.fetch(studentPda);
		expect(student.name).toEqual("John Doe");
		expect(student.gpa).toEqual(7); // Corrected value (to match test input)
		expect(student.rollNo).toEqual(rollNo);
	});

	it("Initializes an authority group", async () => {
		const authorities = [payer.publicKey, authorityKeypair.publicKey];

		await program.methods
			.initializeAuthorityGroup(authorities)
			.accountsStrict({
				authorityGroup: authorityGroupPda,
				initializer: payer.publicKey,
				systemProgram: SystemProgram.programId,
			})
			.rpc();

		const authorityGroup = await program.account.authorityGroup.fetch(
			authorityGroupPda
		);
		expect(authorityGroup.authorities).toEqual(authorities);
	});

	it("Updates a student", async () => {
		const rollNo = "12345"; // Use the same roll number from initialization
		const studentSeed = Buffer.from("student");
		const studentRollNo = Buffer.from(rollNo);

		// Recalculate the student PDA
		const [studentPda] = await PublicKey.findProgramAddress(
			[studentSeed],
			program.programId
		);

		await program.methods
			.updateStudent("Jane Doe", 9)
			.accounts({
				authority: payer.publicKey,
				authorityGroup: authorityGroupPda,
			})
			.rpc();

		const student = await program.account.student.fetch(studentPda);
		expect(student.name).toEqual("Jane Doe");
		expect(student.gpa).toEqual(9);
	});

	it("Adds an achievement for a student", async () => {
		const rollNo = "12345"; // Use the same roll number from initialization
		const studentSeed = Buffer.from("student");
		const studentRollNo = Buffer.from(rollNo);

		// Recalculate the student PDA
		const [studentPda] = await PublicKey.findProgramAddress(
			[studentSeed],
			program.programId
		);

		const achievement = "Completed Blockchain 101";

		await program.methods
			.addAchievement(achievement)
			.accounts({
				student: studentPda,
				authority: payer.publicKey,
				authorityGroup: authorityGroupPda,
			})
			.rpc();

		const student = await program.account.student.fetch(studentPda);
		expect(student.achievements).toContain(achievement);
	});

	it("Adds a new authority to the authority group", async () => {
		const newAuthority = Keypair.generate().publicKey;

		await program.methods
			.addAuthority(newAuthority)
			.accounts({
				authority: payer.publicKey,
			})
			.rpc();

		const authorityGroup = await program.account.authorityGroup.fetch(
			authorityGroupPda
		);
		expect(authorityGroup.authorities.length).toBe(3);
	});
});