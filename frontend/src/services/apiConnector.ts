import axios, { AxiosRequestConfig } from "axios";

// Create an instance of Axios with default configuration
export const axiosInstance = axios.create({});

// Define types for the parameters used in apiConnector function
type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

interface ApiConnectorParams {
  method: HttpMethod;
  url: string;
  bodyData?: any;
  headers?: Record<string, any>;
  params?: Record<string, any>;
}

// Define a function that uses AxiosRequestConfig for type safety
export const apiConnector = ({
  method,
  url,
  bodyData,
  headers,
  params,
}: ApiConnectorParams): Promise<any> => {
  const axiosConfig: AxiosRequestConfig = {
    method: method,
    url: url,
    data: bodyData ?? null,
    headers: headers,
    params: params ?? null,
  };

  return axiosInstance(axiosConfig);
};
