import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { User } from '@prisma/client'

interface RegisterUserCaseRequest {
  name: string
  email: string
  password: string
}

interface RegisterUserCaseResponse {
	user: User
}

export class RegisterUserCase {
	constructor(private usersRepository: UsersRepository) {	}

	async execute({ name, email, password }: RegisterUserCaseRequest): Promise<RegisterUserCaseResponse> {
		const userWithSameEmail = await this.usersRepository.findByEmail(email)

		if(userWithSameEmail) throw new UserAlreadyExistsError()

		const password_hash = await hash(password, 6)

		const user = await this.usersRepository.create({
			name,
			email,
			password_hash
		})

		return { user }
	}
}