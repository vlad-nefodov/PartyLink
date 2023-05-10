export interface ILoginData {
  login: string,
  password: string
}

export interface ITokensResponse {
  accessToken: string;
  refreshToken: string;
}