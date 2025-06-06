interface AccessTokenPayload {
  phone: string;
  email: string;
}

interface TempRegisterTokenPayload {
  phone: string;
  temp: boolean;
}

export { AccessTokenPayload, TempRegisterTokenPayload };
