import user from './user.js';
import availableHours from './availableHours.js'
import student from './student.js'

export default function configureRoutes(app) {
    app.use('/api/users', user);  
    app.use('/api/available-hours', availableHours);  
    app.use('/api/student-appointment', student);  
}