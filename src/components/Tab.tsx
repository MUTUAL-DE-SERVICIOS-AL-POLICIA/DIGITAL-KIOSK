import { ContributionView } from "@/views/content/contributions/ContributionView"
import { LoanView } from "@/views/content/loans/LoanView"
import { Box, /*Tab, Tabs,*/ ToggleButton, ToggleButtonGroup } from "@mui/material"
import { SyntheticEvent, useState } from "react"

interface Props {
   setLoading: (flag: boolean) => void
}

export const TabComponent = (props: Props) => {

   const { setLoading } = props

   const [ value, setValue ] = useState('loans')

   const handleChange = (_: SyntheticEvent, newValue: string) => {
      setValue(newValue)
   }

   return (
      <div style={{display: 'flex', flexDirection: 'column' }}>
         <Box style={{display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
            {/* <Tabs
               sx={{ mx: '4vw'}}
               value={value}
               onChange={handleChange}
            >
               <Tab
                  sx={{fontSize: '2vw', fontWeight: 700 }}
                  value="loans"
                  label="MIS PRÉSTAMOS"
                  wrapped
               />
               <Tab
                  sx={{fontSize: '2vw', fontWeight: 700 }}
                  value="contributions"
                  label="MIS APORTES"
                  wrapped
               />
            </Tabs> */}
            <ToggleButtonGroup
               color="primary"
               value={value}
               exclusive
               onChange={handleChange}
            >
               <ToggleButton sx={{fontSize: '2vw', fontWeight: 700}} value="loans">MIS PRÉSTAMOS</ToggleButton>
               <ToggleButton sx={{fontSize: '2vw', fontWeight: 700}} value="contributions">MIS APORTES</ToggleButton>
            </ToggleButtonGroup>
         </Box>
         { value == 'loans' && <LoanView setLoading={setLoading} />}
         { value == 'contributions' && <ContributionView  setLoading={setLoading} /> }
      </div>
   )
}