import { Box, Drawer, Link, List, ListItem, ListItemIcon, ListItemText } from "@mui/material"

export const nav = (
  <Drawer
    open
    variant="permanent"
    sx={{
      flexShrink: 0,
      "& .MuiDrawer-paper": {
        boxSizing: "border-box",
      },
    }}
  >
    <Box role="presentation">
      <List>
        <Link href="/sentence/problem">
          <ListItem button key="problem">
            <ListItemText primary="problem" />
          </ListItem>
        </Link>
        <Link href="/sentence/data">
          <ListItem button key="data">
            <ListItemText primary="data" />
          </ListItem>
        </Link>
      </List>
    </Box>
  </Drawer>
)
