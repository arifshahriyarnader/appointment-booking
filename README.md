# Appointment Booking

- Booking Appointment System Project between the university teacher and the student.
There are three functionalities in this project: Admin, Teacher, and Student.

## Admin Functionalities:
- Admin approves or rejects user registration request, without admin approval,
the user can't be logged in.
- Admin can create, view, and delete teacher and student.
- Admin can view the registration request.

## Teacher Functionalities:
- Teachers can sign up with a teacher name, email, password, course, and
department. After admin approval of the registration, teachers can log in.
- Teacher can log in/log out from the system.
- Teacher can create, delete, and update available hours in a week.
- Teacher can view appointment requests including date, course, and agenda.
- Teacher can approve or reject appointment requests.
- Teacher can view daily, upcoming, and past appointment schedules
including course names, student names, agendas, date, and time slot.

## Student Functionalities:
- Students can sign up with a student name, email, password, student ID, and
department. After the admin user registration approval then the user can be
logged in.
- Students can log in/log out of the system.
- Students can view all teacher lists the teacher profiles and the teacher's
available hours.
- Students can book an appointment.
- Students can view appointment status as approved or rejected.
- Students can view the daily, upcoming, and past appointment schedule
including the teacher's name, email, course, agenda, date, and time slot.

## Tech Stack Used: 

- **Client**: React JS, Shadcn, Tailwind CSS
- **Server**: Express JS
- **Database**: MongoDB
- **API Testing**: Postman

## Set up Instruction

### Backend Setup

1. Clone the repository
   ```bash
   git clone https://github.com/arifshahriyarnader/appointment-booking.git

2. Navigate to the server folder:
   ```bash
   cd server

3. Install Dependencies
	```bash
	npm install

4. Create a .env file
	```bash
	PORT=5000
	MONGODB_URI=your_mongodb_connection_string
	JWT_SECRET=your_jwt_secret

5. Start the server
	```bash 
	npm run dev


### Client Setup

1. Open a new terminal and navigate to the client folder:
	```bash
	cd client

2. Install Dependencies:
	```bash
	npm install

3. Create a .env file:
	```bash
	VITE_API_URL=http://localhost:5000
    VITE_CURRENT_USER_KEY=MINI_CRM_LOGGED_IN_USER

4. Start the client development server
	```bash
	npm run dev