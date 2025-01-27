export interface Image {
  id: string;
  image_url: string;
  caption?: string;
  details?: string;
  order_number: number;
}

export interface Section {
  id: string;
  section_type: string;
  custom_title?: string;
  custom_content?: string;
  order_number: number;
  images?: Image[];
}

export interface Financial {
  equity_distributed: string;
  irr_expected: string;
  fundraising_goal: string;
  duration_months: string;
  pre_money_valuation: string;
}

export interface Opportunity {
  id: string;
  title: string;
  location: {
    city: string;
    region: string;
  };
  visibility: "draft" | "private" | "coming_soon" | "active" | "concluded";
  external_url?: string;
  external_platform?: string;
  sections?: Section[];
  financial?: Financial;
  created_at: string;
  updated_at: string;
}