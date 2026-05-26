'use server';

import { registerVolunteer as registerVolunteerData } from '@/lib/data/volunteers';

interface VolunteerPayload {
  name: string;
  profession: string;
  phone: string;
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
    const result = await registerVolunteerData(payload);
    if (!result.ok) {
      return { success: false, message: result.message };
    }
    return { success: true, whatsappUrl: result.whatsappUrl };
  } catch {
    return { success: false, message: 'Não foi possível processar o cadastro.' };
  }
}
