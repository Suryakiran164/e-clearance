# MINI PROJECT : E-Clearance 

**Problem Statement: Design and Development of IMS portal for Eductional Institutions.**  

Educational institutions continue to rely on fragmented systems and paper-based workflows, resulting in inefficiencies, delays, and lack of centralized access.  
The proposed project, E-Clearance, aims to integrate key academic and administrative processes into a single, user-friendly platform, enabling students, staff, and administrators to manage forms, approvals, and institutional data digitally.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/) 

![Version](https://img.shields.io/badge/version-v1.0-darkblue)

## Requirements and Installation
*__NOTE__: This project is purely based on __MERN STACK__* 
* Setup Node.js, React.js, Express.js and its environments
* Setup .env file (use your credentials)
* Setup mongodb cluster and upadate in local .env file
* Clone the repository 
* run `npm install` in both major directories (/frontend, /backend)
* run `npm run server` to start backend
* run `npm start` to start frontend

## Usage
* **Admin Setup**: The Admin (suadmin) first logs in and uses the User Management page (/admin/users) to create all users (Students, Proctors, HODs, Principal). Crucially, the Admin must map every Student to a specific Proctor in the database.  
* **Student Action**: A Student logs in and navigates to "Submit New Common Form." The student fills out the request details and submits the form.  
* **Proctor Approval (Level 1)**: The form immediately appears in the Proctor Dashboard inbox. The Proctor reviews the request and must choose one of three actions: Accept (workflow ends), Reject (workflow ends, reason required), or Escalate (sends the form to the HOD).  
* **HOD Approval (Level 2)**: If the Proctor escalates, the form moves to the HOD Dashboard inbox (filtered by the student's department). The HOD reviews the form and either Accepts (workflow ends), Rejects, or Escalates the request to the Principal.  
* **Principal Approval (Final Level 3)**: If the HOD escalates, the form reaches the Principal Dashboard inbox. The Principal makes the final decision (Accept or Reject).  
* **Status and Acknowledgment**: The Student can track the real-time status of the form (Pending -> Proctor, Accepted, or Rejected) on their dashboard. If accepted by any authority, the student can print the final acknowledgment.

## Support
For any queries contact
- [Email support](mailto:suryakiran.23cs@saividya.ac.in)
- [Issues](https://github.com/Suryakiran164/Lazyfill-SVIT/issues/new)

## Team members 

* Surya  Kiran - [LinkedIn](https://www.linkedin.com/in/surya-kiran-aa9189370)
* Yashwanth Reddy R - [LinkedIn](https://www.linkedin.com/in/yashwanth-reddy-r-630ba12a6)
* Shashi M N - [LinkedIn](https://www.linkedin.com/in/shashi-mn-6a9a93385)
* Sharath Suresh Gouda - [LinkedIn](https://www.linkedin.com/in/tejasn1906)
* Tejas N - [LinkedIn](https://www.linkedin.com/in/tejasn1906)
* Shashi M N - [LinkedIn](https://www.linkedin.com/in/shashi-mn-6a9a93385)
* Monika S - [LinkedIn](https://www.linkedin.com/in/monika-s-294559275)
* Manasa G Nadiger - [LinkedIn](https://www.linkedin.com/in/manasa-nadiger-45b038306)
* Tejaswini Mali - [LinkedIn](https://www.linkedin.com/in/tejaswini-mali-032510384)
* Prashanth D R - [LinkedIn](https://www.linkedin.com/in/prashanth-d-r-b769042b8)
