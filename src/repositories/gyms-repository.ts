import { Prisma, Gym } from '@prisma/client'

export interface GymsRepository {
  create(data: Prisma.GymUncheckedCreateInput): Promise<Gym>
  findById(id: string): Promise<Gym | null>
}