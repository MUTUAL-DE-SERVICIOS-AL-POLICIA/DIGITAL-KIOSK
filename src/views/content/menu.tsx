import { AttachMoney, ExtensionOutlined, Money } from "@mui/icons-material";
import { LoanView } from "./loans/LoanView";
import { ContributionView } from "./contributions/ContributionView";
import { EconomicComplementView } from "./economicComplement/EconomicComplementView";

const SERVICES = [
  {
    code: "ecoCom",
    title: "COMPLEMENTO ECONÓMICO",
    subTitle: "Creación de trámites de Complemento Económico.",
    message: "",
    canCreate: false,
    icon: <ExtensionOutlined />,
    view: <EconomicComplementView />,
  },
  {
    code: "loans",
    title: "PRÉSTAMOS VIGENTES",
    subTitle: "Seguimiento de trámites de Préstamos Vigentes",
    canCreate: true,
    icon: <AttachMoney />,
    view: <LoanView />,
  },
  {
    code: "contributions",
    title: "APORTES",
    subTitle: "Seguimiento de aportes",
    canUse: true,
    icon: <Money />,
    view: <ContributionView />,
  },
];

export default SERVICES;
