import { CheckIn, Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'
import dayjs from 'dayjs'

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

	async findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
		const startOfTheDay = dayjs(date).startOf('date')
		const endOfTheDay = dayjs(date).endOf('date')

		const checkOnSameDate = this.checkIns.find(checkIn => {
			const isUserEquals = checkIn.user_id === userId
			const checkInDate = dayjs(checkIn.created_at)
			const isOnSameDate = checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

			return isUserEquals && isOnSameDate
		})

		if(!checkOnSameDate) return null

		return checkOnSameDate
	}

}