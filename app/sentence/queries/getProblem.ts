import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetPloblem = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetPloblem), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const problem = await db.problem.findFirst({ where: { id } })

  if (!problem) throw new NotFoundError()

  return problem
})
