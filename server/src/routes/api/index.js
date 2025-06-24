import user from './user.js';
import admin from './admin.js';
import teacher from './teacher.js'
import student from './student.js'
import ai from './ai.js';

export default function configureRoutes(app) {
    app.use('/api/users', user);  
    app.use('/api/admin', admin);
    app.use('/api/teacher', teacher);  
    app.use('/api/student', student); 
    app.use('/api/ai', ai) 
}