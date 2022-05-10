import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetProblemsInput
  extends Pick<Prisma.ProblemFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetProblemsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: problems,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.problem.count({ where }),
      query: (paginateArgs) => db.problem.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      problems,
      nextPage,
      hasMore,
      count,
    }
  }
)
