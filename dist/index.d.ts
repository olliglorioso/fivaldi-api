import { Method } from "axios";
export default class Fivaldi {
    baseUrl: string;
    clientIdentifier: string;
    clientSecret: string;
    fivaldiPartner: string;
    companyId: string;
    constructor(clientIdentifier: string, clientSecret: string, fivaldiPartner: string);
    request: (config: {
        method: Method;
        body?: any;
        uri?: string;
    }) => Promise<any>;
    createInvoice(body: any): Promise<void>;
    createMultipleInvoices(body: any): Promise<void>;
    getCustomerDetails(customerId: string): Promise<void>;
}
