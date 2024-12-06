// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import StudentRecordsIDL from '../target/idl/student_records.json'
import type { StudentRecords } from '../target/types/student_records'

// Re-export the generated IDL and type
export { StudentRecords, StudentRecordsIDL }

// The programId is imported from the program IDL.
export const STUDENT_RECORDS_PROGRAM_ID = new PublicKey(StudentRecordsIDL.address)

// This is a helper function to get the StudentRecords Anchor program.
export function getStudentRecordsProgram(provider: AnchorProvider) {
  return new Program(StudentRecordsIDL as StudentRecords, provider)
}

// This is a helper function to get the program ID for the StudentRecords program depending on the cluster.
export function getStudentRecordsProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the StudentRecords program on devnet and testnet.
      return new PublicKey('CounNZdmsQmWh7uVngV9FXW2dZ6zAgbJyYsvBpqbykg')
    case 'mainnet-beta':
    default:
      return STUDENT_RECORDS_PROGRAM_ID
  }
}
