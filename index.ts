import axios, { Method } from "axios"
import crypto from "crypto"

const LF = '\u000a';

const md5 = (body: any): string => {
  if (typeof body === "object" && !(body instanceof Buffer)) {
    body = JSON.stringify(body)
  }
  return crypto.createHash("md5").update(body).digest("base64")
}

const hmac = (content: string, clientSecret: string): string => {
  return crypto
    .createHmac("sha256", clientSecret)
    .update(content)
    .digest("base64")
}

export default class Fivaldi {
  baseUrl: string;
  clientIdentifier: string;
  clientSecret: string;
  fivaldiPartner: string;
  companyId: string;

  constructor(clientIdentifier: string, clientSecret: string, fivaldiPartner: string){
    this.clientIdentifier = clientIdentifier;
    this.clientSecret = clientSecret;
    this.fivaldiPartner = fivaldiPartner;
  }

  request = async (config: {
    method: Method,
    body?: any,
    uri?: string
  }): Promise<any> => {
    const baseUrl = "https://api.fivaldi.net"
    const { body, method, uri } = config;
    let bodyMD5 = ""
    let contentType = ""
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

    const mac = hmac(
      [
        method || "GET",
        bodyMD5,
        contentType,
        ...headers.sort(function (a, b) {
          return a.key.toLowerCase().localeCompare(b.key.toLowerCase())
        }).filter(header => header.key.startsWith("X-Fivaldi"))
        .map(header => `${header.key.trim().toLowerCase()}:${typeof header.value === "string" ? header.value.trim() : header.value}`),
        uri
      ].join(LF), 
      this.clientSecret
    )

    headers.push({ key: "Authorization", value: `Fivaldi ${mac}`})
    return await axios({
      method,
      url: baseUrl + uri,
      headers: headers.reduce((result, header) => {
        result[header.key] = header.value;
        return result;
      }, {}),
      data: body
    })
  }

  async createInvoice(body: any): Promise<void> {
    return await this.request({
      body,
      method: "POST",
      uri: `/customer/api/companies/${this.clientIdentifier}/sales/sales-order`
    });
  }

  async createMultipleInvoices(body: any): Promise<void> {
    return await this.request({
      body, 
      method: "POST",
      uri: `/customer/api/companies/${this.clientIdentifier}/sales/multiple-sales-orders`
    })
  }

  async getCustomerDetails(customerId: string): Promise<void> {
    return await this.request({
      method: "GET",
      uri: `/customer/api/companies/${this.clientIdentifier}/customers/${customerId}`
    });
  }
}