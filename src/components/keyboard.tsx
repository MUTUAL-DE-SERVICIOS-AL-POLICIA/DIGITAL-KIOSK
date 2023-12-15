import { Children, cloneElement } from "react"
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css"
import "./index.css"

interface keyboardProps {
  children: any;
  onChange: (value: string) => void;
  keyboardComplete: boolean;
}

export const KeyboardSimple = (props: keyboardProps) => {
  const {
    children,
    onChange,
    keyboardComplete,
  } = props;



  return (
    <>
      {Children.map(children, child => {
        return cloneElement(child);
      })}
      <Keyboard
        onChange={onChange}
        theme={"hg-theme-default hg-layout-default myTheme"}
        layout={{
          default: keyboardComplete ? [
            "1 2 3 4 5 6 7 8 9 0",
            "Q W E R T Y U I O P",
            "A S D F G H J K L Ñ",
            "Z X C V B N M - {bksp}"
          ] : [
            "1 2 3",
            "4 5 6",
            "7 8 9",
            "0 {bksp}"
          ]
        }}
        buttonTheme={[
          {
            class: "hg-green",
            buttons: "1 2 3 4 5 6 7 8 9 0 - {bksp} Q W E R T Y U I O P A S D F G H J K L Ñ Z X C V B N M"
          },
        ]}
        display={{ '{bksp}': 'Borrar', }}
      // maxLength={{ default: 1 }}
      />
    </>
  );
}