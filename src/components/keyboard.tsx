import { forwardRef, useImperativeHandle, useRef } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "./index.css";

interface keyboardProps {
  onChange: (value: string) => void;
  keyboardComplete: boolean;
}

export const KeyboardSimple = forwardRef((props: keyboardProps, ref) => {
  const { onChange, keyboardComplete } = props;

  useImperativeHandle(ref, () => ({
    onClearInput: () => keyboard.current.clearInput()
  }));

  const keyboard = useRef<any>();

  const buttonWidth = keyboardComplete ? "100%" : "70%";

  const buttonTheme = [
    {
      class: "hg-green",
      buttons: `1:${buttonWidth} 2:${buttonWidth} 3:${buttonWidth} 4:${buttonWidth} 5:${buttonWidth} 6:${buttonWidth} 7:${buttonWidth} 8:${buttonWidth} 9:${buttonWidth} 0:${buttonWidth} -:${buttonWidth} {bksp}:${buttonWidth} Q:${buttonWidth} W:${buttonWidth} E:${buttonWidth} R:${buttonWidth} T:${buttonWidth} Y:${buttonWidth} U:${buttonWidth} I:${buttonWidth} O:${buttonWidth} P:${buttonWidth} A:${buttonWidth} S:${buttonWidth} D:${buttonWidth} F:${buttonWidth} G:${buttonWidth} H:${buttonWidth} J:${buttonWidth} K:${buttonWidth} L:${buttonWidth} Ñ:${buttonWidth} Z:${buttonWidth} X:${buttonWidth} C:${buttonWidth} V:${buttonWidth} B:${buttonWidth} N:${buttonWidth} M:${buttonWidth} -:${buttonWidth}`,
    },
  ];

  // const buttonTheme = [
  //   {
  //     class: "hg-green",
  //     buttons: `1 2 3 4 5 6 7 8 9 0 - {bksp} Q W E R T Y U I O P A S D F G H J K U L Ñ Z X C V B N M -`,
  //   },
  // ];

  return (
      <Keyboard
        keyboardRef={(r) => (keyboard.current = r)}
        onChange={onChange}
        theme={"hg-theme-default hg-layout-default myTheme"}
        layout={{
          default: keyboardComplete
            ? [
              "1 2 3 4 5 6 7 8 9 0",
              "Q W E R T Y U I O P",
              "A S D F G H J K L Ñ",
              "Z X C V B N M - {bksp}",
            ]
            : ["1 2 3", "4 5 6", "7 8 9", "0 {bksp}"],
        }}
        buttonTheme={buttonTheme}
        display={{ '{bksp}': '←' }}
        preventMouseDownDefault={true}
        disableCaretPositioning={true}
        useButtonTag={false}
        physicalKeyboardHighlight={true}
        physicalKeyboardHighlightPress={true}
        physicalKeyboardHighlightTextColor={"red"}
        physicalKeyboardHighlightBgColor={"#9ab4d0"}
        baseClass={"algo"}
      />
  );
});
