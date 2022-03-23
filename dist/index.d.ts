import { Method } from "axios";
import { Invoice } from "./types";
export declare const configure: (clientIdentifier: string, clientSecret: string, fivaldiPartner: string) => Fivaldi;
export declare const getClient: () => Fivaldi;
export declare class Fivaldi {
    clientIdentifier: string;
    clientSecret: string;
    fivaldiPartner: string;
    constructor(clientIdentifier: string, clientSecret: string, fivaldiPartner: string);
    request: (config: {
        method: Method;
        body?: any;
        uri?: string;
        query?: string;
    }) => Promise<any>;
    /**
     * @param body
     * @description Create a signle new invoice.
     * @example Fivaldi.createInvoice(body)
     */
    createInvoice(body: Invoice): Promise<any>;
    /**
     * @param body
     * @description Create multiple new invoices.
     * @example Fivaldi.createInvoices(body)
     */
    createMultipleInvoices(body: Invoice): Promise<any>;
    /**
     *
     * @param customerId
     * @description Get details of a single customer.
     * @example Fivaldi.getCustomer(customerId)
     */
    getCustomerDetails(customerId: string): Promise<any>;
    /**
     * @description Get company's invoicing details and default values for different params.
     * @example Fivaldi.getCompanyDetails()
     */
    getCompanyInvoicingDetails(): Promise<any>;
}
