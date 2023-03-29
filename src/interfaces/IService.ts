interface IServicePayload<T> {
  accepted: boolean;
  data?: T;
  error?: { status: number; message: string };
  pagination?: {
    total: number;
    currentPage: number;
    items: number;
  };
}
type IService<T> = Promise<IServicePayload<T>>;

export default IService;
