export interface User extends Document {
     email: string;
     password: string;
     comparePassword(candidatePassword: string): Promise<boolean>;
}
