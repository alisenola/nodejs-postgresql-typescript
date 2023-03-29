import IService from "../../../interfaces/IService";

export default interface IJwtService {
  sign: (
    payload: Record<string, any>,
    refreshPayload: Record<string, any>
  ) => IService<{ token: string; refresh: string }>;
  refresh: (
    token: string,
    refresh: string
  ) => IService<{ token: string; refresh: string }>;
  verify: (token: string) => IService<Record<string, any>>;
}
