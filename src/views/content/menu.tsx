import { AttachMoney, ExtensionOutlined, Money } from "@mui/icons-material";
import { LoanView } from "./loans/LoanView";
import { ContributionView } from "./contributions/ContributionView";
import { EconomicComplementView } from "./economicComplement/EconomicComplementView";

const SERVICES = [
  {
    code: "ecoCom",
    title: "COMPLEMENTO ECONÓMICO",
    subTitle: "Creación de trámites de Complemento Económico.",
    icon: <ExtensionOutlined />,
    view: <EconomicComplementView />,
  },
  {
    code: "loans",
    title: "PRÉSTAMOS VIGENTES",
    subTitle: "Seguimiento de trámites de Préstamos Vigentes",
    icon: <AttachMoney />,
    view: <LoanView />,
  },
  {
    code: "con",
    title: "APORTES",
    subTitle: "Seguimiento de aportes",
    icon: <Money />,
    view: <ContributionView />,
  },
];

export default SERVICES;
