import { AttachMoney, ExtensionOutlined, MonetizationOn, Money } from "@mui/icons-material";
import { LoanView } from "./loans/LoanView";
import { ContributionView } from "./contributions/ContributionView";
import { EconomicComplementView } from "./economicComplement/EconomicComplementView";
import { RetFunQuotaAidView } from "./ret_fund_quota_aid/RetFunQuotaAidView";

const SERVICES = [
  {
    code: "ecoCom",
    title: "COMPLEMENTO ECONÓMICO",
    subTitle: "Creación de trámites",
    message: "",
    canCreate: false,
    icon: <ExtensionOutlined />,
    view: <EconomicComplementView />,
  },
  {
    code: "loans",
    title: "PRÉSTAMOS VIGENTES",
    subTitle: "Impresión de extractos",
    canCreate: true,
    icon: <AttachMoney />,
    view: <LoanView />,
  },
  {
    code: "contributions",
    title: "APORTES",
    subTitle: "Impresión de certificaciones",
    canUse: true,
    icon: <Money />,
    view: <ContributionView />,
  },
  {
    code: "retirementBenefits",
    title: "FONDO DE RETIRO Y CUOTA AUXILIO MORTUORIO",
    subTitle: "Impresión de liquidaciones",
    canUse: true,
    icon: <MonetizationOn />,
    view: <RetFunQuotaAidView />,
  },
];

export default SERVICES;
