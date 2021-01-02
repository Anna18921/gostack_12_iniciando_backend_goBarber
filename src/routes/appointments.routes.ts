import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import CreateAppointmentServices from '../services/CreateAppointmentService';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

import ensureAuthenticated from '../middlewares/ensureAuthentiticated';

const appointmentsRoutes = Router();

appointmentsRoutes.use(ensureAuthenticated);

appointmentsRoutes.get('/', async (request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);

  const appointments = await appointmentsRepository.find();
  console.log('teste get');
  response.status(201).json({ appointments });
});

appointmentsRoutes.post('/', async (request, response) => {
  try {
    const { provider_id, date } = request.body;

    const parsedDate = parseISO(date);

    const createAppointments = new CreateAppointmentServices();

    const appointment = await createAppointments.execute({
      date: parsedDate,
      provider_id,
    });

    return response.json(appointment);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default appointmentsRoutes;
