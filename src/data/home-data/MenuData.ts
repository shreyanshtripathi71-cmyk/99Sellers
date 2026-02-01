interface MenuItem {
   id: number;
   title: string;
   link: string;
   has_dropdown: boolean;
   sub_menus?: any[];
}

const menu_data: MenuItem[] = [
   {
      id: 1,
      title: "Home",
      link: "/",
      has_dropdown: false,
   },
   {
      id: 2,
      title: "Lead Search", // <--- The new Table Page
      link: "/search",
      has_dropdown: false,
   },
   {
      id: 3,
      title: "Pricing",
      link: "/pricing",
      has_dropdown: false,
   },
   {
      id: 4,
      title: "Dashboard",
      link: "/dashboard/dashboard-index",
      has_dropdown: false,
   },
   {
      id: 5,
      title: "Contact",
      link: "/contact",
      has_dropdown: false,
   },
];

export default menu_data;