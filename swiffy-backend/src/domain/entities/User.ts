import bcrypt from "bcrypt";

<<<<<<< HEAD
export interface UserProps {
  id?: string;
  name: string;
  email: string;
  password: string;
}

=======

export interface UserProps {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  googleAccessToken?: string 
}
>>>>>>> 93f1cf1c6507a9321fb8bce8c590489e59179f21
export class User {
  public id: string;
  public name: string;
  public email: string;
  public password: string;
<<<<<<< HEAD

  constructor(props: UserProps) {
    this.id = props.id ?? '';
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
  }

  async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
=======
  public createdAt: Date;
  public updatedAt: Date;
  public googleAccessToken?: string 

  constructor(props: UserProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.googleAccessToken = props.googleAccessToken;
  }



>>>>>>> 93f1cf1c6507a9321fb8bce8c590489e59179f21
}
