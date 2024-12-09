"use client";

import { useConnection } from "@solana/wallet-adapter-react";
import { Cluster, Keypair, PublicKey } from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { useCluster } from "../cluster/cluster-data-access";
import { useAnchorProvider } from "../solana/solana-provider";
import { useTransactionToast } from "../ui/ui-layout";
import * as anchor from "@project-serum/anchor";
import {
	getStudentRecordsProgram,
	getStudentRecordsProgramId,
} from "@project/anchor";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { init } from "next/dist/compiled/webpack/webpack";

export function useStudentRecordsProgram() {
	const { connection } = useConnection();
	const { cluster } = useCluster();
	const transactionToast = useTransactionToast();
	const provider = useAnchorProvider();
	const programId = useMemo(() => {
		return getStudentRecordsProgramId(cluster.network as Cluster);
	}, [cluster]);

	const program = getStudentRecordsProgram(provider);
	const contractStateAccount = PublicKey.findProgramAddressSync(
		[Buffer.from("state")],
		programId
	)[0];
	const accounts = useQuery({
		queryKey: ["student_records", "all", { cluster }],
		queryFn: () => program.account.student.all(),
	});

	const getProgramAccount = useQuery({
		queryKey: ["get-program-account", { cluster }],
		queryFn: () => connection.getParsedAccountInfo(programId),
	});
	const authorityGroupPda = PublicKey.findProgramAddressSync(
		[Buffer.from("authority")],
		program.programId
	)[0];

	const initialize = useMutation({
		mutationKey: ["student_records", "initialize", cluster],
		mutationFn: async () => {
			return program.methods
				.intializeContract()
				.accounts({ user: program.provider.publicKey })
				.rpc();
		},
		onSuccess: (signature) => {
			transactionToast(signature);
			return accounts.refetch();
		},
		onError: (e) => toast.error("Failed to initialize contract" + e.message),
	});

	const addStudentMutation = useMutation({
		mutationKey: ["student_records", "initialize", { cluster }],
		mutationFn: async ({
			rollNo,
			name,
			gpa,
		}: {
			rollNo: string;
			name: string;
			gpa: number;
		}) => {
			return await program.methods
				.initializeStudent(name, gpa, rollNo)
				.accounts({
					authority: program.provider.publicKey,
				})
				.rpc();
		},
		onSuccess: (signature) => {
			transactionToast(signature);
			return accounts.refetch();
		},
		onError: () => toast.error("Failed to initialize account"),
	});

	const initializeAuthorityGroupMutation = useMutation({
		mutationKey: ["student_records", "intializeAuthorityGroup", { cluster }],
		mutationFn: async ({ authorities }: { authorities: PublicKey[] }) => {
			return await program.methods
				.initializeAuthorityGroup(authorities)
				.accounts({
					initializer: program.provider.publicKey,
				})
				.rpc();
		},
		onSuccess: (signature) => {
			transactionToast(signature);
			return accounts.refetch();
		},
	});

	return {
		contractStateAccount,
		program,
		programId,
		accounts,
		getProgramAccount,
		initialize,
		addStudentMutation,
		authorityGroupPda,
		initializeAuthorityGroupMutation,
	};
}

export function useStudentAccount({ account }: { account: PublicKey }) {
	const { cluster } = useCluster();
	const transactionToast = useTransactionToast();
	const { program, accounts } = useStudentRecordsProgram();
	const studentPda = PublicKey.findProgramAddressSync(
		[Buffer.from("student")],
		program.programId
	)[0];

	const authorityGroupPda = PublicKey.findProgramAddressSync(
		[Buffer.from("authority")],
		program.programId
	)[0];

	const accountQuery = useQuery({
		queryKey: ["student_records", "fetch", { cluster, account }],
		queryFn: () => program.account.student.fetch(account),
	});

	const updateStudentMutation = useMutation({
		mutationKey: ["student_records", "updateStudent", { cluster, account }],
		mutationFn: async ({
			rollNo,
			name,
			gpa,
		}: {
			rollNo: string;
			name: string;
			gpa: number;
		}) => {
			return await program.methods
				.updateStudent(rollNo, name, gpa)
				.accounts({
					authority: program.provider.publicKey,
					authorityGroup: authorityGroupPda,
				})
				.rpc();
		},
		onSuccess: (tx) => {
			transactionToast(tx);
			return accountQuery.refetch();
		},
	});

	const addAchievementMutation = useMutation({
		mutationKey: ["student_records", "addAchievement", { cluster }],
		mutationFn: async ({
			studentRollNo,
			newAchievement,
		}: {
			studentRollNo: number;
			newAchievement: string;
		}) => {
			const studentPdaActual = PublicKey.findProgramAddressSync(
				[Buffer.from("student"), Buffer.from(studentRollNo.toString())],
				program.programId
			)[0];

			return await program.methods
				.addAchievement(newAchievement)
				.accounts({
					authorityGroup: authorityGroupPda,
					student: studentPda,
					authority: program.provider.publicKey,
				})
				.rpc();
		},
		onSuccess: (signature) => {
			transactionToast(signature);
			return accountQuery.refetch();
		},
	});

	return {
		accountQuery,
		updateStudentMutation,
		addAchievementMutation,
	};
}

export function useAuthorityAccounts() {
	const { cluster } = useCluster();
	const transactionToast = useTransactionToast();
	const { program, accounts } = useStudentRecordsProgram();

	const authorityGroupPda = PublicKey.findProgramAddressSync(
		[Buffer.from("authority")],
		program.programId
	)[0];

	const accountQuery = useQuery({
		queryKey: ["authority_group", "fetch", { cluster, authorityGroupPda }],
		queryFn: () => program.account.authorityGroup.fetch(authorityGroupPda),
	});

	const addNewAuthorityMutation = useMutation({
		mutationKey: ["student_records", "addNewAuthority", { cluster }],
		mutationFn: async ({ newAuthority }: { newAuthority: PublicKey }) => {
			return await program.methods
				.addAuthority(newAuthority)
				.accounts({
					authority: program.provider.publicKey,
				})
				.rpc();
		},
		onSuccess: (signature) => {
			transactionToast(signature);
			return accountQuery.refetch();
		},
	});

	return {
		accountQuery,
		addNewAuthorityMutation,
	};
}
