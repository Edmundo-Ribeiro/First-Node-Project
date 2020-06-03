import { Router } from 'express';
import ensureAuthentication from '@modules/users/infra/http/midlewares/ensureAuthentication';
import AppointmentsController from '../controllers/AppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

appointmentsRouter.use(ensureAuthentication);
appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;
