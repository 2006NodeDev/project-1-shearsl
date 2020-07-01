//The User model keeps track of users information.
export class Reimbursement {
    reimbursementId: number; // primary key
    userId: number;  // foreign key -> User, not null
    amount: number;  // not null
    dateSubmitted: number; // not null
    dateResolved: number; // not null
    description: string; // not null
    resolver: number; // foreign key -> User
    statusId: number; // foreign key -> ReimbursementStatus, not null
    typeId: number // foreign key -> ReimbursementType
}