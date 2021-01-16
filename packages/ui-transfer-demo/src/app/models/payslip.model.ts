export interface PaySlip {
    employer: string;
    employee: string;
    from: Date;
    until: Date;
    stature: string;
    dependent: number;
    wageUnit: string;
    grossAmount: number;
    taxableAmount: number;
    netAmount: number;
}
