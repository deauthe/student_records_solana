"use client";

import {
	getStudentRecordsProgram,
	getStudentRecordsProgramId,
} from "@project/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import { Cluster, Keypair, PublicKey } from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { useCluster } from "../cluster/cluster-data-access";
import { useAnchorProvider } from "../solana/solana-provider";
import { useTransactionToast } from "../ui/ui-layout";
import * as anchor from "@project-serum/anchor";
import { UpdateStudentMutationArgs } from "@/types";

export function useStudentRecordsProgram() {
	const { connection } = useConnection();
	const { cluster } = useCluster();
	const transactionToast = useTransactionToast();
	const provider = useAnchorProvider();
	const programId = useMemo(
		() => getStudentRecordsProgramId(cluster.network as Cluster),
		[cluster]
	);
	const program = getStudentRecordsProgram(provider);

	const accounts = useQuery({
		queryKey: ["student_records", "all", { cluster }],
		queryFn: () => program.account.student.all(),
	});

	const getProgramAccount = useQuery({
		queryKey: ["get-program-account", { cluster }],
		queryFn: () => connection.getParsedAccountInfo(programId),
	});

	const initialize = useMutation({
		mutationKey: ["student_records", "initialize", { cluster }],
		mutationFn: (keypair: Keypair) =>
			program.methods
				.initializeStudent("anurag", 9.58)
				.accounts({ authority: keypair.publicKey })
				.signers([keypair])
				.rpc(),
		onSuccess: (signature) => {
			transactionToast(signature);
			return accounts.refetch();
		},
		onError: () => toast.error("Failed to initialize account"),
	});

	return {
		program,
		programId,
		accounts,
		getProgramAccount,
		initialize,
	};
}

export function useStudentRecordsProgramAccount({
	account,
}: {
	account: PublicKey;
}) {
	const { cluster } = useCluster();
	const transactionToast = useTransactionToast();
	const { program, accounts } = useStudentRecordsProgram();

	const accountQuery = useQuery({
		queryKey: ["student_records", "fetch", { cluster, account }],
		queryFn: () => program.account.student_records.fetch(account),
	});

	const closeMutation = useMutation({
		mutationKey: ["student_records", "close", { cluster, account }],
		mutationFn: () =>
			program.methods.close().accounts({ student_records: account }).rpc(),
		onSuccess: (tx) => {
			transactionToast(tx);
			return accounts.refetch();
		},
	});

	const decrementMutation = useMutation({
		mutationKey: ["student_records", "decrement", { cluster, account }],
		mutationFn: () =>
			program.methods.decrement().accounts({ student_records: account }).rpc(),
		onSuccess: (tx) => {
			transactionToast(tx);
			return accountQuery.refetch();
		},
	});

	const incrementMutation = useMutation({
		mutationKey: ["student_records", "increment", { cluster, account }],
		mutationFn: () =>
			program.methods.increment().accounts({ student_records: account }).rpc(),
		onSuccess: (tx) => {
			transactionToast(tx);
			return accountQuery.refetch();
		},
	});

	const updateStudentMutation = useMutation({
		mutationKey: ["student_records", "updateStudent", { cluster, account }],
		mutationFn: ({
			name,
			gpa,
			student,
			authority,
			authorityGroup,
		}: UpdateStudentMutationArgs) =>
			program.methods
				.updateStudent("anurag".toString(), gpa)
				.accounts({ student, authority, authorityGroup })
				.rpc(),
		onSuccess: (tx) => {
			transactionToast(tx);
			return accountQuery.refetch();
		},
	});

	return {
		accountQuery,
		closeMutation,
		decrementMutation,
		incrementMutation,
		updateStudentMutation,
	};
}
