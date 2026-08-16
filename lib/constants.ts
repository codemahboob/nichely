export const NICHES = [
  "Lifestyle",
  "UGC",
  "In-site / On-location Video",
  "Beauty",
  "Fashion",
  "Food & Cafe",
  "Travel",
  "Fitness & Health",
  "Tech & Gadgets",
  "Home & Decor",
  "Parenting & Family",
  "Comedy & Entertainment",
  "Other",
] as const;

export type InfluencerSubmission = {
  fullName: string;
  whatsapp: string;
  instagramHandle: string;
  followers: string;
  avgLikes: string;
  avgViews: string;
  niches: string[];
  otherNiche?: string;
  reelCharge: string;
};
