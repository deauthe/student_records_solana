"use client";

import { Keypair, PublicKey } from "@solana/web3.js";
import { useMemo } from "react";
import { ellipsify } from "../ui/ui-layout";
import { ExplorerLink } from "../cluster/cluster-ui";
import { useStudentRecordsProgram, useStudentAccount } from "./data-access";

export function StudentRecordsCreate() {
	const { initialize } = useStudentRecordsProgram();

	return (
		<button
			className="btn btn-xs lg:btn-md btn-primary"
			onClick={() => initialize.mutateAsync()}
			disabled={initialize.isPending}
		>
			Create {initialize.isPending && "..."}
		</button>
	);
}

export function StudentRecordsList() {
	const { accounts, getProgramAccount } = useStudentRecordsProgram();

	if (getProgramAccount.isLoading) {
		return <span className="loading loading-spinner loading-lg "></span>;
	}
	if (!getProgramAccount.data?.value) {
		return (
			<div className="alert alert-info flex justify-center size">
				<span>
					Program account not found. Make sure you have deployed the program and
					are on the correct cluster.
				</span>
			</div>
		);
	}
	return (
		<div className={"space-y-6"}>
			{accounts.isLoading ? (
				<span className="loading loading-spinner loading-lg"></span>
			) : accounts.data?.length ? (
				<div className="grid md:grid-cols-2 gap-4">
					{accounts.data?.map((account) => (
						<StudentRecordsCard
							key={account.publicKey.toString()}
							account={account.publicKey}
						/>
					))}
				</div>
			) : (
				<div className="text-center">
					<h2 className={"text-2xl"}>No accounts</h2>
					No accounts found. Create one above to get started.
				</div>
			)}
		</div>
	);
}

function StudentRecordsCard({ account }: { account: PublicKey }) {
	const { accountQuery } = useStudentAccount({
		account,
	});

	const rollNo = useMemo(
		() => accountQuery.data?.rollNo ?? 0,
		[accountQuery.data?.rollNo]
	);
	const name = useMemo(
		() => accountQuery.data?.name ?? 0,
		[accountQuery.data?.name]
	);
	const authorities = useMemo(
		() => accountQuery.data?.authority ?? 0,
		[accountQuery.data?.authority]
	);
	const gpa = useMemo(
		() => accountQuery.data?.gpa ?? 0,
		[accountQuery.data?.gpa]
	);

	return accountQuery.isLoading ? (
		<span className="loading loading-spinner loading-lg"></span>
	) : (
		<div className="card card-bordered p-4 border-base-300 border-4 text-neutral-content">
			<h2
				className="card-title text-3xl cursor-pointer"
				onClick={() => accountQuery.refetch()}
			>
				{name}
			</h2>
			<div className="card-body  items-start p-0 text-left">
				<div className="space-y-6 ">
					<div className="flex flex-col gap-3">
						<h3
							className="justify-start pt-5 text-xl font-bold"
							onClick={() => accountQuery.refetch()}
						>
							Roll no : <span className="kbd kbd-lg">{rollNo}</span>
						</h3>
						<h3 className="" onClick={() => accountQuery.refetch()}>
							GPA : <span className="kbd kbd-lg ">{gpa}</span>
						</h3>
					</div>
					<div className="text-center space-y-4">
						<p>
							<ExplorerLink
								path={`account/${account}`}
								label={ellipsify(account.toString())}
							/>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
