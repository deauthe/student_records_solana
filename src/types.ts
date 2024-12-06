import { PublicKey } from "@solana/web3.js";

export interface UpdateStudentMutationArgs {
	name: string;
	gpa: number;
	student: PublicKey;
	authority: PublicKey;
	authorityGroup: PublicKey;
}
