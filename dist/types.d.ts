export declare type Buyer = {
    buyerOrganisationName: string | null;
    buyerOrganisationName2: string | null;
    countryCode: string | null;
    countryName?: string;
    postCodeIdentifier?: string | null;
    streetName: string | null;
    streetName2: string | null;
    townName: string | null;
};
export declare type Recipient = {
    countryCode: string | null;
    contryName?: string;
    postCodeIdentifier?: string | null;
    recipientOrganisationName: string | null;
    recipientOrganisationName2: string | null;
    streetName: string | null;
    streetName2: string | null;
    townName: string | null;
};
export declare type SalesOrder = {
    accountDimension: string | null;
    accountDimension2: string | null;
    accountDimension3: string | null;
    accountDimension4: string | null;
    changeTime?: string;
    changeUser?: string;
    description: string | null;
    discrountRate?: number;
    internalDescription?: string;
    productCode: string | null;
    quantity?: number;
    rowFreeText: string | null;
    textRow?: boolean;
    unitPriceExcludingTaxt?: number;
    totalSumIncludingTax?: number;
    unitId: string | null;
};
export declare type Invoice = {
    accountDimensionText?: string | null;
    agreementIdentifier?: string | null;
    buyer: Buyer;
    buyerReferenceIdentifier: string | null;
    /**
     * @type {string}
     * @memberof Invoice
     * @description Change time of sales order (Muutosaika).
     */
    changeTime?: string;
    /**
     * @type {string}
     * @memberof Invoice
     * @description Change user of sales order (Muutoskäyttäjä).
     */
    changeUser?: string;
    /**
     * @type {string}
     * @memberof Invoice
     * @description Create time of sales order (Luontiaika).
     */
    createTime?: string;
    /**
     * @type {string}
     * @memberof Invoice
     * @description Create user of sales order (Luontikäyttäjä).
     */
    createUser?: string;
    cuid: string | null;
    /**
     * @type {string}
     * @memberof Invoice
     * @description Currency of order / Only EUR supported (Valuutta).
     */
    currency: string;
    /**
     * @type {string}
     * @memberof Invoice
     * @description Currency rate of currency / Only 1 supported (Kurssi).
     */
    currencyRate: number;
    customerId: string;
    deliverDate: string | null;
    languageCode: string | null;
    orderDate: string | null;
    orderNumber: string | null;
    orderStatus: string | null;
    paymentTermId: string | null;
    postingGroupId: string;
    readyToInvoice?: boolean;
    recipient?: Recipient;
    salesOrderRowDTOS: SalesOrder[];
    salesPersonId: string | null;
    tenderReference: string | null;
    totalVatAmount?: number;
    totalVatExcludedAmount?: number;
    totalVatIncludedAmount?: number;
    transmissionTypeId: string | null;
};
