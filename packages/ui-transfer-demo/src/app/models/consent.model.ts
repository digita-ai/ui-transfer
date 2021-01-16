export interface Consent {
    subject: string;
    controller: string;
    for: string;
    created: Date;
    expires: Date;
}
