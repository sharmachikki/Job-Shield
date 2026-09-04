# API Structure — /api/v1

/auth  /users  /roles  /profiles
/jobs  /applications  /candidates  /employers
/freelancers  /services  /projects  /proposals  /contracts  /milestones
/trainers  /training-programs  /enrollments
/manpower  /vendors  /requirements  /deployments
/approvals  /pricing
/payments  /wallet  /invoices
/messages  /documents  /files
/disputes  /reviews  /notifications
/reports  /audit

Every path above is mounted in backend/src/routes/index.js and backed by a
module of the same name under backend/src/modules/.
