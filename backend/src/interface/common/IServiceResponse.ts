export interface IServiceResponse <T = {} | []>{
  success: boolean;
  statusCode: number;
  data?:T
  message: string;
}