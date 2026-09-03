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
      desc: "Dealer admin for Available Coverages: pre-select customer defaults (packages + terms), MSRP/Dnet pricing, and bundle composition.",
      href: "stories/dealers/index.html",
    },
  ],
};
