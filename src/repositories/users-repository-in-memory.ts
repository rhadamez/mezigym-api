import { Prisma, User } from '@prisma/client'
import { UsersRepository } from './users-repository'

export class UsersRepositoryInMemory implements UsersRepository {
	private users: User[] = []

	async create(data: Prisma.UserCreateInput) {
		const user = {
			id: this.users.length+'',
			name: data.name,
			email: data.email,
			password_hash: data.password_hash,
			created_at: new Date()
		}
		this.users.push(user)
		return user
	}

	async findByEmail(email: string): Promise<User | null> {
		const user = this.users.find(user => user.email === email)
		if(!user) return null
		return user
	}
}