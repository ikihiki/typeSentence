import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateProblem = z.object({
  japanese: z.string(),
  english: z.string(),
})

export default resolver.pipe(resolver.zod(CreateProblem), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const problem = await db.problem.create({ data: input })

  return problem
})
