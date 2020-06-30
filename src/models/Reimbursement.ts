//The User model keeps track of users information.
export class Reimbursement {
    reimbursementId: number; // primary key
    author: number;  // for;eign key -> User, not null
    amount: number;  // not null
    dateSubmitted: number; // not null
    dateResolved: number; // not null
    description: string; // not null
    resolver: number; // foreign key -> User
    status: number; // foreign ey -> ReimbursementStatus, not null
    type: number // foreign key -> ReimbursementType
}