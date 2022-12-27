import { Roles } from "./roles.service";

export const menuItems = [
  {
    id: 0,
    title: "Vehicle Overview",
    title_de: "Fahrzeug übersicht",
    roles: [
      Roles.Owner,
      Roles.Sale,
      Roles.Max,
      Roles.Workshop,
      Roles.Preparation,
      Roles.WorkshopUser,
      Roles.Spare
    ],
    link: "overview",
  },

  {
    id: 1,
    title: "Create Vehicle",
    title_de: "Fahrzeug definieren",
    roles: [
      Roles.Owner,
      Roles.Sale,
    ],
    link: "vehicle",
  },
  {
    id: 2,
    title: "Spare Parts",
    title_de: "Ersatzteile",
    roles: [
      Roles.Owner,
      Roles.Sale,
      Roles.Workshop,
      Roles.WorkshopUser,
      Roles.Spare
    ],
    link: "spare",
  },
  {
    id: 3,
    title: "Workshop Archive",
    title_de: "Werkstatt-Archiv",
    roles: [
      Roles.Owner,
      Roles.Sale,
      Roles.Workshop,
      Roles.WorkshopUser,
      Roles.Spare
    ],
    link: "workshop",
  },
  {
    id: 4,
    title: "Business Evaluation",
    title_de: "Auswertung",
    roles: [
      Roles.Owner,
      Roles.Sale,
    ],
    link: "evaluation",
  },
  {
    id: 5,
    title: "Delivered Archive",
    title_de: "Auslieferung",
    roles: [
      Roles.Owner,
      Roles.Sale,
      Roles.Workshop,
      Roles.Spare
    ],
    link: "delivered",
  },
];
