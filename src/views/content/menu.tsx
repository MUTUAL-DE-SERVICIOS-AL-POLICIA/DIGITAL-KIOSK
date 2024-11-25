import { AttachMoney, ExtensionOutlined, Money } from "@mui/icons-material";
import { LoanView } from "./loans/LoanView";
import { ContributionView } from "./contributions/ContributionView";


const SERVICES = [
  {
    code: "CE",
    title: "COMPLEMENTO ECONÓMICO",
    subTitle: "Creación de trámites de Complemento Económico.",
    icon: <ExtensionOutlined />
  },
  {
    code: "LOAN",
    title: "PRÉSTAMOS",
    subTitle: "Seguimiento de trámites de Préstamos.",
    icon: <AttachMoney />,
    view: <LoanView />
  },
  {
    code: "CON",
    title: "APORTES",
    subTitle: "Seguimiento de aportes",
    icon: <Money/>,
    view: <ContributionView />
  }
]

export default SERVICES;