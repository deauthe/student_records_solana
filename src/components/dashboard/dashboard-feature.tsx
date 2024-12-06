"use client";

import { AppHero } from "../ui/ui-layout";

export default function DashboardFeature() {
	return (
		<div className=" min-h-screen bg-gradient-to-b from-black to-black/40 w-full">
			<AppHero
				title="Student record management"
				subtitle="A dapp to manage student records on chain with Solana"
			/>
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
