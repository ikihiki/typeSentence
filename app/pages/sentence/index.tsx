import { TextField } from "@mui/material"
import { Box } from "@mui/system"
import { BlitzPage } from "blitz"
import { nav } from "./nav"

const Index: BlitzPage = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <Box sx={{ width: "10%" }}>{nav}</Box>
      <Box sx={{ width: "75%", flexGrow: 1, display: "flex", alignItems: "stretch" }}></Box>
    </Box>
  )
}

export default Index
