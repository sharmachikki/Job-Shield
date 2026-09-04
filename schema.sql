-- =====================================================================
-- JOB EASY PLATFORM — job_portal_db
-- Complete MySQL Schema (Phase 1 deliverable)
-- Engine: InnoDB | Charset: utf8mb4
-- =====================================================================

CREATE DATABASE IF NOT EXISTS job_portal_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE job_portal_db;

SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================================
-- 1. AUTHENTICATION & USERS
-- =====================================================================

CREATE TABLE users (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  uuid              CHAR(36) NOT NULL UNIQUE,
  full_name         VARCHAR(150) NOT NULL,
  email             VARCHAR(191) NOT NULL UNIQUE,
  phone             VARCHAR(20) UNIQUE,
  password_hash     VARCHAR(255) NOT NULL,
  status            ENUM('ACTIVE','SUSPENDED','BLOCKED','PENDING_VERIFICATION') NOT NULL DEFAULT 'PENDING_VERIFICATION',
  email_verified_at DATETIME NULL,
  phone_verified_at DATETIME NULL,
  last_login_at     DATETIME NULL,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at        DATETIME NULL,
  INDEX idx_users_status (status)
) ENGINE=InnoDB;

CREATE TABLE roles (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code        VARCHAR(50) NOT NULL UNIQUE,      -- SUPER_ADMIN, JOB_SEEKER, EMPLOYER, FREELANCER, TRAINER, MANPOWER_VENDOR ...
  name        VARCHAR(100) NOT NULL,
  description VARCHAR(255) NULL,
  is_admin_role TINYINT(1) NOT NULL DEFAULT 0,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE user_roles (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT UNSIGNED NOT NULL,
  role_id     BIGINT UNSIGNED NOT NULL,
  is_active   TINYINT(1) NOT NULL DEFAULT 1,
  assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_role (user_id, role_id),
  CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE user_sessions (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       BIGINT UNSIGNED NOT NULL,
  refresh_token VARCHAR(500) NOT NULL,
  user_agent    VARCHAR(255) NULL,
  ip_address    VARCHAR(45) NULL,
  expires_at    DATETIME NOT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE password_resets (
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    BIGINT UNSIGNED NOT NULL,
  token      VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  used_at    DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pwreset_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================================
-- 2. PROFILES & SKILLS
-- =====================================================================

CREATE TABLE skills (
  id   BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(100) NULL
) ENGINE=InnoDB;

CREATE TABLE job_seeker_profiles (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         BIGINT UNSIGNED NOT NULL UNIQUE,
  headline        VARCHAR(150) NULL,
  summary         TEXT NULL,
  resume_file_id  BIGINT UNSIGNED NULL,
  photo_file_id   BIGINT UNSIGNED NULL,
  experience_years DECIMAL(4,1) NULL,
  current_salary  DECIMAL(12,2) NULL,
  expected_salary DECIMAL(12,2) NULL,
  location        VARCHAR(150) NULL,
  is_open_to_work TINYINT(1) NOT NULL DEFAULT 1,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_jsp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE education (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  profile_id   BIGINT UNSIGNED NOT NULL,
  institution  VARCHAR(200) NOT NULL,
  degree       VARCHAR(150) NOT NULL,
  field_of_study VARCHAR(150) NULL,
  start_year   YEAR NULL,
  end_year     YEAR NULL,
  CONSTRAINT fk_education_profile FOREIGN KEY (profile_id) REFERENCES job_seeker_profiles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE employment_history (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  profile_id    BIGINT UNSIGNED NOT NULL,
  company_name  VARCHAR(200) NOT NULL,
  designation   VARCHAR(150) NOT NULL,
  start_date    DATE NOT NULL,
  end_date      DATE NULL,
  is_current    TINYINT(1) NOT NULL DEFAULT 0,
  description   TEXT NULL,
  CONSTRAINT fk_emphist_profile FOREIGN KEY (profile_id) REFERENCES job_seeker_profiles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE user_skills (
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    BIGINT UNSIGNED NOT NULL,
  skill_id   BIGINT UNSIGNED NOT NULL,
  proficiency ENUM('BEGINNER','INTERMEDIATE','ADVANCED','EXPERT') DEFAULT 'INTERMEDIATE',
  UNIQUE KEY uq_user_skill (user_id, skill_id),
  CONSTRAINT fk_uskills_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_uskills_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================================
-- 3. RECRUITMENT
-- =====================================================================

CREATE TABLE companies (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(200) NOT NULL,
  industry    VARCHAR(150) NULL,
  website     VARCHAR(255) NULL,
  logo_file_id BIGINT UNSIGNED NULL,
  about       TEXT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE employers (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT UNSIGNED NOT NULL UNIQUE,
  company_id  BIGINT UNSIGNED NOT NULL,
  designation VARCHAR(150) NULL,
  is_verified TINYINT(1) NOT NULL DEFAULT 0,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_employers_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_employers_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE employer_branches (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  company_id  BIGINT UNSIGNED NOT NULL,
  branch_name VARCHAR(150) NOT NULL,
  address     VARCHAR(255) NULL,
  city        VARCHAR(100) NULL,
  country     VARCHAR(100) NULL,
  CONSTRAINT fk_branch_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE jobs (
  id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  employer_id      BIGINT UNSIGNED NOT NULL,
  company_id       BIGINT UNSIGNED NOT NULL,
  title            VARCHAR(200) NOT NULL,
  description      TEXT NOT NULL,
  employment_type  ENUM('FULL_TIME','PART_TIME','CONTRACT','INTERNSHIP','TEMPORARY') NOT NULL,
  location         VARCHAR(150) NULL,
  is_remote        TINYINT(1) NOT NULL DEFAULT 0,
  min_salary       DECIMAL(12,2) NULL,
  max_salary       DECIMAL(12,2) NULL,
  vacancies        INT UNSIGNED NOT NULL DEFAULT 1,
  is_featured      TINYINT(1) NOT NULL DEFAULT 0,
  status           ENUM('DRAFT','SUBMITTED','UNDER_REVIEW','APPROVED','REJECTED','PUBLISHED','CLOSED','EXPIRED') NOT NULL DEFAULT 'DRAFT',
  published_at     DATETIME NULL,
  expires_at       DATETIME NULL,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_jobs_status (status),
  FULLTEXT INDEX ft_jobs_title_desc (title, description),
  CONSTRAINT fk_jobs_employer FOREIGN KEY (employer_id) REFERENCES employers(id) ON DELETE CASCADE,
  CONSTRAINT fk_jobs_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE job_skills (
  id       BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  job_id   BIGINT UNSIGNED NOT NULL,
  skill_id BIGINT UNSIGNED NOT NULL,
  UNIQUE KEY uq_job_skill (job_id, skill_id),
  CONSTRAINT fk_jobskills_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  CONSTRAINT fk_jobskills_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE job_screening_questions (
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  job_id     BIGINT UNSIGNED NOT NULL,
  question   VARCHAR(500) NOT NULL,
  is_required TINYINT(1) NOT NULL DEFAULT 1,
  CONSTRAINT fk_screenq_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE job_applications (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  job_id         BIGINT UNSIGNED NOT NULL,
  candidate_id   BIGINT UNSIGNED NOT NULL,      -- users.id
  resume_file_id BIGINT UNSIGNED NULL,
  cover_letter   TEXT NULL,
  status         ENUM('APPLIED','SCREENING','SHORTLISTED','INTERVIEW','OFFERED','HIRED','REJECTED','WITHDRAWN') NOT NULL DEFAULT 'APPLIED',
  applied_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_job_candidate (job_id, candidate_id),
  CONSTRAINT fk_appl_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  CONSTRAINT fk_appl_candidate FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE interviews (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  application_id BIGINT UNSIGNED NOT NULL,
  round_no       INT UNSIGNED NOT NULL DEFAULT 1,
  scheduled_at   DATETIME NOT NULL,
  mode           ENUM('ONLINE','PHONE','IN_PERSON') NOT NULL DEFAULT 'ONLINE',
  location_or_link VARCHAR(255) NULL,
  status         ENUM('SCHEDULED','COMPLETED','CANCELLED','NO_SHOW') NOT NULL DEFAULT 'SCHEDULED',
  feedback       TEXT NULL,
  rating         TINYINT UNSIGNED NULL,
  CONSTRAINT fk_interview_appl FOREIGN KEY (application_id) REFERENCES job_applications(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE offers (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  application_id BIGINT UNSIGNED NOT NULL UNIQUE,
  offered_salary DECIMAL(12,2) NOT NULL,
  joining_date   DATE NULL,
  status         ENUM('SENT','ACCEPTED','DECLINED','WITHDRAWN','JOINED') NOT NULL DEFAULT 'SENT',
  offer_letter_file_id BIGINT UNSIGNED NULL,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_offer_appl FOREIGN KEY (application_id) REFERENCES job_applications(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================================
-- 4. FREELANCER MARKETPLACE
-- =====================================================================

CREATE TABLE freelancer_profiles (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      BIGINT UNSIGNED NOT NULL UNIQUE,
  headline     VARCHAR(150) NULL,
  bio          TEXT NULL,
  hourly_rate  DECIMAL(10,2) NULL,
  availability ENUM('AVAILABLE','PARTIALLY_AVAILABLE','UNAVAILABLE') NOT NULL DEFAULT 'AVAILABLE',
  rating_avg   DECIMAL(3,2) NOT NULL DEFAULT 0,
  is_verified  TINYINT(1) NOT NULL DEFAULT 0,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_freelprof_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE freelancer_services (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  freelancer_id  BIGINT UNSIGNED NOT NULL,
  title          VARCHAR(200) NOT NULL,
  description    TEXT NULL,
  price          DECIMAL(10,2) NOT NULL,
  delivery_days  INT UNSIGNED NULL,
  status         ENUM('DRAFT','SUBMITTED','UNDER_REVIEW','APPROVED','REJECTED','PUBLISHED') NOT NULL DEFAULT 'DRAFT',
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_freelserv_freelancer FOREIGN KEY (freelancer_id) REFERENCES freelancer_profiles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE portfolios (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  freelancer_id BIGINT UNSIGNED NOT NULL,
  title         VARCHAR(200) NOT NULL,
  description   TEXT NULL,
  file_id       BIGINT UNSIGNED NULL,
  link_url      VARCHAR(255) NULL,
  CONSTRAINT fk_portfolio_freelancer FOREIGN KEY (freelancer_id) REFERENCES freelancer_profiles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE projects (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  client_id    BIGINT UNSIGNED NOT NULL,        -- users.id (employer or job seeker acting as client)
  title        VARCHAR(200) NOT NULL,
  description  TEXT NOT NULL,
  budget_min   DECIMAL(12,2) NULL,
  budget_max   DECIMAL(12,2) NULL,
  budget_type  ENUM('FIXED','HOURLY') NOT NULL DEFAULT 'FIXED',
  status       ENUM('DRAFT','SUBMITTED','UNDER_REVIEW','APPROVED','REJECTED','OPEN','IN_PROGRESS','COMPLETED','CANCELLED') NOT NULL DEFAULT 'DRAFT',
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_projects_client FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE project_skills (
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  project_id BIGINT UNSIGNED NOT NULL,
  skill_id   BIGINT UNSIGNED NOT NULL,
  UNIQUE KEY uq_project_skill (project_id, skill_id),
  CONSTRAINT fk_projskill_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_projskill_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE proposals (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  project_id    BIGINT UNSIGNED NOT NULL,
  freelancer_id BIGINT UNSIGNED NOT NULL,
  cover_letter  TEXT NULL,
  bid_amount    DECIMAL(12,2) NOT NULL,
  delivery_days INT UNSIGNED NULL,
  status        ENUM('SUBMITTED','SHORTLISTED','ACCEPTED','REJECTED','WITHDRAWN') NOT NULL DEFAULT 'SUBMITTED',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_project_freelancer (project_id, freelancer_id),
  CONSTRAINT fk_proposal_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_proposal_freelancer FOREIGN KEY (freelancer_id) REFERENCES freelancer_profiles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE contracts (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  project_id    BIGINT UNSIGNED NOT NULL,
  proposal_id   BIGINT UNSIGNED NOT NULL,
  client_id     BIGINT UNSIGNED NOT NULL,
  freelancer_id BIGINT UNSIGNED NOT NULL,
  total_amount  DECIMAL(12,2) NOT NULL,
  status        ENUM('ACTIVE','COMPLETED','TERMINATED','DISPUTED') NOT NULL DEFAULT 'ACTIVE',
  started_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ended_at      DATETIME NULL,
  CONSTRAINT fk_contract_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_contract_proposal FOREIGN KEY (proposal_id) REFERENCES proposals(id) ON DELETE CASCADE,
  CONSTRAINT fk_contract_client FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_contract_freelancer FOREIGN KEY (freelancer_id) REFERENCES freelancer_profiles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE project_milestones (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  contract_id BIGINT UNSIGNED NOT NULL,
  title       VARCHAR(200) NOT NULL,
  amount      DECIMAL(12,2) NOT NULL,
  due_date    DATE NULL,
  status      ENUM('PENDING','IN_PROGRESS','SUBMITTED','APPROVED','PAID','DISPUTED') NOT NULL DEFAULT 'PENDING',
  CONSTRAINT fk_milestone_contract FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE deliverables (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  milestone_id BIGINT UNSIGNED NOT NULL,
  file_id      BIGINT UNSIGNED NULL,
  notes        TEXT NULL,
  submitted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_deliverable_milestone FOREIGN KEY (milestone_id) REFERENCES project_milestones(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================================
-- 5. TRAINING
-- =====================================================================

CREATE TABLE trainer_profiles (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT UNSIGNED NOT NULL UNIQUE,
  headline    VARCHAR(150) NULL,
  bio         TEXT NULL,
  expertise   VARCHAR(255) NULL,
  is_verified TINYINT(1) NOT NULL DEFAULT 0,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_trainerprof_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE training_programs (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  trainer_id  BIGINT UNSIGNED NOT NULL,
  title       VARCHAR(200) NOT NULL,
  description TEXT NULL,
  price       DECIMAL(10,2) NOT NULL,
  duration_hours INT UNSIGNED NULL,
  status      ENUM('DRAFT','SUBMITTED','UNDER_REVIEW','APPROVED','REJECTED','PUBLISHED') NOT NULL DEFAULT 'DRAFT',
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_program_trainer FOREIGN KEY (trainer_id) REFERENCES trainer_profiles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE training_requirements (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  requester_id BIGINT UNSIGNED NOT NULL,        -- users.id (employer requesting corporate training)
  title       VARCHAR(200) NOT NULL,
  description TEXT NULL,
  budget      DECIMAL(12,2) NULL,
  status      ENUM('OPEN','IN_REVIEW','ASSIGNED','CLOSED') NOT NULL DEFAULT 'OPEN',
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_trainreq_requester FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE training_proposals (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  requirement_id BIGINT UNSIGNED NOT NULL,
  trainer_id     BIGINT UNSIGNED NOT NULL,
  proposal_text  TEXT NULL,
  quoted_price   DECIMAL(12,2) NOT NULL,
  status         ENUM('SUBMITTED','ACCEPTED','REJECTED','WITHDRAWN') NOT NULL DEFAULT 'SUBMITTED',
  CONSTRAINT fk_trainprop_requirement FOREIGN KEY (requirement_id) REFERENCES training_requirements(id) ON DELETE CASCADE,
  CONSTRAINT fk_trainprop_trainer FOREIGN KEY (trainer_id) REFERENCES trainer_profiles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE training_batches (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  program_id  BIGINT UNSIGNED NOT NULL,
  batch_name  VARCHAR(100) NOT NULL,
  start_date  DATE NOT NULL,
  end_date    DATE NULL,
  capacity    INT UNSIGNED NULL,
  status      ENUM('UPCOMING','ONGOING','COMPLETED','CANCELLED') NOT NULL DEFAULT 'UPCOMING',
  CONSTRAINT fk_batch_program FOREIGN KEY (program_id) REFERENCES training_programs(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE training_sessions (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  batch_id    BIGINT UNSIGNED NOT NULL,
  session_no  INT UNSIGNED NOT NULL,
  scheduled_at DATETIME NOT NULL,
  topic       VARCHAR(200) NULL,
  meeting_link VARCHAR(255) NULL,
  CONSTRAINT fk_session_batch FOREIGN KEY (batch_id) REFERENCES training_batches(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE enrollments (
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  batch_id   BIGINT UNSIGNED NOT NULL,
  learner_id BIGINT UNSIGNED NOT NULL,          -- users.id
  status     ENUM('ENROLLED','COMPLETED','DROPPED') NOT NULL DEFAULT 'ENROLLED',
  enrolled_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_batch_learner (batch_id, learner_id),
  CONSTRAINT fk_enroll_batch FOREIGN KEY (batch_id) REFERENCES training_batches(id) ON DELETE CASCADE,
  CONSTRAINT fk_enroll_learner FOREIGN KEY (learner_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE training_attendance (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  session_id   BIGINT UNSIGNED NOT NULL,
  enrollment_id BIGINT UNSIGNED NOT NULL,
  status       ENUM('PRESENT','ABSENT','LATE') NOT NULL DEFAULT 'PRESENT',
  CONSTRAINT fk_attendance_session FOREIGN KEY (session_id) REFERENCES training_sessions(id) ON DELETE CASCADE,
  CONSTRAINT fk_attendance_enrollment FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE assessments (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  enrollment_id BIGINT UNSIGNED NOT NULL,
  score        DECIMAL(5,2) NULL,
  max_score    DECIMAL(5,2) NULL,
  result       ENUM('PASS','FAIL','PENDING') NOT NULL DEFAULT 'PENDING',
  graded_at    DATETIME NULL,
  CONSTRAINT fk_assessment_enrollment FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE certificates (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  enrollment_id BIGINT UNSIGNED NOT NULL UNIQUE,
  certificate_file_id BIGINT UNSIGNED NULL,
  issued_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  certificate_no VARCHAR(100) NOT NULL UNIQUE,
  CONSTRAINT fk_certificate_enrollment FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================================
-- 6. MANPOWER
-- =====================================================================

CREATE TABLE manpower_categories (
  id   BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE manpower_vendors (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       BIGINT UNSIGNED NOT NULL UNIQUE,
  company_name  VARCHAR(200) NOT NULL,
  registration_no VARCHAR(100) NULL,
  is_verified   TINYINT(1) NOT NULL DEFAULT 0,
  status        ENUM('DRAFT','SUBMITTED','UNDER_REVIEW','APPROVED','REJECTED','SUSPENDED') NOT NULL DEFAULT 'DRAFT',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_vendor_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE vendor_categories (
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  vendor_id  BIGINT UNSIGNED NOT NULL,
  category_id BIGINT UNSIGNED NOT NULL,
  UNIQUE KEY uq_vendor_category (vendor_id, category_id),
  CONSTRAINT fk_vcat_vendor FOREIGN KEY (vendor_id) REFERENCES manpower_vendors(id) ON DELETE CASCADE,
  CONSTRAINT fk_vcat_category FOREIGN KEY (category_id) REFERENCES manpower_categories(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE manpower_requirements (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  requester_id BIGINT UNSIGNED NOT NULL,        -- users.id (employer)
  category_id BIGINT UNSIGNED NOT NULL,
  title       VARCHAR(200) NOT NULL,
  description TEXT NULL,
  quantity    INT UNSIGNED NOT NULL DEFAULT 1,
  location    VARCHAR(150) NULL,
  status      ENUM('OPEN','IN_REVIEW','AWARDED','CLOSED') NOT NULL DEFAULT 'OPEN',
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_manreq_requester FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_manreq_category FOREIGN KEY (category_id) REFERENCES manpower_categories(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE vendor_quotations (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  requirement_id BIGINT UNSIGNED NOT NULL,
  vendor_id      BIGINT UNSIGNED NOT NULL,
  quoted_amount  DECIMAL(12,2) NOT NULL,
  notes          TEXT NULL,
  status         ENUM('SUBMITTED','ACCEPTED','REJECTED','WITHDRAWN') NOT NULL DEFAULT 'SUBMITTED',
  CONSTRAINT fk_quote_requirement FOREIGN KEY (requirement_id) REFERENCES manpower_requirements(id) ON DELETE CASCADE,
  CONSTRAINT fk_quote_vendor FOREIGN KEY (vendor_id) REFERENCES manpower_vendors(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE worker_deployments (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  requirement_id BIGINT UNSIGNED NOT NULL,
  vendor_id      BIGINT UNSIGNED NOT NULL,
  worker_name    VARCHAR(150) NOT NULL,
  worker_contact VARCHAR(50) NULL,
  deployed_on    DATE NOT NULL,
  released_on    DATE NULL,
  status         ENUM('DEPLOYED','ACTIVE','RELEASED','TERMINATED') NOT NULL DEFAULT 'DEPLOYED',
  CONSTRAINT fk_deploy_requirement FOREIGN KEY (requirement_id) REFERENCES manpower_requirements(id) ON DELETE CASCADE,
  CONSTRAINT fk_deploy_vendor FOREIGN KEY (vendor_id) REFERENCES manpower_vendors(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE manpower_attendance (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  deployment_id BIGINT UNSIGNED NOT NULL,
  work_date     DATE NOT NULL,
  status        ENUM('PRESENT','ABSENT','HALF_DAY','LEAVE') NOT NULL DEFAULT 'PRESENT',
  hours_worked  DECIMAL(4,2) NULL,
  CONSTRAINT fk_mpattendance_deployment FOREIGN KEY (deployment_id) REFERENCES worker_deployments(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE timesheets (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  deployment_id BIGINT UNSIGNED NOT NULL,
  period_start  DATE NOT NULL,
  period_end    DATE NOT NULL,
  total_hours   DECIMAL(6,2) NOT NULL DEFAULT 0,
  status        ENUM('DRAFT','SUBMITTED','APPROVED','INVOICED') NOT NULL DEFAULT 'DRAFT',
  CONSTRAINT fk_timesheet_deployment FOREIGN KEY (deployment_id) REFERENCES worker_deployments(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================================
-- 7. GOVERNANCE — CENTRAL APPROVAL ENGINE & AUDIT
-- =====================================================================

CREATE TABLE approvals (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  entity_type   VARCHAR(50) NOT NULL,   -- JOB, FREELANCER_SERVICE, TRAINING_PROGRAM, VENDOR, MANPOWER_REQUIREMENT, DOCUMENT, PROMO_LISTING ...
  entity_id     BIGINT UNSIGNED NOT NULL,
  submitted_by  BIGINT UNSIGNED NOT NULL,       -- users.id
  status        ENUM('DRAFT','SUBMITTED','UNDER_REVIEW','APPROVED','REJECTED','CORRECTION_REQUIRED','RESUBMITTED') NOT NULL DEFAULT 'SUBMITTED',
  assigned_to   BIGINT UNSIGNED NULL,           -- admin user
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_approvals_entity (entity_type, entity_id),
  CONSTRAINT fk_approvals_submitter FOREIGN KEY (submitted_by) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_approvals_assignee FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE approval_history (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  approval_id  BIGINT UNSIGNED NOT NULL,
  from_status  VARCHAR(30) NULL,
  to_status    VARCHAR(30) NOT NULL,
  changed_by   BIGINT UNSIGNED NOT NULL,
  changed_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_apphist_approval FOREIGN KEY (approval_id) REFERENCES approvals(id) ON DELETE CASCADE,
  CONSTRAINT fk_apphist_user FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE approval_comments (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  approval_id BIGINT UNSIGNED NOT NULL,
  author_id   BIGINT UNSIGNED NOT NULL,
  comment     TEXT NOT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_appcomment_approval FOREIGN KEY (approval_id) REFERENCES approvals(id) ON DELETE CASCADE,
  CONSTRAINT fk_appcomment_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE audit_logs (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  actor_id    BIGINT UNSIGNED NULL,
  action      VARCHAR(100) NOT NULL,     -- e.g. JOB_APPROVED, WALLET_DEBITED, USER_SUSPENDED
  entity_type VARCHAR(50) NULL,
  entity_id   BIGINT UNSIGNED NULL,
  metadata    JSON NULL,
  ip_address  VARCHAR(45) NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_entity (entity_type, entity_id),
  CONSTRAINT fk_audit_actor FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- =====================================================================
-- 8. FINANCE — PRICING, PAYMENTS, WALLET, INVOICES
-- =====================================================================

CREATE TABLE pricing_rules (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code        VARCHAR(60) NOT NULL UNIQUE,   -- JOB_POST_FEE, FEATURED_JOB_FEE, FREELANCER_COMMISSION_PCT, TRAINING_COMMISSION_PCT, VENDOR_REG_FEE ...
  name        VARCHAR(150) NOT NULL,
  value_type  ENUM('FLAT','PERCENTAGE') NOT NULL DEFAULT 'FLAT',
  amount      DECIMAL(12,2) NOT NULL,
  is_active   TINYINT(1) NOT NULL DEFAULT 1,
  effective_from DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  effective_to   DATETIME NULL
) ENGINE=InnoDB;

CREATE TABLE subscriptions (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT UNSIGNED NOT NULL,
  plan_code   VARCHAR(60) NOT NULL,
  price       DECIMAL(12,2) NOT NULL,
  starts_at   DATETIME NOT NULL,
  ends_at     DATETIME NOT NULL,
  status      ENUM('ACTIVE','EXPIRED','CANCELLED') NOT NULL DEFAULT 'ACTIVE',
  CONSTRAINT fk_subscription_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE coupons (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code          VARCHAR(50) NOT NULL UNIQUE,
  discount_type ENUM('FLAT','PERCENTAGE') NOT NULL DEFAULT 'PERCENTAGE',
  value         DECIMAL(10,2) NOT NULL,
  max_uses      INT UNSIGNED NULL,
  used_count    INT UNSIGNED NOT NULL DEFAULT 0,
  valid_from    DATETIME NOT NULL,
  valid_to      DATETIME NOT NULL,
  is_active     TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE discounts (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  applies_to  VARCHAR(60) NOT NULL,   -- e.g. JOB_POST_FEE
  percentage  DECIMAL(5,2) NOT NULL,
  starts_at   DATETIME NOT NULL,
  ends_at     DATETIME NOT NULL
) ENGINE=InnoDB;

CREATE TABLE tax_rules (
  id      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  region  VARCHAR(100) NOT NULL,
  name    VARCHAR(100) NOT NULL,       -- e.g. GST
  percentage DECIMAL(5,2) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE wallets (
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    BIGINT UNSIGNED NOT NULL UNIQUE,
  balance    DECIMAL(14,2) NOT NULL DEFAULT 0,
  hold_balance DECIMAL(14,2) NOT NULL DEFAULT 0,
  currency   VARCHAR(10) NOT NULL DEFAULT 'INR',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_wallet_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE transactions (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id        BIGINT UNSIGNED NOT NULL,
  reference_type VARCHAR(60) NULL,     -- JOB_POST_FEE, MILESTONE_PAYMENT, WALLET_TOPUP ...
  reference_id   BIGINT UNSIGNED NULL,
  gateway        VARCHAR(50) NULL,     -- razorpay, stripe, etc.
  gateway_txn_id VARCHAR(150) NULL,
  amount         DECIMAL(14,2) NOT NULL,
  currency       VARCHAR(10) NOT NULL DEFAULT 'INR',
  status         ENUM('PENDING','SUCCESS','FAILED','ON_HOLD','RELEASED','REFUNDED','PARTIAL_REFUND') NOT NULL DEFAULT 'PENDING',
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_txn_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE payment_events (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  transaction_id BIGINT UNSIGNED NOT NULL,
  event_type     VARCHAR(60) NOT NULL,  -- webhook event name
  payload        JSON NULL,
  received_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_payevent_txn FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE wallet_transactions (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  wallet_id    BIGINT UNSIGNED NOT NULL,
  txn_type     ENUM('CREDIT','DEBIT','HOLD','RELEASE') NOT NULL,
  amount       DECIMAL(14,2) NOT NULL,
  balance_after DECIMAL(14,2) NOT NULL,
  reference_type VARCHAR(60) NULL,
  reference_id   BIGINT UNSIGNED NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_wtxn_wallet FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE invoices (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  invoice_no   VARCHAR(60) NOT NULL UNIQUE,
  user_id      BIGINT UNSIGNED NOT NULL,
  subtotal     DECIMAL(14,2) NOT NULL,
  tax_amount   DECIMAL(14,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(14,2) NOT NULL,
  status       ENUM('DRAFT','ISSUED','PAID','OVERDUE','CANCELLED') NOT NULL DEFAULT 'DRAFT',
  issued_at    DATETIME NULL,
  due_at       DATETIME NULL,
  CONSTRAINT fk_invoice_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE invoice_items (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  invoice_id  BIGINT UNSIGNED NOT NULL,
  description VARCHAR(255) NOT NULL,
  quantity    INT UNSIGNED NOT NULL DEFAULT 1,
  unit_price  DECIMAL(14,2) NOT NULL,
  amount      DECIMAL(14,2) NOT NULL,
  CONSTRAINT fk_invitem_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE refunds (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  transaction_id BIGINT UNSIGNED NOT NULL,
  amount         DECIMAL(14,2) NOT NULL,
  reason         VARCHAR(255) NULL,
  status         ENUM('PENDING','PROCESSED','REJECTED') NOT NULL DEFAULT 'PENDING',
  processed_at   DATETIME NULL,
  CONSTRAINT fk_refund_txn FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================================
-- 9. SUPPORT — MESSAGING, DOCUMENTS, DISPUTES, REVIEWS, NOTIFICATIONS
-- =====================================================================

CREATE TABLE conversations (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  subject     VARCHAR(200) NULL,
  context_type VARCHAR(60) NULL,   -- JOB_APPLICATION, PROJECT, TRAINING, MANPOWER
  context_id  BIGINT UNSIGNED NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE conversation_participants (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  conversation_id BIGINT UNSIGNED NOT NULL,
  user_id         BIGINT UNSIGNED NOT NULL,
  joined_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_conv_user (conversation_id, user_id),
  CONSTRAINT fk_convpart_conv FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  CONSTRAINT fk_convpart_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE messages (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  conversation_id BIGINT UNSIGNED NOT NULL,
  sender_id       BIGINT UNSIGNED NOT NULL,
  body            TEXT NOT NULL,
  is_flagged      TINYINT(1) NOT NULL DEFAULT 0,
  sent_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  read_at         DATETIME NULL,
  CONSTRAINT fk_message_conv FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  CONSTRAINT fk_message_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE message_attachments (
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  message_id BIGINT UNSIGNED NOT NULL,
  file_id    BIGINT UNSIGNED NOT NULL,
  CONSTRAINT fk_msgattach_message FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE message_flags (
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  message_id BIGINT UNSIGNED NOT NULL,
  flagged_by BIGINT UNSIGNED NULL,     -- NULL = system auto-flag
  reason     VARCHAR(255) NULL,
  resolved   TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_msgflag_message FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE files (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  uploaded_by  BIGINT UNSIGNED NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  storage_path VARCHAR(500) NOT NULL,
  mime_type    VARCHAR(100) NULL,
  size_bytes   BIGINT UNSIGNED NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_files_uploader FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE documents (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      BIGINT UNSIGNED NOT NULL,
  file_id      BIGINT UNSIGNED NOT NULL,
  document_type VARCHAR(60) NOT NULL,  -- ID_PROOF, COMPANY_REG, GST_CERT, RESUME, CERTIFICATE ...
  status       ENUM('UPLOADED','UNDER_VERIFICATION','VERIFIED','REJECTED','RESUBMIT_REQUIRED') NOT NULL DEFAULT 'UPLOADED',
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_document_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_document_file FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE document_verifications (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  document_id  BIGINT UNSIGNED NOT NULL,
  verified_by  BIGINT UNSIGNED NULL,    -- admin user
  decision     ENUM('VERIFIED','REJECTED') NOT NULL,
  remarks      VARCHAR(255) NULL,
  decided_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_docverify_document FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
  CONSTRAINT fk_docverify_admin FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE disputes (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  raised_by      BIGINT UNSIGNED NOT NULL,
  against_user_id BIGINT UNSIGNED NULL,
  context_type   VARCHAR(60) NOT NULL,   -- CONTRACT, MILESTONE, MANPOWER_DEPLOYMENT, TRAINING_PROGRAM
  context_id     BIGINT UNSIGNED NOT NULL,
  reason         TEXT NOT NULL,
  status         ENUM('OPEN','PAYMENT_HOLD','UNDER_REVIEW','RESOLVED','CLOSED') NOT NULL DEFAULT 'OPEN',
  resolution     ENUM('RELEASE','PARTIAL_RELEASE','REFUND','REVISION') NULL,
  resolved_by    BIGINT UNSIGNED NULL,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at    DATETIME NULL,
  CONSTRAINT fk_dispute_raiser FOREIGN KEY (raised_by) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_dispute_against FOREIGN KEY (against_user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_dispute_resolver FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE dispute_evidence (
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  dispute_id BIGINT UNSIGNED NOT NULL,
  file_id    BIGINT UNSIGNED NOT NULL,
  uploaded_by BIGINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_evidence_dispute FOREIGN KEY (dispute_id) REFERENCES disputes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE reviews (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  reviewer_id BIGINT UNSIGNED NOT NULL,
  reviewee_id BIGINT UNSIGNED NOT NULL,
  context_type VARCHAR(60) NOT NULL,   -- CONTRACT, TRAINING_PROGRAM, JOB
  context_id  BIGINT UNSIGNED NOT NULL,
  rating      TINYINT UNSIGNED NOT NULL,
  comment     TEXT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_review_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_review_reviewee FOREIGN KEY (reviewee_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE notifications (
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    BIGINT UNSIGNED NOT NULL,
  type       VARCHAR(60) NOT NULL,
  title      VARCHAR(200) NOT NULL,
  body       VARCHAR(500) NULL,
  is_read    TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================================
-- 10. SITE CONFIGURATION — admin console "Settings" menu
-- Single-row config table backing the Settings screen's 5 tabs:
-- Site content, Media & images, Header & footer, Theme.
-- (Offers & promotions reuses the existing coupons / discounts tables.)
-- =====================================================================

CREATE TABLE site_settings (
  id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

  -- Site content tab
  hero_heading        VARCHAR(255) NULL,
  hero_subtext        TEXT NULL,
  about_copy          TEXT NULL,
  support_email       VARCHAR(191) NULL,

  -- Media & images tab
  logo_file_id        BIGINT UNSIGNED NULL,
  hero_image_file_id  BIGINT UNSIGNED NULL,
  favicon_file_id     BIGINT UNSIGNED NULL,

  -- Header & footer tab
  nav_links           JSON NULL,        -- [{ "label": "Jobs", "url": "/jobs", "visible": true }, ...]
  footer_tagline      VARCHAR(255) NULL,
  footer_links        JSON NULL,        -- ["About", "Contact", "Terms", "Privacy"]
  social_links        JSON NULL,        -- ["https://linkedin.com/company/...", ...]

  -- Theme tab
  theme_accent        VARCHAR(7) NOT NULL DEFAULT '#B8863B',
  theme_base          VARCHAR(7) NOT NULL DEFAULT '#14213D',

  updated_by          BIGINT UNSIGNED NULL,
  updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_sitesettings_logo    FOREIGN KEY (logo_file_id)       REFERENCES files(id) ON DELETE SET NULL,
  CONSTRAINT fk_sitesettings_hero    FOREIGN KEY (hero_image_file_id) REFERENCES files(id) ON DELETE SET NULL,
  CONSTRAINT fk_sitesettings_favicon FOREIGN KEY (favicon_file_id)    REFERENCES files(id) ON DELETE SET NULL,
  CONSTRAINT fk_sitesettings_updater FOREIGN KEY (updated_by)         REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
-- SEED: default roles
-- =====================================================================
INSERT INTO roles (code, name, is_admin_role) VALUES
('SUPER_ADMIN','Super Admin',1),
('FINANCE_ADMIN','Finance Admin',1),
('VERIFICATION_ADMIN','Verification Admin',1),
('SUPPORT_ADMIN','Support Admin',1),
('CONTENT_ADMIN','Content Admin',1),
('OPERATIONS_ADMIN','Operations Admin',1),
('JOB_SEEKER','Job Seeker',0),
('EMPLOYER','Employer',0),
('FREELANCER','Freelancer',0),
('TRAINER','Trainer',0),
('MANPOWER_VENDOR','Manpower Vendor',0);

-- =====================================================================
-- SEED: default site settings (singleton row, id = 1)
-- =====================================================================
INSERT INTO site_settings (
  id, hero_heading, hero_subtext, about_copy, support_email,
  nav_links, footer_tagline, footer_links, social_links,
  theme_accent, theme_base
) VALUES (
  1,
  'One platform. Five ways to put people to work.',
  'Post a job, hire a freelancer, book a trainer, or request deployed manpower — every listing runs through the same central approval, pricing, and payment engine.',
  'Job Easy connects employers, freelancers, trainers, and manpower vendors on one verified, centrally governed platform.',
  'support@jobeasy.example',
  JSON_ARRAY(
    JSON_OBJECT('label','Jobs','url','/jobs','visible',TRUE),
    JSON_OBJECT('label','Freelancers','url','/freelancers','visible',TRUE),
    JSON_OBJECT('label','Trainers','url','/trainers','visible',TRUE),
    JSON_OBJECT('label','Manpower','url','/manpower','visible',TRUE)
  ),
  'Hiring, freelancing, training, and manpower — verified end to end.',
  JSON_ARRAY('About','Contact','Terms','Privacy'),
  JSON_ARRAY('https://linkedin.com/company/jobeasy','https://twitter.com/jobeasy'),
  '#B8863B',
  '#14213D'
);
