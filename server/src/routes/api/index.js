import user from './user.js';
import availableHours from './availableHours.js'

export default function configureRoutes(app) {
    app.use('/api/users', user);  
    app.use('/api/available-hours', availableHours);  
}