import { env } from '@/lib/env';
import type { SiteContent } from '@/types/content';

const REVALIDATE_SECONDS = 60;

export async function fetchContent(): Promise<SiteContent> {
  const response = await fetch(`${env.API_URL}/content`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch content: ${response.status}`);
  }

  return response.json();
}
