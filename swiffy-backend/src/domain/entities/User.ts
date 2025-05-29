import bcrypt from "bcrypt";

export interface UserProps {
  id?: string;
  name: string;
  email: string;
  password: string;
}

export class User {
  public id: string;
  public name: string;
  public email: string;
  public password: string;

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
}
