import { NotFoundError, resolver } from "blitz"
import { addHours, addWeeks, startOfToday } from "date-fns"
import db from "db"

export default resolver.pipe(resolver.authorize(), async (_, { session }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const result = await db.result.findFirst({
    include: { problem: true },
    orderBy: [{ nextSettingQuestion: "asc" }, { problemId: "asc" }],
    where: { userId: session.userId, lastAnswerd: { lt: addHours(new Date(), -1) } },
  })

  if (!result || result.nextSettingQuestion > addWeeks(startOfToday(), 2) || Math.random() < 0.1) {
    const problem = await db.problem.findFirst({
      where: {
        AND: [
          { japanese: { not: "" }, english: { not: "" } },
          { result: { none: { userId: session.userId } } },
        ],
      },
    })

    if (!problem) {
      const random = await db.result.findFirst({
        include: { problem: true },
        orderBy: [{ nextSettingQuestion: "asc" }, { problemId: "asc" }],
        where: { userId: session.userId },
      })

      if (!random) throw new NotFoundError()

      return random.problem
    }

    return problem
  } else {
    return result.problem
  }
})
