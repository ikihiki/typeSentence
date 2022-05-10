import { resolver } from "blitz"
import { addDays, addMonths, addWeeks, startOfToday, startOfTomorrow } from "date-fns"
import db, { prisma } from "db"
import { z } from "zod"

const UpdateProblem = z.object({
  problemId: z.number(),
  correct: z.boolean(),
})

export default resolver.pipe(
  resolver.zod(UpdateProblem),
  resolver.authorize(),
  async ({ problemId, correct }, { session }) => {
    let next = startOfToday()
    const beforeConsecutiveCorrectAnswers = await db.result.findUnique({
      where: { userId_problemId: { userId: session.userId, problemId: problemId } },
      select: { consecutiveCorrectAnswers: true },
    })
    if (correct) {
      if (beforeConsecutiveCorrectAnswers) {
        switch (beforeConsecutiveCorrectAnswers.consecutiveCorrectAnswers) {
          case 0:
            next = startOfTomorrow()
            break
          case 1:
            next = addDays(startOfTomorrow(), 1)
            break
          case 2:
            next = addDays(startOfTomorrow(), 2)
            break
          case 3:
            next = addWeeks(startOfTomorrow(), 1)
            break
          case 4:
            next = addWeeks(startOfTomorrow(), 2)
            break
          default:
            next = addMonths(startOfTomorrow(), 1)
            break
        }
      } else {
        next = startOfTomorrow()
      }
    }

    const result = await db.result.upsert({
      where: { userId_problemId: { userId: session.userId, problemId: problemId } },
      create: {
        userId: session.userId,
        problemId: problemId,
        consecutiveCorrectAnswers: correct ? 1 : 0,
        lastAnswerd: new Date(),
        nextSettingQuestion: next,
      },
      update: {
        consecutiveCorrectAnswers: correct
          ? (beforeConsecutiveCorrectAnswers?.consecutiveCorrectAnswers ?? 0) + 1
          : 0,
        lastAnswerd: new Date(),
        nextSettingQuestion: next,
      },
    })
    return result
  }
)
