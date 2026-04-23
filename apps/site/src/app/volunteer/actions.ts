'use server';

import { env } from '@/lib/env';

interface VolunteerPayload {
  name: string;
  profession: string;
  availability: {
    days: string[];
    startTime: string;
    endTime: string;
  };
}

interface VolunteerResult {
  success: true;
  whatsappUrl: string;
}

interface VolunteerError {
  success: false;
  message: string;
}

export async function registerVolunteer(
  payload: VolunteerPayload,
): Promise<VolunteerResult | VolunteerError> {
  try {
    const res = await fetch(`${env.API_URL}/volunteers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    if (!res.ok) {
      const err = (await res.json()) as { message?: string };
      return { success: false, message: err.message ?? 'Erro ao enviar cadastro.' };
    }

    const data = (await res.json()) as { whatsappUrl: string };
    return { success: true, whatsappUrl: data.whatsappUrl };
  } catch {
    return { success: false, message: 'Não foi possível conectar ao servidor.' };
  }
}
