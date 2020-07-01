//The ReimbursementType model is used to track what kind of 
//reimbursement is being submitted. Type possibilities are `Lodging`, `Travel`, `Food`, or `Other`.

export class ReimbursementType
{
  typeId: number; // primary key
  reimburseType: string // not null, unique
}