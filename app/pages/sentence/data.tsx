import { Button, TextField } from "@mui/material"
import { Box } from "@mui/system"
import {
  DataGrid,
  GridApi,
  GridColDef,
  GridRowModel,
  GridToolbarContainer,
  useGridApiRef,
} from "@mui/x-data-grid"
import createProblem from "app/sentence/mutations/createProblem"
import getProblems from "app/sentence/queries/getProblems"
import { BlitzPage, Link, Routes, useMutation, usePaginatedQuery, useQuery, useRouter } from "blitz"
import { Suspense, useCallback, useState } from "react"
import { nav } from "./nav"
import AddIcon from "@mui/icons-material/Add"
import updateProblem from "app/sentence/mutations/updateProblem"
import { Problem } from "@prisma/client"

const ITEMS_PER_PAGE = 100

const columns: GridColDef[] = [
  { field: "id", headerName: "Id" },
  { field: "japanese", headerName: "日本語", flex: 1, width: 500, editable: true },
  { field: "english", headerName: "英語", flex: 1, width: 500, editable: true },
]

interface EditToolbarProps {
  apiRef: React.MutableRefObject<GridApi>
}

function EditToolbar(props: EditToolbarProps) {
  const { apiRef } = props
  const [createProblemMutation] = useMutation(createProblem)
  console.log(apiRef)
  const handleClick = useCallback(async () => {
    const newProblem = await createProblemMutation({ japanese: "", english: "" })
  }, [createProblemMutation])

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  )
}

export const PloblemsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const pageSize = Number(router.query.pageSize) || ITEMS_PER_PAGE
  const [{ problems, hasMore, count }] = usePaginatedQuery(getProblems, {
    orderBy: { id: "asc" },
    skip: pageSize * page,
    take: pageSize,
  })

  const [updateProblemMutation] = useMutation(updateProblem)
  const goToPage = (newPage) => router.push({ query: { page: newPage, pageSize: pageSize } })
  const changePageSize = (newPageSize) => router.push({ query: { pageSize: newPageSize } })

  const [createProblemMutation] = useMutation(createProblem)
  const handleClick = useCallback(async () => {
    const newProblem = await createProblemMutation({ japanese: "", english: "" })
    router.reload()
  }, [createProblemMutation, router])

  const processRowUpdate = useCallback(
    async (newRow: GridRowModel<Problem>) => {
      // Make the HTTP request to save in the backend
      console.log(newRow)
      const response = await updateProblemMutation(newRow)
      return response
    },
    [updateProblemMutation]
  )

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <DataGrid
        editMode="row"
        pageSize={pageSize}
        paginationMode="server"
        rows={problems}
        columns={columns}
        rowCount={count}
        rowHeight={25}
        experimentalFeatures={{ newEditingApi: true }}
        components={{
          Toolbar: () => (
            <GridToolbarContainer>
              <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Add record
              </Button>
            </GridToolbarContainer>
          ),
        }}
        onPageSizeChange={changePageSize}
        onPageChange={goToPage}
        processRowUpdate={processRowUpdate}
      />
    </div>
  )
}

const Data: BlitzPage = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <Box sx={{ width: "10%" }}>{nav}</Box>
      <Box sx={{ width: "75%", flexGrow: 1, display: "flex", alignItems: "stretch" }}>
        <Suspense fallback={<div>Loading...</div>}>
          <PloblemsList />
        </Suspense>
      </Box>
    </Box>
  )
}

export default Data
