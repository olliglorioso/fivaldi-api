import axios, { Method } from "axios"
import crypto from "crypto"

const LF = '\u000a';

const md5 = (body: any): string => {
  if (typeof body === "object" && !(body instanceof Buffer)) {
    body = JSON.stringify(body)
  }
  return crypto.createHash("md5").update(body).digest("hex")
}

const hmac = (content: string, clientSecret: string): string => {
  return crypto
    .createHmac("sha256", clientSecret)
    .update(content)
    .digest("base64")
}

let _client: Fivaldi;

export const configure = (clientIdentifier: string, clientSecret: string, fivaldiPartner: string): Fivaldi => {
  _client = new Fivaldi(clientIdentifier, clientSecret, fivaldiPartner)
  return _client
}

export const getClient = (): Fivaldi => {
  if(!_client){
    throw new Error("You must configure the module before accessing the client")
  }
  return _client
}

export class Fivaldi {
  clientIdentifier: string;
  clientSecret: string;
  fivaldiPartner: string;

  constructor(clientIdentifier: string, clientSecret: string, fivaldiPartner: string){
    this.clientIdentifier = clientIdentifier;
    this.clientSecret = clientSecret;
    this.fivaldiPartner = fivaldiPartner;
  }

  request = async (config: {
    method: Method,
    body?: any,
    uri?: string,
    query?: string
  }): Promise<any> => {
    const baseUrl = "https://api.fivaldi.net"
    const { body, method, uri } = config;
    let bodyMD5 = ""
    let contentType = ""
    const query = config.query || ""
    const timestamp: string = Math.floor(new Date().getTime() / 1000).toString();
    let headers = [
        { key: "X-Fivaldi-Partner", value: this.fivaldiPartner},
        { key: "X-Fivaldi-Timestamp", value: timestamp },
    ]   
    
    if (body) {
        bodyMD5 = md5(body)
        contentType = "application/json"
        headers.push({ key: "Content-Type", value: contentType })
    }

    let stringToSign: string = [
      method || "GET",
      bodyMD5,
      contentType,
      ...headers.sort(function (a, b) {
        return a.key.toLowerCase().localeCompare(b.key.toLowerCase())
      }).filter(header => header.key.startsWith("X-Fivaldi"))
      .map(header => `${header.key.trim().toLowerCase()}:${typeof header.value === "string" ? header.value.trim() : header.value}`),
      uri
    ].join(LF);

    if(query){
      stringToSign += LF + query;
    }

    const mac = hmac(
      stringToSign, 
      this.clientSecret
    );

    headers.push({ key: "Authorization", value: `Fivaldi ${mac}`})
    return await axios({
      method,
      url: baseUrl + uri + query,
      headers: headers.reduce((result, header) => {
        result[header.key] = header.value;
        return result;
      }, {}),
      data: body
    });
  }

  async createInvoice(body: any): Promise<any> {
    return await this.request({
      body,
      method: "POST",
      uri: `/customer/api/companies/${this.clientIdentifier}/sales/sales-order`
    });
  }

  async createMultipleInvoices(body: any): Promise<any> {
    return await this.request({
      body, 
      method: "POST",
      uri: `/customer/api/companies/${this.clientIdentifier}/sales/multiple-sales-orders`
    });
  }

  async getCustomerDetails(customerId: string): Promise<any> {
    return await this.request({
      method: "GET",
      uri: `/customer/api/companies/${this.clientIdentifier}/customers/${customerId}`
    });
  }

  async getCompanyInvoicingDetails(): Promise<any> {
    return await this.request({
      method: "GET",
      uri: `/customer/api/companies/${this.clientIdentifier}/sales/company-invoicing-details`
    });
  }
}