import {
  Appointment,
  AppointmentPeriod,
  AppointmentPeriodDay,
} from '@/types/appointment';
import { Appointment as AppontmentPrisma } from '@/generated/prisma/client';

export const getPeriod = (hour: number): AppointmentPeriodDay => {
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  return 'evening';
};

export function groupAppointmentsByPeriod(
  appointments: AppontmentPrisma[]
): AppointmentPeriod[] {
  const tranformedAppointments: Appointment[] = appointments?.map((apt) => ({
    ...apt,
    time: apt.scheduleAt.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    service: apt.description,
    period: getPeriod(apt.scheduleAt.getHours()),
  }));

  const morningAppointments = tranformedAppointments.filter(
    (apt) => apt.period === 'morning'
  );
  const afternoonAppointments = tranformedAppointments.filter(
    (apt) => apt.period === 'afternoon'
  );
  const eveningAppointments = tranformedAppointments.filter(
    (apt) => apt.period === 'evening'
  );

  return [
    {
      title: 'Manhã',
      type: 'morning',
      timeRange: '09h - 12h',
      appointments: morningAppointments,
    },
    {
      title: 'Tarde',
      type: 'afternoon',
      timeRange: '12h - 18h',
      appointments: afternoonAppointments,
    },
    {
      title: 'Noite',
      type: 'evening',
      timeRange: '19h - 21h',
      appointments: eveningAppointments,
    },
  ];
}
