import { User } from '../../../domain/entities/User';
import { IUserRepository } from '../../../interface/repositories/IUserRepository';
import { SupabaseService } from '../../services/supabaseService';

export class UserRepositorySupabase implements IUserRepository {
  private supabase;

  constructor() {
    const supabaseService = new SupabaseService();
    this.supabase = supabaseService.getClient();
  }

  private mapUserToEntity(user: any): User {
    return new User({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password
    });
  }

  async create(user: User): Promise<User> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .insert([{
          name: user.name,
          email: user.email,
          password: user.password
        }])
        .select()
        .single();

      if (error) throw error;

      return this.mapUserToEntity(data);
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return null;

      return this.mapUserToEntity(data);
    } catch (error) {
      console.error('Erreur lors de la recherche de l\'utilisateur:', error);
      return null;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) throw error;
      if (!data) return null;

      return this.mapUserToEntity(data);
    } catch (error) {
      console.error('Erreur lors de la recherche de l\'utilisateur par email:', error);
      return null;
    }
  }

  async update(user: User): Promise<User | null> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .update({
          name: user.name,
          email: user.email,
          password: user.password
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      if (!data) return null;

      return this.mapUserToEntity(data);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      return null;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error finding users:', error);
        throw error;
      }

      console.log('Found users:', data);
      return data.map(user => this.mapUserToEntity(user));
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }
} 