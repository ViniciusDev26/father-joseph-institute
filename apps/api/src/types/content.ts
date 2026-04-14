export interface AboutContent {
  hero: {
    tag: string;
    title: string;
    subtitle: string;
  };
  mission: {
    quote: string;
  };
  story: {
    tag: string;
    title: string;
    paragraphs: string[];
    image: string;
  };
  values: {
    tag: string;
    title: string;
    items: {
      title: string;
      description: string;
    }[];
  };
  impact: {
    tag: string;
    title: string;
    stats: {
      value: string;
      label: string;
    }[];
  };
  cta: {
    tag: string;
    title: string;
    description: string;
  };
}

export interface SiteContent {
  about: AboutContent;
}
