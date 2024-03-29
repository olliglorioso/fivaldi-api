"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fivaldi = exports.getClient = exports.configure = void 0;
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const LF = '\u000a';
const md5 = (body) => {
    if (typeof body === "object" && !(body instanceof Buffer)) {
        body = JSON.stringify(body);
    }
    return crypto_1.default.createHash("md5").update(body).digest("hex");
};
const hmac = (content, clientSecret) => {
    return crypto_1.default
        .createHmac("sha256", clientSecret)
        .update(content)
        .digest("base64");
};
let _client;
const configure = (clientIdentifier, clientSecret, fivaldiPartner) => {
    _client = new Fivaldi(clientIdentifier, clientSecret, fivaldiPartner);
    return _client;
};
exports.configure = configure;
const getClient = () => {
    if (!_client) {
        throw new Error("You must configure the module before accessing the client");
    }
    return _client;
};
exports.getClient = getClient;
class Fivaldi {
    constructor(clientIdentifier, clientSecret, fivaldiPartner) {
        this.request = (config) => __awaiter(this, void 0, void 0, function* () {
            const baseUrl = "https://api.fivaldi.net";
            const { body, method, uri } = config;
            let bodyMD5 = "";
            let contentType = "";
            const query = config.query || "";
            const timestamp = Math.floor(new Date().getTime() / 1000).toString();
            let headers = [
                { key: "X-Fivaldi-Partner", value: this.fivaldiPartner },
                { key: "X-Fivaldi-Timestamp", value: timestamp },
            ];
            if (body) {
                bodyMD5 = md5(body);
                contentType = "application/json";
                headers.push({ key: "Content-Type", value: contentType });
            }
            let stringToSign = [
                method || "GET",
                bodyMD5,
                contentType,
                ...headers.sort(function (a, b) {
                    return a.key.toLowerCase().localeCompare(b.key.toLowerCase());
                }).filter(header => header.key.startsWith("X-Fivaldi"))
                    .map(header => `${header.key.trim().toLowerCase()}:${typeof header.value === "string" ? header.value.trim() : header.value}`),
                uri
            ].join(LF);
            if (query) {
                stringToSign += LF + query;
            }
            const mac = hmac(stringToSign, this.clientSecret);
            headers.push({ key: "Authorization", value: `Fivaldi ${mac}` });
            const axiosResponse = yield (0, axios_1.default)({
                method,
                url: baseUrl + uri + query,
                headers: headers.reduce((result, header) => {
                    result[header.key] = header.value;
                    return result;
                }, {}),
                data: body
            });
            return axiosResponse.data;
        });
        this.clientIdentifier = clientIdentifier;
        this.clientSecret = clientSecret;
        this.fivaldiPartner = fivaldiPartner;
    }
    /**
     * @param body
     * @description Create a signle new invoice.
     * @example Fivaldi.createInvoice(body)
     */
    createInvoice(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request({
                body,
                method: "POST",
                uri: `/customer/api/companies/${this.clientIdentifier}/sales/sales-order`
            });
        });
    }
    /**
     * @param body
     * @description Create multiple new invoices.
     * @example Fivaldi.createInvoices(body)
     */
    createMultipleInvoices(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request({
                body,
                method: "POST",
                uri: `/customer/api/companies/${this.clientIdentifier}/sales/multiple-sales-orders`
            });
        });
    }
    /**
     *
     * @param customerId
     * @description Get details of a single customer.
     * @example Fivaldi.getCustomer(customerId)
     */
    getCustomerDetails(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request({
                method: "GET",
                uri: `/customer/api/companies/${this.clientIdentifier}/customers/${customerId}`
            });
        });
    }
    /**
     * @description Get company's invoicing details and default values for different params.
     * @example Fivaldi.getCompanyDetails()
     */
    getCompanyInvoicingDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request({
                method: "GET",
                uri: `/customer/api/companies/${this.clientIdentifier}/sales/company-invoicing-details`
            });
        });
    }
}
exports.Fivaldi = Fivaldi;
//# sourceMappingURL=index.js.map