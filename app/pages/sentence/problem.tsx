import { TextField } from "@mui/material"
import { Box } from "@mui/system"
import upsertResult from "app/sentence/mutations/upsertResult"
import getNextProblem from "app/sentence/queries/getNextProblem"
import { BlitzPage, useMutation, useQuery, useRouter } from "blitz"
import { InputHTMLAttributes, Suspense, useCallback, useState } from "react"
import { nav } from "./nav"

const regex = /./

const ShowProblem = () => {
  const [problem] = useQuery(getNextProblem, {})
  const words = problem.english.split(" ")
  const [showWord, setShowWord] = useState(Array(words.length).fill(false) as boolean[])
  const [alreadyAnswerd, setAlreadyAnswerd] = useState(false)
  const router = useRouter()
  const [upsert] = useMutation(upsertResult)

  const check = useCallback(
    async (answer: string) => {
      if (answer === problem.english) {
        if (!alreadyAnswerd) {
          await upsert({ problemId: problem.id, correct: true })
        }
        router.reload()
      } else {
        if (!alreadyAnswerd) {
          await upsert({ problemId: problem.id, correct: false })
          setAlreadyAnswerd(true)
        }

        const newShow = words.map((word, index) => showWord[index] || answer.includes(word))
        const falseIndex = newShow
          .map((show, index) => (show ? -1 : index))
          .filter((index) => index !== -1)

        const showIndex = falseIndex[Math.floor(Math.random() * (falseIndex.length - 1))]
        setShowWord(newShow.map((show, index) => (index === showIndex ? true : show)))
      }
    },
    [alreadyAnswerd, problem.english, problem.id, router, showWord, upsert, words]
  )
  return (
    <>
      <div>{problem.japanese}</div>
      <div>
        {showWord
          .map((show, index) =>
            show ? words[index] : Array(words[index]?.length).fill(" ").join(" ")
          )
          .join(" ")}
      </div>
      <div>
        <TextField
          id="standard-basic"
          label="Standard"
          variant="standard"
          fullWidth
          onKeyUp={(e) => {
            if (e.key === "Enter") check((e.target as HTMLInputElement).value)
          }}
          inputRef={(input) => input && input.focus()}
        />
      </div>
    </>
  )
}

const Problem: BlitzPage = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <Box sx={{ width: "10%" }}>{nav}</Box>
      <Box sx={{ width: "75%", flexGrow: 1 }}>
        <Suspense fallback={<div>Loading...</div>}>
          <ShowProblem />
        </Suspense>
      </Box>
    </Box>
  )
}

export default Problem
