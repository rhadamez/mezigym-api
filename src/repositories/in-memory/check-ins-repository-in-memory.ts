import { CheckIn, Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'
import dayjs from 'dayjs'

export class CheckInsRepositoryInMemory implements CheckInsRepository {
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

	async save(checkIn: CheckIn): Promise<CheckIn> {
		const checkInIndex = this.checkIns.findIndex(checkIn => checkIn.id === checkIn.id)
		if(checkInIndex >= 0) {
			this.checkIns[checkInIndex] = checkIn
		}

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

	async findById(id: string): Promise<CheckIn | null> {
		const checkIn = this.checkIns.find(checkIn => checkIn.id === id)
		if(!checkIn) return null

		return checkIn
	}

	async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
		return this.checkIns
			.filter(checkIn => checkIn.user_id === userId)
			.slice((page - 1) * 20, page * 20)
	}

	async countByUserId(userId: string): Promise<number> {
		return this.checkIns.filter(item => item.user_id === userId).length
	}

}