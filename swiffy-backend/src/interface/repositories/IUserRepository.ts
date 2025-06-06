import { User } from "../../domain/entities/User";


export interface IUserRepository {
    create(user: User): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    update(user: User): Promise<User | null>;
    delete(id: string): Promise<void>;
    findAll(): Promise<User[]>;

    
}
