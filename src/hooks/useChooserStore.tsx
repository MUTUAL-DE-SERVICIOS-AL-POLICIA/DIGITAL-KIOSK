import { setSelection } from "@/store"
import { useDispatch, useSelector } from "react-redux"

export const useChooserStore = () => {

  const { selection } = useSelector((state: any) => state.chooser)

  const dispatch = useDispatch()

  const saveSelection = (selection: string) => {
    dispatch(setSelection({ selection: selection }))

  }

  return {
    selection,
    saveSelection
  }
}