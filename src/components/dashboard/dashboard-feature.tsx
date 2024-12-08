"use client";

import { PublicKey } from "@solana/web3.js";
import {
	useStudentRecordsProgram,
	useStudentAccount,
	useAuthorityAccounts,
} from "../student_records/data-access";
import { AppHero, useTransactionToast } from "../ui/ui-layout";
import {
	getStudentRecordsProgram,
	getStudentRecordsProgramId,
} from "@project/anchor";
import toast from "react-hot-toast";
import { useEffect, useMemo, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { useCluster } from "../cluster/cluster-data-access";
import { useAnchorProvider } from "../solana/solana-provider";
import { useQuery } from "@tanstack/react-query";

export default function DashboardFeature() {
	const { connection } = useConnection();
	const { cluster } = useCluster();
	const transactionToast = useTransactionToast();
	const provider = useAnchorProvider();
	const [studentRollNo, setStudentRollNo] = useState<string>();
	const [newStudent, setNewStudent] = useState<{
		rollno?: string;
		name?: string;
		gpa?: number;
	}>();
	const {
		initialize,
		getProgramAccount,
		contractStateAccount,
		authorityGroupPda,
		accounts,
		addStudentMutation,
		program,
		initializeAuthorityGroupMutation,
		programId,
	} = useStudentRecordsProgram();
	const [studentPda, setStudentPda] = useState<PublicKey | undefined>();
	const { accountQuery, addAchievementMutation, updateStudentMutation } =
		useStudentAccount({
			account: studentPda!, // Pass the dynamically calculated PDA
		});

	// Dynamically calculate the student PDA when the roll number changes
	useEffect(() => {
		if (studentRollNo) {
			const calculatedPda = PublicKey.findProgramAddressSync(
				[
					Buffer.from("student"),
					//  Buffer.from(studentRollNo)
				],
				programId // Ensure this is accessible in scope
			)[0];
			setStudentPda(calculatedPda);
		}
	}, [studentRollNo]);

	const authorityGroupPdaQuery = useQuery({
		queryKey: ["authority", "fetch"],
		queryFn: () => {
			return program.account.authorityGroup.fetch(authorityGroupPda);
		},
	});

	const contractStateAccountQuery = useQuery({
		queryKey: ["state", "fetch"],
		queryFn: () => {
			return program.account.contract.fetch(contractStateAccount);
		},
	});

	const createNewStudent = ({
		student,
	}: {
		student: {
			name?: string;
			rollNo?: string;
			gpa?: number;
		};
	}) => {
		if (!student.name || !student.rollNo || !student.gpa) {
			toast.error(
				"please enter all details for the student before creating it"
			);
		} else {
			addStudentMutation.mutateAsync({
				gpa: student.gpa,
				name: student.name,
				rollNo: student.rollNo,
			});
		}
	};

	return (
		<div className=" min-h-screen bg-gradient-to-b from-black to-black/40 w-full">
			<AppHero
				title="Student record management"
				subtitle="A dapp to manage student records on chain with Solana"
			/>
			<section className="max-w-8xl mx-auto py-6 sm:px-6 lg:px-8 text-center grid md:grid-cols-2 gap-10">
				{/* initialize variables */}
				<div className="card rounded-xl   bg-black p-4 ">
					<h1 className="text-xl card-title uppercase">
						initialize the contract{" "}
					</h1>
					<button
						onClick={() => {
							initialize.mutateAsync();
							contractStateAccountQuery.refetch();
						}}
						disabled={
							initialize.isPending ||
							contractStateAccountQuery.data?.students != null
						}
						className="btn btn-primary"
					>
						Initialize Contract
					</button>
					<div className="flex flex-col gap-5">
						<input type="number" placeholder="add Authority" />
						<button
							onClick={() =>
								initializeAuthorityGroupMutation.mutateAsync({
									authorities: [
										new PublicKey(
											"HzKkKrrLoNW97jCsDJvYGEbnLnhveKzkDCvQMTWtZjkG"
										),
									],
								})
							}
							className="btn btn-primary"
							disabled={
								authorityGroupPdaQuery.data?.authorities != null ||
								initializeAuthorityGroupMutation.isPending
							}
						>
							{" "}
							Initialize Authority group : {authorityGroupPda.toString()}
						</button>
					</div>
					<div className="flex flex-col gap-5">
						<div className="card rounded-xl   bg-black p-4">
							<h1 className="text-xl card-title">Create Student</h1>
							<div className="card-body">
								<input
									type="text"
									placeholder="name"
									className="input-bordered input"
									onChange={(e) => {
										const updatedStudent = {
											...newStudent,
											name: e.target.value,
										};
										setNewStudent(updatedStudent);
										console.log("new student", newStudent);
									}}
								/>
								<input
									type="number"
									placeholder="gpa"
									className="input-bordered input"
									onChange={(e) => {
										const updatedStudent = {
											...newStudent,
											gpa: Number(e.target.value),
										};
										setNewStudent(updatedStudent);
									}}
								/>
								<input
									type="text"
									placeholder="roll number"
									className="input-bordered input"
									onChange={(e) => {
										const updatedStudent = {
											...newStudent,
											rollNo: e.target.value,
										};
										setNewStudent(updatedStudent);
									}}
								/>
								<div className="grid md:grid-cols-2 gap-5 ">
									<button
										className="btn btn-primary"
										onClick={() => {
											newStudent
												? createNewStudent({ student: newStudent })
												: toast.error("student not defined");
										}}
									>
										Create
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* student info */}
				<div className="card rounded-xl bg-black p-4 ">
					<h1 className="card-title">Get student info</h1>
					<div className="card-body">
						<input
							type="text"
							placeholder="roll number"
							className="input-bordered input"
							onChange={(e) => setStudentRollNo(e.target.value)}
						/>
						<div className="kbd-lg">{accountQuery.data}</div>
						<div className="grid md:grid-cols-2 gap-5 ">
							<button className="btn btn-primary">Create</button>
						</div>
					</div>
				</div>
			</section>
			<section className="max-w-8xl mx-auto py-6 sm:px-6 lg:px-8 text-center grid md:grid-cols-2 gap-10">
				{/* card 1  */}
				<div className="card rounded-xl   bg-black p-4">
					<h1 className="text-xl card-title">Create Student</h1>
					<div className="card-body">
						<input
							type="text"
							placeholder="name"
							className="input-bordered input"
						/>
						<input
							type="text"
							placeholder="gpa"
							className="input-bordered input"
						/>
						<input
							type="text"
							placeholder="Achievements separated by a comma"
							className="input-bordered input"
						/>
						<div className="grid md:grid-cols-2 gap-5 ">
							<button className="btn btn-primary">Create</button>
						</div>
					</div>
				</div>

				{/* card 2  */}
				<div className="card rounded-xl   bg-black p-4">
					<h1 className="text-xl card-title">Delete Student</h1>
					<div className="card-body">
						<input
							type="text"
							placeholder="public key address"
							className="input-bordered input"
						/>
						<div className="grid md:grid-cols-2 gap-5 ">
							<button className="btn bg-red-700">Delete</button>
							<button className="btn btn-ghost border-[1px] border-white/30">
								Find Public Key
							</button>
						</div>
					</div>
				</div>

				{/* card 3  */}
				<div className="card rounded-xl   bg-black p-4">
					<h1 className="text-xl card-title">Update Student</h1>
					<div className="card-body">
						<input
							type="text"
							placeholder="name"
							className="input-bordered input"
						/>
						<input
							type="text"
							placeholder="gpa"
							className="input-bordered input"
						/>
						<input
							type="text"
							placeholder="public key address"
							className="input-bordered input"
						/>
						<div className="grid md:grid-cols-2 gap-5 ">
							<button className="btn btn-primary">Update</button>
							<button className="btn btn-ghost border-[1px] border-white/30">
								Find Public Key
							</button>
						</div>
					</div>
				</div>

				{/* card 4  */}
				<div className="card rounded-xl   bg-black p-4">
					<h1 className="text-xl card-title">
						Add Achievements to Student profile
					</h1>
					<div className="card-body">
						<input
							type="text"
							placeholder="public key address"
							className="input-bordered input"
						/>
						<input
							type="text"
							placeholder="Achievements separated by a comma"
							className="input-bordered input"
						/>

						<div className="grid md:grid-cols-2 gap-5 ">
							<button className="btn btn-primary">Add</button>
							<button className="btn btn-ghost border-[1px] border-white/30">
								Find Public Key
							</button>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
