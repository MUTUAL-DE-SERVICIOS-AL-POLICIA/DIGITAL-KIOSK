import { AlphaNumeric, ComponentInput } from "@/components";
import { CardInfo } from "@/components/CardInfo";
import KeyboardAlphanumeric from "@/components/keyboardAlphanumeric";
import KeyboardNumeric from "@/components/keyboardNumeric";
import { useCredentialStore, useForm } from "@/hooks";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Grid, styled } from "@mui/material";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  memo,
} from "react";

const loginFormFields = {
  identityCard: "",
};

const formValidations = {
  identityCard: [
    (value: string) => value.length >= 4 && value.length <= 12,
    "El carnet de identidad debe tener de 4 dígitos a 12 dígitos",
  ],
};

const text = (
  <>
    Por favor ingrese su <b>número de carnet de identidad</b> y luego presione
    en <b>continuar.</b>
  </>
);

const GridContainer = styled(Grid)({
  paddingTop: 80,
});

const GridItem = styled(Grid)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const KeyboardContainer = styled("div")({
  width: "100%",
  height: "65vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const IdentityCard = memo(
  forwardRef((_, ref) => {
    const [keyboardComplete, setkeyboardComplete] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);

    const { startLogin } = useAuthStore();
    const {
      identityCard,
      onInputChange,
      isFormValid,
      onValueChange,
      identityCardValid,
    } = useForm(loginFormFields, formValidations);

    const { changeIdentityCard } = useCredentialStore();

    useImperativeHandle(ref, () => ({
      action: (_?: boolean) => {
        changeIdentityCard(identityCard);
        setFormSubmitted(true);
        if (!isFormValid) return;
        startLogin(identityCard);
      },
      onRemoveCam: () => {},
    }));

    useEffect(() => {}, [identityCard]);

    const handleClickKeyboard = (number: any) => {
      let aux: string = "";
      if (typeof number === "object" && number !== null) {
        aux = identityCard.substring(0, identityCard.length - 1);
      } else {
        aux = identityCard + number;
      }
      onValueChange("identityCard", aux);
    };

    return (
      <form>
        <GridContainer container>
          <GridItem item container sm={6}>
            <CardInfo text={text} />
            <ComponentInput
              type="text"
              name="identityCard"
              value={identityCard}
              onChange={onInputChange}
              error={!!identityCardValid && formSubmitted}
              helperText={formSubmitted ? identityCardValid : ""}
              endAdornment={
                <AlphaNumeric handleKeyboardComplete={setkeyboardComplete} />
              }
              customSx={{
                px: 10,
                my: 10,
                "& .MuiOutlinedInput-input": {
                  fontSize: innerWidth > innerHeight ? "3.5vw" : "5.5vw",
                },
              }}
            />
          </GridItem>
          <GridItem item container sm={6}>
            <KeyboardContainer>
              {!keyboardComplete ? (
                <KeyboardNumeric onClick={handleClickKeyboard} />
              ) : (
                <KeyboardAlphanumeric onClick={handleClickKeyboard} />
              )}
            </KeyboardContainer>
          </GridItem>
        </GridContainer>
      </form>
    );
  })
);
