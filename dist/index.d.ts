import { Method } from "axios";
export default class Fivaldi {
    clientIdentifier: string;
    clientSecret: string;
    fivaldiPartner: string;
    constructor(clientIdentifier: string, clientSecret: string, fivaldiPartner: string);
    request: (config: {
        method: Method;
        body?: any;
        uri?: string;
    }) => Promise<any>;
    createInvoice(body: any): Promise<any>;
    createMultipleInvoices(body: any): Promise<any>;
    getCustomerDetails(customerId: string): Promise<any>;
    getCompanyInvoicingDetails(): Promise<any>;
}
