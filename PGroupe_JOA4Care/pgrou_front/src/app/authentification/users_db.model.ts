export class user_db {
  constructor(
    public email: string,
    public photo: string,
    public uid: string,
    public role: string,
    public id: string | undefined,
    public listeActivites: string[]
  ) {}
}

export interface UsersData {
  email: string;
  photo: string;
  role: string;
  uid: string;
  id?: string;
  listeActivites: string[];
}
