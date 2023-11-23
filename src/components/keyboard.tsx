import { useRef, useState } from "react"
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css"
import "./index.css"

export const KeyboardSimple = () => {
  const [input, setInput] = useState("");
  const [layout, setLayout] = useState("default");
  const keyboard = useRef<any>();

  const onChange = (input:any) => {
    setInput(input);
  };

  const onKeyPress = (button:any) => {
    console.log("Botón presionado", button);
  };

  const onChangeInput = (event:any) => {
    const input = event.target.value;
    setInput(input);
    if(keyboard.current != undefined) keyboard.current.setInput(input);
  };

  return (
    <div className="keyboard">
      <input
        value={input}
        placeholder={"Introduzca su CI"}
        onChange={onChangeInput}
        style={{
            width: '100%',
            height: '120px',
            padding: '30px',
            fontSize: '65px',
            border: 'none',
            boxSizing: 'border-box',
            borderRadius: '20px',
            marginLeft: '13px'
        }}
      />
      <Keyboard
        keyboardRef={r => (keyboard.current = r)}
        layoutName={layout}
        onChange={onChange}
        theme={"hg-theme-default hg-layout-default myTheme"}
        onKeyPress={onKeyPress}
        layout={{
          default: [
            "1 2 3",
            "4 5 6",
            "7 8 9",
            "- 0 {bksp}"
          ]
        }}
        buttonTheme={[
          {
            class: "hg-green",
            buttons: "1 2 3 4 5 6 7 8 9 0 - {bksp} Q W E R T Y U I O P A S D F G H J K L Ñ Z X C V B N M"
          },
        ]}
        display={{'{bksp}': 'Borrar',}}
        maxLength={{ default: 15 }}
      />
    </div>
  );
}