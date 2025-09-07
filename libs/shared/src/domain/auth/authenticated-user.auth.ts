export interface IAuthenticatedUser {
  exp: number;
  iat: number;
  auth_time: number;
  jti: string;
  iss: string;
  aud: string;
  sub: string;
  typ: string;
  azp: string;
  sid: string;
  acr: string;
  'allowed-origins': string[];
  realm_access: IRealmAccess;
  resource_access: IResourceAccess;
  scope: string;
  email_verified: boolean;
  address: Record<string, unknown>;
  organization: Record<string, IOrganizationDetail>;
  name: string;
  preferred_username: string;
  given_name: string;
  locale: string;
  family_name: string;
  email: string;
}

export interface IOrganizationDetail {
  id: string;
}

export interface IRealmAccess {
  roles: string[];
}

export interface IResourceAccess {
  account: IRealmAccess;
}
