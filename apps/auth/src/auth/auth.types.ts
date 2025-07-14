interface AccessTokenPayload {
  phone: string;
}

interface TempRegisterTokenPayload {
  phone: string;
  temp: boolean;
}

export { AccessTokenPayload, TempRegisterTokenPayload };
