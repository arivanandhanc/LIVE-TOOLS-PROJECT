export interface ServiceCategory {
  slug: string;
  name: string;
  description: string;
}

export type Pricing = "free" | "freemium" | "paid";

export interface Service {
  /** Globally unique, URL-safe identifier. */
  slug: string;
  name: string;
  /** Outbound homepage URL. */
  url: string;
  /** Category slug. */
  category: string;
  /** One-line description shown on cards and the service page. */
  description: string;
  pricing?: Pricing;
}
