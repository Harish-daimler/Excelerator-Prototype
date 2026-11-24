/**
 * Features hub config — add a new story entry here to list it on index.html.
 */
window.ExFeatures = {
  pageTitle: "Excelerator Design Sandbox",
  title: "Design exploration",
  intro:
    "Choose a feature to review layout and interaction options. Each story opens its own options flow.",
  stories: [
    {
      id: "notification-banner",
      label: "Feature",
      name: "System Notification Banner",
      desc: "Placement options for system status notices across Excelerator homepages. Option 1 prioritized with yellow sticky treatment.",
      href: "stories/notification-banner/options.html",
    },
    {
      id: "customer-consent",
      label: "Epic",
      name: "Customer Consent",
      desc: "How a customer grants a dealer permission to shop on their behalf, and how dealers track and use that consent. Covers the approval email, the consent status on the customer account, and customer selection when shopping on behalf.",
      links: [
        {
          label: "Dealer Access Approval — customer email flow",
          href: "stories/dealer-access-approval/options.html",
        },
        {
          label: "My Customers — consent on Update Customer",
          href: "stories/my-customers/options.html",
        },
        {
          label: "Shop as Customer — customer login selection",
          href: "stories/shop-as-customer/options.html",
        },
      ],
    },
    {
      id: "dealers-extended-coverages",
      label: "Feature",
      name: "Dealers — Extended Coverages",
      desc: "Dealer chooses which OPTIMUM and NEXT packages to show after VIN. If none of those packages are eligible, all packages show. Trucks over 7 years / 750,000 miles are not eligible.",
      href: "stories/dealer-vin-packages/toggle-cards/index.html",
    },
    {
      id: "bom-part-highlight",
      label: "Feature",
      name: "BOM — module list",
      desc: "Page before the exploded diagram. ADXCustomer6 and ADXCustomer Purchase open the coolant diagram, where a selected part uses the dark bar. ADXCustomer Purchase also shows price, quantity, and cart.",
      href: "stories/bom-part-highlight/index.html",
    },
    {
      id: "bom-selected-part",
      label: "Feature",
      name: "BOM — selected part",
      desc: "Dark bar is prioritized for the selected part. ADXCustomer6 and ADXCustomer Purchase use it on the coolant diagram. Other directions stay listed for reference.",
      href: "stories/bom-selected-part/options.html",
    },
    {
      id: "design-system-gap",
      label: "Feature",
      name: "Design system gap",
      desc: "What is in the Figma Global Design System and missing from the QA Style Showcase, and what the showcase has that Figma does not.",
      href: "stories/design-system-gap/index.html",
    },
    {
      id: "design-system-gap-current",
      label: "Feature",
      name: "Design system gap, toolbox",
      desc: "QA toolbox against the Figma Global Design System. The earlier showcase study is unchanged.",
      href: "stories/design-system-gap-current/index.html",
    },
    {
      id: "design-system-gap-v6",
      label: "Feature",
      name: "Design system gap, Bootstrap 6",
      desc: "Bootstrap 6 alpha against the QA toolbox, and against the Figma Global Design System.",
      href: "stories/design-system-gap-v6/index.html",
    },
  ],
};
