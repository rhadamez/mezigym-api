import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { CheckIn } from '@prisma/client'

interface FetchUserUseCaseRequest {
  userId: string
	page: number
}

interface FetchUserUseCaseResponse {
  checkIn: CheckIn[]
}

export class FetchUserCheckInsHistory {
	constructor(
		private checkInsRepository: CheckInsRepository,
	) { }

	async execute({ userId, page }: FetchUserUseCaseRequest): Promise<FetchUserUseCaseResponse> {
		const checkIn = await this.checkInsRepository.findManyByUserId(userId, page)

		return { checkIn }
	}
}