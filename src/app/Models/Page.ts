export interface Page {
    ID: number;
    Titre: string;
    Url: string;
    Content_balise_title: string;
    Content_balise_description: string;
    Content_balise_keywords?: string; // Optional
    Content_balise_robots: string;
    Href_balise_canonical: string;
    Content_balise_og_title: string;
    Content_balise_og_description: string;
    Content_balise_og_url: string;
    Content_balise_og_type: string;
    Content_balise_og_image: string;
    Content_balise_og_site_name: string;
  }
  