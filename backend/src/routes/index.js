const express = require('express');

const router = express.Router();

// Every module exposes its own express.Router(); mounted here under its resource path.
// This file is the single map of the public API surface — see docs/api-structure.md.
router.use('/auth', require('../modules/auth/auth.routes'));
router.use('/users', require('../modules/users/users.routes'));
router.use('/roles', require('../modules/roles/roles.routes'));
router.use('/profiles', require('../modules/profiles/profiles.routes'));

router.use('/jobs', require('../modules/jobs/jobs.routes'));
router.use('/applications', require('../modules/applications/applications.routes'));
router.use('/employers', require('../modules/employers/employers.routes'));
router.use('/candidates', require('../modules/candidates/candidates.routes'));

router.use('/freelancers', require('../modules/freelancers/freelancers.routes'));
router.use('/services', require('../modules/services/services.routes'));
router.use('/projects', require('../modules/projects/projects.routes'));
router.use('/proposals', require('../modules/proposals/proposals.routes'));
router.use('/contracts', require('../modules/contracts/contracts.routes'));
router.use('/milestones', require('../modules/milestones/milestones.routes'));

router.use('/trainers', require('../modules/trainers/trainers.routes'));
router.use('/training-programs', require('../modules/training-programs/training-programs.routes'));
router.use('/enrollments', require('../modules/enrollments/enrollments.routes'));

router.use('/manpower', require('../modules/manpower/manpower.routes'));
router.use('/vendors', require('../modules/vendors/vendors.routes'));
router.use('/requirements', require('../modules/requirements/requirements.routes'));
router.use('/deployments', require('../modules/deployments/deployments.routes'));

router.use('/approvals', require('../modules/approvals/approvals.routes'));
router.use('/pricing', require('../modules/pricing/pricing.routes'));

router.use('/payments', require('../modules/payments/payments.routes'));
router.use('/wallet', require('../modules/wallet/wallet.routes'));
router.use('/invoices', require('../modules/invoices/invoices.routes'));

router.use('/messages', require('../modules/messages/messages.routes'));
router.use('/documents', require('../modules/documents/documents.routes'));
router.use('/files', require('../modules/files/files.routes'));

router.use('/disputes', require('../modules/disputes/disputes.routes'));
router.use('/reviews', require('../modules/reviews/reviews.routes'));
router.use('/notifications', require('../modules/notifications/notifications.routes'));

router.use('/reports', require('../modules/reports/reports.routes'));
router.use('/audit', require('../modules/audit/audit.routes'));

router.use('/settings', require('../modules/site-settings/site-settings.routes'));

module.exports = router;
