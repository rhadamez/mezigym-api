import { CheckIn, Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'

export class checkInsRepositoryInMemory implements CheckInsRepository {
	private checkIns: CheckIn[] = []

	async create(data: Prisma.CheckInUncheckedCreateInput) {
		const checkIn = {
			id: this.checkIns.length+1+'',
			user_id: data.user_id,
			gym_id: data.gym_id,
			validated_at: data.validated_at ? new Date(data.validated_at) : null,
			created_at: new Date()
		}
		this.checkIns.push(checkIn)
		return checkIn
	}

}