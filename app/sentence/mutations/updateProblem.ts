import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateProblem = z.object({
  id: z.number(),
  japanese: z.string(),
  english: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateProblem),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const problem = await db.problem.update({ where: { id }, data })

    return problem
  }
)
