export default interface IUser {
  id: number,
  name: string,
  email: string,
  password: string,
  username: string,
  resetPasswordToken: string,
  resetPasswordTime: string
}