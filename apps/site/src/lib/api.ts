import axios from 'axios';
import { env } from '@/lib/env';
import type { SiteContent } from '@/types/content';

const api = axios.create({
  baseURL: env.API_URL,
});

export async function fetchContent(): Promise<SiteContent> {
  const { data } = await api.get<SiteContent>('/content');
  return data;
}
